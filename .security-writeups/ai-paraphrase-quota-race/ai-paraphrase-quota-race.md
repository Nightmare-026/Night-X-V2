# Non-atomic quota check permits concurrent AI paraphrase requests beyond the daily limit

## Executive Summary

An authenticated user can exceed the advertised 30-per-day `ai-paraphraser`
quota by sending concurrent requests. `app/api/ai/paraphrase/route.ts` reads the
shared Firestore counter and checks it locally, but reserves no slot before
calling the external AI provider. Requests that all observe the same sub-limit
count therefore all invoke OpenRouter or Hugging Face; accounting happens only
after the provider response. The result is amplified provider capacity/cost and
an integrity failure in the per-user usage control (CWE-362), assessed Medium/P2.

The affected source is the supplied snapshot
`codex-security-snapshot/v1:sha256:28852478b81cbbc5f26c8c86f8c1941f7472466b01f78ddc5a8b2c902b2663c1`;
no fixed revision was supplied. I reviewed the route, Firebase helper, and AI
service statically and ran only the offline deterministic model in `poc/race.js`;
I did not contact a live deployment, Firebase, or an AI provider.

## Background

The route is an Internet-facing Next.js `POST /api/ai/paraphrase` endpoint. It
requires `auth()` to return a user id, then derives one daily key from that id,
the tool name, and the UTC date:

```ts
const usageId = `${session.user.id}_${tool}_${today}`;
const doc = await adminDb.collection("ai_usage").doc(usageId).get();
const currentCount = doc.exists ? doc.data()?.count || 0 : 0;
if (currentCount >= 30) return NextResponse.json(..., { status: 429 });
```

The intended invariant is that at most 30 successful paraphrases for one user,
tool, and day cross the provider boundary. Input text and tone are parsed after
the quota decision, bounded, and embedded in a JSON-only prompt. The external
work is performed by `generateAIResponse` in `lib/ai-service.ts`.

## Vulnerability Details

We first reach the route with any valid authenticated session. Each independent
request performs the Firestore `get()` and local comparison at lines 23–31, but
there is no transaction or conditional write. Suppose the stored count is 29.
Requests A through J can all complete their reads before any request reaches
the accounting call. Every request observes 29 and passes `>= 30`.

The route then invokes the provider:

```ts
const aiResponseText = await generateAIResponse(prompt, systemPrompt);
```

The helper's OpenRouter and Hugging Face branches issue `fetch` calls before the
route accounts usage. Only after a valid response is parsed does the route call
`incrementAIUsage(session.user.id, tool)`. That helper uses
`FieldValue.increment(1)`, which preserves increments but is deliberately too
late to revoke calls already admitted. Ten successful requests can consequently
leave a stored count of 39 after ten provider calls, although only one slot
remained. Later non-concurrent requests are rejected, but the overage has
already consumed provider capacity.

This is a check/use race, not a lost-update bug: atomic increments can produce
the correct final arithmetic while the admission decision remains non-atomic.
The route also catches and logs increment failures, so accounting is not
fail-closed, although inducing such a failure is not required for this proof.

## Exploitability Analysis

The strongest route is straightforward request concurrency. We authenticate once,
wait until the daily count is just below 30, and release a burst of requests at
the same time. A barrier or HTTP client with a high connection fan-out widens the
window; provider latency widens it further because every request remains in
flight before its post-use increment.

The attacker controls request scheduling and paraphrase input, but not another
user's usage key. Authentication therefore bounds this to the attacker's own
account, and platform/provider concurrency, account creation controls, and
provider-side limits bound the practical amplification. The default model is
labelled free in code, so direct billing depends on deployment configuration;
even a free model consumes quota and service capacity. Once the counter exceeds
30, later sequential calls fail closed at the check. A lost-increment strategy
is unnecessary and less reliable because Firestore's increment is atomic.

## Proof of Concept

`poc/race.js` is an offline model, intentionally safe for local review. From the
report directory:

```sh
cd poc
node race.js
```

Representative output:

```text
[+] all 10 requests observed count=29
[+] provider invocations=10
[+] final stored count=39
[+] quota invariant violated: 10 calls consumed with 1 slot available
```

The model's read/check and provider/accounting phases correspond directly to the
route's `get()`, `generateAIResponse`, and `incrementAIUsage` sequence. It does
not require credentials and cannot alter application state. A disposable
Firebase-emulator test could replace the model's provider phase with a barrier
and issue authenticated parallel POSTs to measure deployment-specific
amplification; that was not run here.

## Remediation

Restore the invariant by atomically reserving a quota slot before external work.
Use a Firestore transaction that reads the usage document, rejects at 30, and
writes the increment in the same transaction. Only a transaction that commits
may call `generateAIResponse`; on provider failure, optionally refund the slot
with another transaction or define the quota as attempts rather than successes.

```ts
const usageRef = adminDb.collection('ai_usage').doc(usageId);
const admitted = await adminDb.runTransaction(async tx => {
  const snap = await tx.get(usageRef);
  const count = snap.exists ? (snap.data()?.count || 0) : 0;
  if (count >= 30) return false;
  tx.set(usageRef, {
    user_id: session.user.id, tool, usage_date: today,
    count: admin.firestore.FieldValue.increment(1),
    last_used: new Date().toISOString()
  }, { merge: true });
  return true;
});
if (!admitted) return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
const aiResponseText = await generateAIResponse(prompt, systemPrompt);
```

Regression tests should launch at least ten concurrent requests from one user
with count 29 and assert that exactly one provider invocation is admitted. Add
tests for a missing document, count exactly 30, transaction retries, provider
failure/refund policy, and Firestore transaction errors. Keep the existing
atomic increment only as accounting support; it cannot substitute for the
pre-provider reservation.

## Summary

The paraphrase route enforces a shared daily limit with a non-atomic read/check
and a post-provider increment. A valid account can therefore amplify concurrent
AI calls beyond the advertised quota, bounded by deployment concurrency and
provider controls. Our deterministic count-29 interleaving proves the invariant
failure without relying on counter corruption. I validated the source path and
offline model only; a useful next step is an emulator-backed concurrent test and
variant review of the other AI routes for the same admission pattern.

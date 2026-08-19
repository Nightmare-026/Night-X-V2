# NX-CAN-AI-QUOTA-CHAT: concurrent chat requests bypass the daily AI quota

## Executive Summary

An authenticated user can exceed the advertised 30-chat daily limit by sending
parallel `POST /api/ai/chat` requests. Each request independently reads the same
Firestore usage document and checks `count < 30`; the route calls OpenRouter or
Hugging Face before it records usage. Firestore's later atomic increment prevents
lost updates, but it does not reserve a slot or undo provider calls that already
started. At a stored count of 29, eight overlapping requests can therefore create
eight provider operations although one slot remains. This consumes shared provider
quota, capacity, and potentially operator-funded inference.

The affected code is the reviewed revision containing `app/api/ai/chat/route.ts`
and `lib/firebaseAdmin.ts`; no fixed revision was supplied. I reviewed those files,
the provider implementation, and the validation interleavings directly. I did not
send production requests, use provider credentials, or exercise a live Firebase
deployment; the included PoC is an offline deterministic model. Severity is Medium
(P2), CWE-362 (race condition / TOCTOU).

## Background

The route is an authenticated product surface. It derives the usage key from the
server-side session identity, tool name, and UTC date, so an unauthenticated caller
is rejected and one user cannot select another user's document:

```typescript
const session = await auth();
if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const today = new Date().toISOString().split('T')[0];
const usageId = `${session.user.id}_chatbot_${today}`;
```

The intended invariant is at most 30 successful provider admissions per account and
day. `incrementAIUsage` uses `FieldValue.increment(1)`, which is atomic for the
write itself, but the helper runs only after generation and catches its own errors.

## Vulnerability Details

We first reach the quota check after authentication. The read and decision are
separate from accounting:

```typescript
const doc = await adminDb.collection("ai_usage").doc(usageId).get();
const currentCount = doc.exists ? doc.data()?.count || 0 : 0;
if (currentCount >= 30) {
  return NextResponse.json({ error: "Daily limit reached. Resets at midnight." }, { status: 429 });
}

const aiResponse = await generateAIResponseFromHistory(bodyMessages, systemInstruction);
await incrementAIUsage(session.user.id, tool);
```

If requests R1 through R8 overlap while the stored count is 29, each `get()` can
complete before any request reaches the final increment. We carry the value 29 into
each check; all eight pass. The provider call is a real outbound POST, selected by
`AI_PROVIDER`, with a 30-second timeout. OpenRouter posts to
`https://openrouter.ai/api/v1/chat/completions`; the Hugging Face branch posts to
`https://router.huggingface.co/v1/chat/completions`.

Only after a successful response does `incrementAIUsage` execute:

```typescript
await usageRef.set({
  count: admin.firestore.FieldValue.increment(1),
  last_used: new Date().toISOString()
}, { merge: true });
```

The increment is atomic as a numeric update, so the final count may settle near 37,
but that atomicity is too late to enforce admission. Moreover, the helper catches and
logs write failures. A provider response can then remain entirely uncounted, making
the same ordering problem worse during a Firestore outage.

## Exploitability Analysis

The practical route is a single valid account and a burst of concurrent requests.
The attacker controls request timing and chat history (the history is untrusted input
but is not needed for the race). A barrier, HTTP/2 multiplexing, or a worker pool can
keep many requests between the read and provider call. Near the boundary, the
overrun is approximately the number of requests that observe the stale value: with
count 29, N requests can consume N provider operations; with count 0, a sufficiently
large burst can pass before updated reads become visible.

This is not an unlimited sequential bypass: once increments are visible, later
non-overlapping calls receive 429. Authentication also limits the attacker to their
own account. Provider throttles, Vercel concurrency limits, and a no-cost model may
reduce monetary impact, but they do not restore the application invariant and are not
proved by this repository. The strongest demonstrated impact is shared inference
quota/capacity abuse; exact pricing depends on deployment configuration.

## Proof of Concept

The bundled `poc/quota-race.js` is a safe offline simulation of the source ordering.
It starts eight requests at count 29, releases them together, and records a provider
call before each delayed increment. From the `poc` directory run:

```sh
node quota-race.js
```

Expected output:

```text
[+] admitted requests: 8
[+] provider calls before limit enforcement: 8
[+] final simulated count: 37
[!] quota overrun reproduced: every request observed count=29
```

No network, credentials, Firebase emulator, or cleanup is required. In an isolated
authorized test deployment, the same interleaving can be validated with a Firebase
emulator and a stub provider that counts POSTs; do not aim this at production.

## Remediation

Restore the invariant by atomically reserving a quota slot before invoking any
provider. A Firestore transaction should read the document, reject at 30, and write
`count + 1` in the same transaction. The provider call must occur only after the
transaction commits; failed generation should then perform a compensating decrement
or use a separate reservation/settlement state machine.

```typescript
const reserved = await adminDb.runTransaction(async tx => {
  const snap = await tx.get(usageRef);
  const count = snap.exists ? Number(snap.data()?.count ?? 0) : 0;
  if (count >= 30) return false;
  tx.set(usageRef, { user_id: userId, tool, usage_date: today,
    count: count + 1, last_used: new Date().toISOString() }, { merge: true });
  return true;
});
if (!reserved) return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
// generate response only after reservation commits
```

Keep accounting errors observable (do not swallow them), add bounded per-account
concurrency/rate limits, and test transaction contention at counts 0, 29, and 30.
Regression tests should assert that exactly one of many simultaneous requests is
admitted at count 29, and that provider failure cannot silently create an untracked
successful admission.

## Summary

The chat route performs a non-atomic check-then-use sequence: stale reads admit work,
the external provider is called, and only afterward is usage incremented. Atomic
increments protect bookkeeping consistency but cannot enforce a maximum on work
already dispatched, while swallowed write errors can erase accounting altogether.
We demonstrated the race deterministically with eight concurrent offline requests.
Future variant analysis should review every AI tool for the same pre-provider read,
and verify that any shared provider/API budget has an admission reservation rather
than delayed telemetry.

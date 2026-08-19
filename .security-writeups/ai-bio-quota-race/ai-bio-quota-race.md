# Concurrent AI Bio Requests Bypass the Daily Quota

## Executive Summary

The AI bio generation endpoint enforces its 30-request daily limit with a
non-transactional read, followed later by an AI-provider call and a separate
Firestore increment. Two or more authenticated requests can therefore observe
the same below-limit count, pass admission together, and invoke the provider
beyond the intended limit. This is a time-of-check/time-of-use race
(CWE-367) with a broader concurrent-execution weakness (CWE-362).

The affected source is the current working-tree snapshot identified as
`codex-security-snapshot/v1:sha256:28852478b81cbbc5f26c8c86f8c1941f7472466b01f78ddc5a8b2c902b2663c1`.
No fixed revision was available for comparison. The final severity is
Medium (P2): a valid account is required, and the repository proves excess
provider invocation but not a specific monetary loss.

I reviewed the affected route and Firebase helper directly and verified the
race with a deterministic, offline state-machine probe. I did not send
requests to a deployed application, contact either AI provider, use real
credentials, or measure production billing or concurrency.

## Background

`POST /api/ai/bio` is an authenticated Next.js route. It derives a daily
Firestore document identifier from the authenticated user, a fixed tool name,
and the current UTC date:

```ts
// app/api/ai/bio/route.ts, POST
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const today = new Date().toISOString().split('T')[0];
const tool = "ai-bio-generator";
const usageId = `${session.user.id}_${tool}_${today}`;
```

This establishes useful boundaries. An attacker cannot select another user's
quota key through the request body, and an unauthenticated caller is rejected.
The intended invariant is nevertheless stronger: no user should cause more
than 30 provider admissions for this tool and UTC day.

The normal flow reads `ai_usage/<usageId>`, rejects a count of 30 or greater,
generates a bio through the configured provider, validates the provider's JSON,
and finally increments the usage document. Firebase Admin operates with
server-side privileges, so this route—not client-side UI state—is the policy
enforcement boundary.

## Vulnerability Details

We first reach the quota decision in `app/api/ai/bio/route.ts`. The route reads
the document and makes a local decision from that snapshot:

```ts
// app/api/ai/bio/route.ts, POST
const doc = await adminDb.collection("ai_usage").doc(usageId).get();
const currentCount = doc.exists ? doc.data()?.count || 0 : 0;

if (currentCount >= 30) {
  return NextResponse.json(
    { error: "Daily limit reached for this tool. Resets at midnight." },
    { status: 429 }
  );
}
```

There is no transaction, compare-and-set, or reservation connecting this read
to admission. If we carry a value of 29 forward in two concurrent requests,
both requests evaluate `29 < 30` and both leave the guard successfully.

The expensive side effect occurs before accounting:

```ts
// app/api/ai/bio/route.ts, POST
const aiResponseText = await generateAIResponse(
  prompt,
  "You are a social media branding expert. Always respond in valid JSON format. Do not include any conversational text before or after the JSON."
);

const parsedResponse = extractJson(aiResponseText);
if (!parsedResponse || !parsedResponse.bios || !Array.isArray(parsedResponse.bios)) {
  throw new Error("Invalid bio format from AI or extraction failed");
}

await incrementAIUsage(session.user.id, tool);
return NextResponse.json(parsedResponse);
```

Only after the provider returns parseable JSON does the route call
`incrementAIUsage`. The helper uses an atomic numeric increment, but that
atomicity applies only to each write; it does not retroactively make the
earlier admission check atomic:

```ts
// lib/firebaseAdmin.ts, incrementAIUsage
await usageRef.set({
  user_id: userId,
  tool: tool,
  usage_date: today,
  count: admin.firestore.FieldValue.increment(1),
  last_used: new Date().toISOString()
}, { merge: true });
```

We can express the decisive interleaving without timing assumptions:

| Step | Request A | Request B | Stored count |
|---|---|---|---:|
| 1 | reads 29 | | 29 |
| 2 | | reads 29 | 29 |
| 3 | passes guard | passes guard | 29 |
| 4 | invokes provider | invokes provider | 29 |
| 5 | increments | | 30 |
| 6 | | increments | 31 |

The final value accurately records 31 in the best case, but the policy has
already failed: two provider calls were admitted when only one unit remained.
Starting from zero, a sufficiently concurrent batch can similarly admit many
requests from the same stale observation.

There is a second fail-open accounting condition. `incrementAIUsage` catches
write errors and returns normally:

```ts
// lib/firebaseAdmin.ts, incrementAIUsage
} catch (error) {
  console.error('Error incrementing AI usage:', error);
}
```

Consequently, a successful provider response can be returned even when its
usage write failed. This is not necessary to exploit the race, but it weakens
the same quota invariant and should be fixed with it.

## Exploitability Analysis

The strongest realistic route is a bounded parallel batch from one valid
account. We synchronize several authenticated requests while the stored count
is below 30. Because the read and guard are independent in every handler, we
want their reads to complete before any request reaches the post-provider
increment. Provider latency naturally enlarges this window: all admitted
requests wait on an external operation while the stored count remains
unchanged.

Near the boundary, the result is deterministic under the illustrated
interleaving. At count 29, two admitted requests produce two provider calls
instead of one. Farther below the limit, a larger parallel batch may amplify
the number of excess calls. Reliability in production depends on application
parallelism, Firestore latency, provider response latency, upstream throttles,
and how many responses pass JSON validation. None of those conditions restores
the missing atomic admission invariant.

A direct HTTP client is relevant because any single-request loading guard in
the browser is not a server-side control. However, this issue does not provide
unauthenticated access, cross-user quota manipulation, data disclosure, or
provider credential disclosure. Global rate limits at the hosting or provider
layer could reduce throughput, but they are not shown here and would only bound
amplification rather than enforce the per-user daily count.

Malformed provider output is an informative alternative path. It may consume
provider resources but skips the increment because parsing happens first. We
do not rely on inducing malformed output for the finding: the ordinary valid
response path is enough. Similarly, attempting to race Firestore's
`FieldValue.increment` itself is a dead end; that primitive correctly combines
concurrent increments. The defect is the unreserved admission that precedes it.

The repository does not establish a concrete dollar impact, model price,
provider billing rule, or production concurrency factor. For that reason we
calibrate this as Medium/P2 rather than claiming material financial loss. The
proven primitive is authenticated bypass of an application-enforced resource
limit and excess external provider work.

## Proof of Concept

The sibling `poc/README.md` contains a benign offline probe. It models two
handlers at a stored count of 29 and deliberately schedules both reads before
either increment. It does not import application code, use credentials, send
HTTP requests, contact Firebase, or invoke an AI provider.

From the report directory, follow the README's short state-machine procedure.
The representative result is:

```text
initial count: 29
request A observed: 29 -> admitted
request B observed: 29 -> admitted
provider admissions: 2 (policy permits 1)
final count after both increments: 31
[+] quota invariant violated by deterministic interleaving
```

On a fixed implementation, the equivalent reservation operations execute in
a Firestore transaction. One transaction changes 29 to 30; the other then
observes 30 and is rejected before provider invocation. The expected fixed
result is one provider admission and a final count of 30.

This probe changes no system state, requires no cleanup, and is intentionally
not a live exploitation tool.

## Remediation

The invariant to restore is: **a provider call may begin only after one quota
unit has been atomically reserved, and no reservation may move the count above
30**. The transaction must read and update the same document, and transaction
failure must fail closed.

A minimal structure is:

```ts
async function reserveAIUsage(userId: string, tool: string) {
  if (!adminDb) throw new Error("Firebase not initialized");

  const today = new Date().toISOString().split("T")[0];
  const usageId = `${userId}_${tool}_${today}`;
  const usageRef = adminDb.collection("ai_usage").doc(usageId);

  await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(usageRef);
    const count = snapshot.exists ? snapshot.data()?.count ?? 0 : 0;

    if (count >= 30) {
      throw new DailyQuotaExceededError();
    }

    transaction.set(usageRef, {
      user_id: userId,
      tool,
      usage_date: today,
      count: count + 1,
      last_used: new Date().toISOString(),
    }, { merge: true });
  });
}
```

The route should call `reserveAIUsage` before `generateAIResponse` and map
`DailyQuotaExceededError` to HTTP 429. It must not swallow reservation errors;
an unavailable datastore should produce a fail-closed 503 without contacting
the provider.

The team must also choose an explicit failure policy after reservation. The
simplest security invariant is to consume the unit for every admitted provider
attempt, including timeouts and malformed responses. If product requirements
demand refunds, implement them as a separate idempotent transaction keyed by a
unique request ID. A blind decrement is unsafe because retries could refund
twice or interfere with a new day's document.

Recommended regression coverage:

- Seed count 29, synchronize two reservation attempts, and assert exactly one
  succeeds and the stored count is 30.
- Seed count 30 and assert no provider function is called.
- Simulate Firestore unavailability and assert no provider function is called.
- Run 50 concurrent reservations from count 0 and assert exactly 30 succeed.
- Retry a compensated request ID and assert the refund is applied at most once,
  if compensation is implemented.
- Verify the UTC date key is computed consistently across reservation and any
  compensation path.

Defense in depth can add a per-user concurrency cap and provider-side budget,
but those controls should complement—not replace—the transactional quota.

## Summary

The AI bio route separates quota observation, provider admission, and usage
accounting into three independent operations. We showed how two authenticated
requests can both observe 29, both invoke the provider, and only afterward
raise the recorded count to 31. Atomic increments preserve the final numeric
total but do not enforce the limit, while swallowed accounting errors create a
second fail-open path.

The correct fix is to reserve capacity transactionally before external work,
fail closed when reservation cannot be recorded, and define idempotent
compensation if failed generations should be refunded. The same check-provider-
increment pattern is a useful target for variant analysis in sibling AI
routes, but this report makes no claim about any other endpoint.

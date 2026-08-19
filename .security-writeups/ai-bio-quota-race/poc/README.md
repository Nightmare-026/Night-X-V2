# Offline AI Bio Quota Race Probe

This is a benign, deterministic state-machine reproduction of the quota race
described in the accompanying report. It performs no network activity, uses no
credentials, imports no application code, and changes no files or remote
state.

## Reproduction

Start with the route's stored usage count at 29 and model two handlers, A and
B. Schedule the operations in this exact order:

1. A reads the stored count (`29`).
2. B reads the stored count (`29`).
3. A evaluates `29 >= 30` as false and records one simulated provider
   admission.
4. B evaluates `29 >= 30` as false and records one simulated provider
   admission.
5. A applies the post-provider increment (`29 -> 30`).
6. B applies the post-provider increment (`30 -> 31`).

Representative output:

```text
initial count: 29
request A observed: 29 -> admitted
request B observed: 29 -> admitted
provider admissions: 2 (policy permits 1)
final count after both increments: 31
[+] quota invariant violated by deterministic interleaving
```

The important property is not the final counter accuracy. Both requests were
admitted from stale observations while only one quota unit remained.

## Fixed-state comparison

Model the corrected implementation as an atomic reservation:

1. A transaction reads 29 and writes 30, then commits.
2. B's transaction retries or reads the committed value 30.
3. B rejects before the simulated provider admission.

Expected result:

```text
provider admissions: 1
final count: 30
[+] quota invariant preserved
```

No cleanup is required. Do not adapt this probe to send parallel requests to
a public or production deployment.

# Benign source-validation PoC

This PoC is intentionally non-invasive. It does not contact a deployment, submit
credentials, or require a Firebase project. It records the static proof that the
public handler reaches an unthrottled credentials verifier.

From the unpacked report directory:

```sh
cd poc
rg -n "export const \{ GET, POST \}" ../../../app/api/auth/[...nextauth]/route.ts
rg -n "authorize|collection\(\"users\"\)|compare\(" ../../../auth.ts
rg -n "rateLimit|throttle|lockout|429|captcha" ../../../auth.ts ../../../app/api/auth/[...nextauth]/route.ts
```

Expected output includes the exported `POST`, the Firestore lookup and bcrypt
`compare`, and no matching limiter/throttle lines in the callback files. Run this
only against a local checkout. If dynamic confirmation is needed, use a Firebase
emulator with a synthetic account and a bounded, pre-approved test harness; never
point it at a production host or real account.


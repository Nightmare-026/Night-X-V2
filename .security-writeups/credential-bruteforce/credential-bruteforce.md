# Credentials sign-in lacks rate limiting or account throttling

## Executive Summary

Night X exposes a public NextAuth credentials callback whose `authorize` function performs a Firestore lookup and bcrypt password comparison for every valid-shaped email/password submission. No repository control limits attempts by IP, account, or globally, and no progressive delay, lockout, CAPTCHA, or 429 response is applied. A correct guessed or reused password returns the user identity, which NextAuth places in the JWT-backed session. The practical impact is credential stuffing/password spraying against registered accounts and avoidable Firestore/bcrypt work. We rate this **Medium / P2** (CWE-307); the missing control alone does not prove account takeover at scale.

The affected source is the reviewed revision containing `auth.ts` and `app/api/auth/[...nextauth]/route.ts`; no fixed revision was supplied. I reviewed the source, middleware matcher, rate-limit helper, deployment headers, and sign-in client directly, but I did not send callback requests, use real credentials, or exercise a production deployment.

## Background

The application uses NextAuth with JWT sessions and offers both Google OAuth and an email/password Credentials provider. The route exports NextAuth's handlers directly:

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const dynamic = 'force-dynamic';
export const { GET, POST } = handlers;
```

This is an unauthenticated HTTP entry point; a client follows the normal NextAuth CSRF and callback protocol and does not need an existing session. The shipped sign-in page calls `signIn('credentials', { email, password, redirect: false })`, so the path is part of the ordinary product interface. Middleware intentionally excludes `/api` in its matcher, leaving this callback outside the page authorization wrapper.

## Vulnerability Details

We first reach `Credentials.authorize` with attacker-supplied fields. The only early guard checks presence:

```ts
// auth.ts
async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  try {
    if (!adminDb) return null;
    const userRef = adminDb.collection("users")
      .where("email", "==", credentials.email).limit(1);
    const snapshot = await userRef.get();
```

For each syntactically valid attempt, the server performs a Firestore query. For an existing account it then performs bcrypt work every time:

```ts
    if (snapshot.empty) return null;
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    if (!user || !user.password_hash) return null;

    const isValid = await compare(
      credentials.password as string,
      user.password_hash
    );
    if (!isValid) return null;

    return {
      id: userDoc.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
```

There is no attempt counter, account state, IP budget, delay, challenge, or lockout around either the lookup or comparison. Carrying a correct password through the final branch returns the identity; NextAuth then issues the configured JWT session. Invalid users and invalid passwords both return `null`, which is useful against simple response-text enumeration but does not reduce request volume.

The repository's `lib/rate-limit.ts` helper is not imported by `auth.ts` or the NextAuth route. The middleware matcher is `[(?!api)...]`, and `vercel.json` contains headers only. An external Vercel Firewall, CDN, or bot service could mitigate this in deployment, but no exported configuration proves coverage, keying, thresholds, or fail behavior for this callback.

## Exploitability Analysis

The strongest realistic route is credential stuffing: an unauthenticated client submits protocol-correct callbacks using a corpus of reused email/password pairs. Each existing email consumes a Firestore read and bcrypt comparison; a matching pair crosses the authentication boundary and yields a session. Password spraying (one common password across many accounts) reduces per-account lockout concerns, while rotating source addresses can evade an IP-only control if one is later added.

The primitive is not a password disclosure. Generic failures and bcrypt's intentional cost make guessing slower, and CSRF/session mechanics require a correctly formed client. Those constraints still permit automation because the callback is public and repeatable. Without a local emulator or synthetic account I did not measure response timing, invocation counts, or concurrency, so scale and account-takeover likelihood remain deployment-dependent. The same missing budget also permits resource exhaustion through repeated Firestore/bcrypt work even when every password is wrong.

## Proof of Concept

The accompanying `poc/README.md` is deliberately benign. It documents a source-only proof and an optional isolated Firebase-emulator procedure using synthetic data; it does not send requests to a live host or include real credentials. The source proof is reproducible by checking that the route exports `POST`, `authorize` calls Firestore and `compare` without a limiter, and the success branch returns an identity. No destructive or weaponized credential-testing PoC was authorized for this review.

## Remediation

Restore an invariant that every credentials attempt is charged to a bounded, shared policy before database work, with separate per-IP and per-account keys and a short retry response. A minimal shape is:

```ts
const decision = await authLimiter.consume({
  ip: requestIp,
  account: String(credentials.email).toLowerCase(),
});
if (!decision.allowed) return null; // handler should emit 429/Retry-After
```

Implement the limiter in durable shared storage (for example, Redis or a managed edge limiter), not the current process-local map, and apply it specifically to the NextAuth callback. Add exponential backoff after failures, alerting on distributed sprays, and a challenge or step-up flow when thresholds are exceeded. Keep error messages uniform. Regression tests should submit repeated invalid attempts for one account and across accounts, assert the limiter decision before Firestore/bcrypt, verify `Retry-After`/429 behavior, and confirm a successful attempt still creates a session after the window resets.

## Summary

The public credentials callback accepts unlimited protocol-correct guesses and performs backend work on each one; a correct reused password returns an authenticated identity. We demonstrated the complete source path and the absence of repository-enforced throttling, while deliberately avoiding live or real-credential testing. Future variant analysis should audit password-reset and registration endpoints for the same missing shared attempt budget and verify any Vercel/CDN controls against this exact callback.

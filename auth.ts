import NextAuth from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDb } from "@/lib/firebaseAdmin";
import { firestoreRateLimit } from "@/lib/utils";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

function getClientIp(request?: Request) {
  const forwardedFor = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request?.headers.get("x-real-ip") || "anonymous";
}

function rateLimitKey(value: string) {
  return encodeURIComponent(value.toLowerCase().trim()).slice(0, 180);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: adminDb ? FirestoreAdapter(adminDb) : undefined,
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = typeof credentials?.email === "string" ? credentials.email.toLowerCase().trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) return null;

        try {
          if (!adminDb) return null;

          const ipKey = rateLimitKey(getClientIp(request));
          const accountKey = rateLimitKey(email);
          const [ipLimit, accountLimit] = await Promise.all([
            firestoreRateLimit(adminDb, ipKey, "auth_ip", 20, 15 * 60 * 1000),
            firestoreRateLimit(adminDb, accountKey, "auth_account", 10, 15 * 60 * 1000),
          ]);

          if (!ipLimit.success || !accountLimit.success) return null;

          const userRef = adminDb.collection("users").where("email", "==", email).limit(1);
          const snapshot = await userRef.get();

          if (snapshot.empty) return null;

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          if (!user || !user.password_hash) return null;

          const isValid = await compare(password, user.password_hash);
          if (!isValid) return null;

          return {
            id: userDoc.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});

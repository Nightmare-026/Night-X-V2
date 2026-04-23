import NextAuth from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDb } from "@/lib/firebaseAdmin";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          if (!adminDb) return null;
          const userRef = adminDb.collection("users").where("email", "==", credentials.email).limit(1);
          const snapshot = await userRef.get();

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
    }
  },
});

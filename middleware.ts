import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const publicTools = ['word-counter', 'password-generator', 'age-calculator', 'qr-generator', 'text-obfuscator', 'markdown-live'];
  const isPublicTool = publicTools.some(slug => nextUrl.pathname === `/tools/${slug}`);

  const isPublicRoute = [
    "/",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/support",
    "/feedback",
    "/services",
    "/faq",
    "/security",
  ].some(route => nextUrl.pathname === route) || isPublicTool;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  const isProtectedRoute = 
    (nextUrl.pathname.startsWith("/dashboard") || 
     nextUrl.pathname.startsWith("/settings") ||
     nextUrl.pathname.startsWith("/tools")) && !isPublicRoute;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return;
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

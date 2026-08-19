import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import { TOOLS } from "./lib/tools-registry";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Dynamically get public tool slugs from registry
  const publicTools = TOOLS.filter(t => t.isPublic).map(t => t.slug);
  
  const isPublicTool = publicTools.some(slug => nextUrl.pathname === `/tools/${slug}`);
  const isToolsCatalog = nextUrl.pathname === "/tools" || nextUrl.pathname === "/tools/";

  const isPublicRoute = [
    "/",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/support",
    "/feedback",
    "/services",
    "/security",
    "/pricing",
    "/changelog",
    "/status",
    "/faq",
    "/docs",
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
    "/auth/forgot-password"
  ].some(route => nextUrl.pathname === route) || isPublicTool || isToolsCatalog;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  const isProtectedRoute = 
    (nextUrl.pathname.startsWith("/dashboard") || 
     nextUrl.pathname.startsWith("/settings") ||
     nextUrl.pathname.startsWith("/profile") ||
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

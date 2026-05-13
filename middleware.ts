export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    // Auth pages
    const isAuthPage =
      path === "/auth/login" || path === "/auth/signup" || path === "/"; // Allow home page for logged in users as well

    // Protected pages
    const isProtectedRoute = path.startsWith("/dashboard");

    // Get token
    const token = request.cookies.get("token")?.value;


    // Verify token if exists
    const verifiedToken = token ? await verifyToken(token) : null;
if (!verifiedToken) {
  (await cookies()).delete("token");
}
    // =====================================
    // USER ALREADY LOGGED IN
    // =====================================
    // Prevent access to login/signup
    if (isAuthPage && verifiedToken) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    // =====================================
    // USER NOT LOGGED IN
    // =====================================
    // Protect dashboard routes
    if (isProtectedRoute && !verifiedToken) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    // Allow request
    return NextResponse.next();
  } catch (error) {
    console.log("Middleware Error:", error);

    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/auth/:path",
    "/dashboard/:path*",
    "/"
  ],
};
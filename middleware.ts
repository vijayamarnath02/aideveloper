export const runtime = "nodejs";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;

    // Auth pages
    const isAuthPage =
      path === "/auth/login" ||
      path === "/auth/signin" ||
      path === "/auth/forgetpass" ||
      path === "/auth/resetpass" ||
      path === "/"; // Allow home page for logged in users as well

    // Protected pages
    const isProtectedRoute = path.startsWith("/dashboard");

    // Get token
    const token = request.cookies.get("token")?.value;


    // Verify token if exists
    const verifiedToken = token ? await verifyToken(token) : null;
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });
    const isAuthenticated = Boolean(verifiedToken || nextAuthToken);
    // =====================================
    // USER ALREADY LOGGED IN
    // =====================================
    // Prevent access to login/signup
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(
        new URL("/main/dashboard", request.url)
      );
    }

    // =====================================
    // USER NOT LOGGED IN
    // =====================================
    // Protect dashboard routes
    if (isProtectedRoute && !isAuthenticated) {
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

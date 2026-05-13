export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value;
    console.log("Token from cookie:", token);

    // No token
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    const  verfyTok = await verifyToken(token);
    console.log("Token is valid:", verfyTok);
    if (!verfyTok) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.log("Invalid Token");

    // Token invalid or expired
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
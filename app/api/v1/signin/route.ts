import { generateToken } from "@/app/lib/jwt";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { Logintype } from "@/app/type/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data: Logintype = await req.json();
        await connectDB();
        if (data.email && data.password) {
            const userCheck = await User.findOne({ $or: [{ email: data.email }, { mobile: data.mobile }] });
            if (userCheck) {
                return Response.json({ message: "User already exists" }, { status: 400 });
            }
            const user = await User.create(data);
            const token = generateToken({ email: user.email, name: user.name });
            const res = NextResponse.json({ message: "User registered successfully", token }, { status: 201 });
            res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });
            return res;
        } else {
            return Response.json({ message: "Email and password are required" }, { status: 400 });
        }
    } catch (error) {
        console.error("[POST /api/v1/signin]", error);
        return Response.json({ message: "An error occurred while processing your request" }, { status: 500 });
    }
}

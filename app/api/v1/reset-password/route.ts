import crypto from "crypto";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { email, token, password } = (await req.json()) as {
            email?: string;
            token?: string;
            password?: string;
        };

        if (!email || !token || !password || password.length < 6) {
            return Response.json({ message: "Email, token, and a 6+ character password are required" }, { status: 400 });
        }

        await connectDB();
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            email: email.trim().toLowerCase(),
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return Response.json({ message: "Reset link is invalid or expired" }, { status: 400 });
        }

        user.password = password;
        user.authProvider = "credentials";
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return Response.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error("[POST /api/v1/reset-password]", error);
        return Response.json({ message: "An error occurred while processing your request" }, { status: 500 });
    }
}

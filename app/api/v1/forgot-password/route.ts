import crypto from "crypto";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { email } = (await req.json()) as { email?: string };
        if (!email || !email.includes("@")) {
            return Response.json({ message: "Valid email is required" }, { status: 400 });
        }

        await connectDB();
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOneAndUpdate(
            { email: normalizedEmail },
            {
                resetPasswordTokenHash: tokenHash,
                resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 30),
            },
            { new: true },
        );

        const body: { message: string; resetUrl?: string } = {
            message: "If an account exists, a password reset link has been generated.",
        };

        if (user && process.env.NODE_ENV !== "production") {
            const origin = new URL(req.url).origin;
            body.resetUrl = `${origin}/auth/resetpass?email=${encodeURIComponent(normalizedEmail)}&token=${token}`;
        }

        return Response.json(body, { status: 200 });
    } catch (error) {
        console.error("[POST /api/v1/forgot-password]", error);
        return Response.json({ message: "An error occurred while processing your request" }, { status: 500 });
    }
}

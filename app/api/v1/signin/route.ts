import { connectDB } from "@/app/lib/mongodb";
import { Logintype } from "@/app/type/auth";

export async function POST(req: Request) {
    try {
        const data: Logintype = await req.json();
        const db = await connectDB();
        if (data.email && data.password) {
            const userCheck = await db.model("User").findOne({ $or: [{ email: data.email }, { mobile: data.mobile }] });
            if (userCheck) {
                return new Response(JSON.stringify({ message: "User already exists" }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            const user = await db.model("User").create(data);
            return new Response(JSON.stringify({ message: "User registered successfully", user }), {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            });

        } else {
            return new Response(JSON.stringify({ message: "Email and password are required" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

    }
    catch (error) {
        return new Response(JSON.stringify({ message: "An error occurred while processing your request" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
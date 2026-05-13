import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const runtime = "nodejs";

const providers = [
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? GithubProvider({
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
          })
        : null,
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })
        : null,
].filter(Boolean) as NextAuthOptions["providers"];

export const authOptions: NextAuthOptions = {
    providers,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return false;

            await connectDB();
            await User.findOneAndUpdate(
                { email: user.email },
                {
                    $set: {
                        name: user.name || user.email.split("@")[0],
                        email: user.email,
                        authProvider: account?.provider || "credentials",
                        status: "active",
                    },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
            );

            return true;
        },
        async jwt({ token, user }) {
            if (user?.email) {
                token.email = user.email;
                token.name = user.name;
            }

            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

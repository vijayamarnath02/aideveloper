import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";
import NavBar from "./components/NavBar";

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return { name: "", email: "" };
  const payload = verifyToken(token.value) as { name?: string; email?: string } | null;
  return { name: payload?.name ?? "", email: payload?.email ?? "" };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookie();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e8e8e8",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <NavBar userName={user.name} userEmail={user.email} />

      <main style={{ flex: 1, maxWidth: "1280px", margin: "0 auto", width: "100%", padding: "2rem 2rem" }}>
        {children}
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "1.25rem 2rem",
          textAlign: "center",
          fontFamily: "'Courier New', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.18)",
        }}
      >
        &copy; {new Date().getFullYear()} devAI — ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

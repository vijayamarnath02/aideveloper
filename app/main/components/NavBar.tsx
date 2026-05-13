"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavBarProps {
  userName: string;
  userEmail: string;
}

export default function NavBar({ userName, userEmail }: NavBarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/v1/logout", { method: "POST" });
    router.push("/auth/login");
  }

  const initials = userName
    ? userName.slice(0, 2).toUpperCase()
    : userEmail.slice(0, 2).toUpperCase();

  return (
    <nav
      style={{
        background: "rgba(10,10,15,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 2rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "'Courier New', monospace",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link
        href="/main/dashboard"
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#00e5a0",
          letterSpacing: "-0.02em",
          textDecoration: "none",
        }}
      >
        {"<devAI />"}
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link
          href="/main/dashboard"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)")
          }
        >
          DASHBOARD
        </Link>
      </div>

      {/* User + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(0,229,160,0.12)",
              border: "1px solid rgba(0,229,160,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "#00e5a0",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <span
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.04em",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {userEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "3px",
            padding: "0.3rem 0.75rem",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: loggingOut ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.35)",
            cursor: loggingOut ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loggingOut) {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,107,107,0.4)";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,107,107,0.8)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loggingOut) {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.35)";
            }
          }}
        >
          {loggingOut ? "SIGNING OUT…" : "SIGN OUT"}
        </button>
      </div>
    </nav>
  );
}

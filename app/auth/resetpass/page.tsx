"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function ResetPassword() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();

    if (!email || !token) {
      setStatus("error");
      setMessage("// reset link is missing required data");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("// min 6 characters required");
      return;
    }

    if (password !== confirm) {
      setStatus("error");
      setMessage("// passwords do not match");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/v1/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Password reset failed");

      setStatus("done");
      setMessage("Password reset successfully. You can sign in now.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? `// ${error.message}` : "// password reset failed");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem 1rem",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "3px",
    color: "#f0f0ea",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.85rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "#e8e8e8",
        padding: "2rem",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1
          style={{
            color: "#f5f5f0",
            fontSize: "1.8rem",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            margin: "0 0 0.65rem",
          }}
        >
          Choose a new password.
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.7,
            margin: "0 0 2rem",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: "0.92rem",
          }}
        >
          Resetting password for {email || "your account"}.
        </p>

        {status === "done" ? (
          <div>
            <p
              style={{
                color: "#00e5a0",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
            <Link
              href="/auth/login"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "#00e5a0",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.75rem",
                textDecoration: "none",
              }}
            >
              SIGN IN -&gt;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label style={{ display: "block", color: "#00e5a0", fontFamily: "'Courier New', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", marginBottom: "6px" }}>
              NEW_PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="new-password"
              style={inputStyle}
            />

            <label style={{ display: "block", color: "#00e5a0", fontFamily: "'Courier New', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", margin: "1rem 0 6px" }}>
              CONFIRM_PASSWORD
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••••"
              autoComplete="new-password"
              style={inputStyle}
            />

            {message && (
              <p
                style={{
                  margin: "0.75rem 0 0",
                  color: "rgba(255,107,107,0.85)",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.68rem",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                width: "100%",
                marginTop: "1.75rem",
                padding: "0.875rem",
                background: status === "loading" ? "rgba(0,229,160,0.5)" : "#00e5a0",
                border: "none",
                borderRadius: "3px",
                color: "#0a0a0f",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                fontWeight: 700,
                cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? "RESETTING..." : "RESET PASSWORD ->"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

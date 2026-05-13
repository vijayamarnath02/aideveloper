"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "idle" | "loading" | "sent" | "error";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setResetUrl("");

    if (!email.includes("@")) {
      setStatus("error");
      setMessage("// enter a valid email address");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/v1/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Reset request failed");

      setStatus("sent");
      setMessage(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? `// ${error.message}` : "// reset request failed");
    }
  }

  const isLoading = status === "loading";

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
        <Link
          href="/auth/login"
          style={{
            display: "inline-block",
            marginBottom: "2rem",
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          &lt;- BACK TO LOGIN
        </Link>

        <h1
          style={{
            color: "#f5f5f0",
            fontSize: "1.8rem",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            margin: "0 0 0.65rem",
          }}
        >
          Reset your password.
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
          Enter the email on your account and we will generate a password reset link.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            style={{
              display: "block",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              color: "#00e5a0",
              marginBottom: "6px",
            }}
          >
            EMAIL_ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            style={{
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
            }}
          />

          {message && (
            <p
              style={{
                margin: "0.75rem 0 0",
                color: status === "error" ? "rgba(255,107,107,0.85)" : "#00e5a0",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.68rem",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          )}

          {resetUrl && (
            <Link
              href={resetUrl}
              style={{
                display: "block",
                marginTop: "0.75rem",
                color: "#4d9fff",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.68rem",
                overflowWrap: "anywhere",
                textDecoration: "none",
              }}
            >
              OPEN DEVELOPMENT RESET LINK
            </Link>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              marginTop: "1.75rem",
              padding: "0.875rem",
              background: isLoading ? "rgba(0,229,160,0.5)" : "#00e5a0",
              border: "none",
              borderRadius: "3px",
              color: "#0a0a0f",
              fontFamily: "'Courier New', monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "GENERATING LINK..." : "SEND RESET LINK ->"}
          </button>
        </form>
      </div>
    </div>
  );
}

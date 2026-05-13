"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const GRID_CHARS = "01{}[];=><!/*abcdefghijklmnopqrstuvwxyz".split("");
const GRID_COLS = 18;
const GRID_ROWS = 28;

function randomChar() {
  return GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
}

function CodeGrid() {
  const [cells, setCells] = useState<string[]>(() =>
    Array.from({ length: GRID_COLS * GRID_ROWS }, () => randomChar()),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCells((prev) => {
        const next = [...prev];
        const count = Math.floor(Math.random() * 8) + 3;
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = randomChar();
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        padding: "2rem",
        opacity: 0.12,
        userSelect: "none",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {cells.map((ch, i) => (
        <span
          key={i}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.7rem",
            color: "#00e5a0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

type Field = "name" | "email" | "mobile" | "password" | "confirm";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm: string;
}

function StrengthBar({ password }: { password: string }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const labels = ["", "WEAK", "FAIR", "GOOD", "STRONG"];
  const colors = ["", "#ff6b6b", "#f0a500", "#4d9fff", "#00e5a0"];

  if (!password) return null;

  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: "2px",
              background: n <= score ? colors[score] : "rgba(255,255,255,0.1)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "0.62rem",
          color: colors[score],
          letterSpacing: "0.1em",
          margin: 0,
        }}
      >
        {labels[score]}
      </p>
    </div>
  );
}

export default function SignUp() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [heading, setHeading] = useState("");
  const fullHeading = "Create your account.";

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= fullHeading.length) {
        setHeading(fullHeading.slice(0, i));
        i++;
      } else clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  function update(field: Field, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleOAuth(provider: "github" | "google") {
    void signIn(provider, { callbackUrl: "/dashboard" });
  }

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (form.name.trim().length < 2) e.name = "// name too short";
    if (!form.email.includes("@")) e.email = "// invalid email address";
    if (!/^[0-9]{10}$/.test(form.mobile)) e.mobile = "// must be 10 digits";
    if (form.password.length < 6) e.password = "// min 6 characters required";
    if (form.password !== form.confirm) e.confirm = "// passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          password: form.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrors({ email: data.message ?? "// registration failed" });
      } else {
        setDone(true);
      }
    } catch {
      setErrors({ email: "// network error, please retry" });
    } finally {
      setLoading(false);
    }
  }

  const inputBase = (
    field: Field,
    extra?: React.CSSProperties,
  ): React.CSSProperties => ({
    width: "100%",
    padding: "0.75rem 1rem",
    background:
      focused === field ? "rgba(0,229,160,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${
      errors[field]
        ? "rgba(255,107,107,0.5)"
        : focused === field
          ? "rgba(0,229,160,0.4)"
          : "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "3px",
    color: "#f0f0ea",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.85rem",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    ...extra,
  });

  const labelStyle = (field: Field): React.CSSProperties => ({
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: "0.68rem",
    letterSpacing: "0.12em",
    color: focused === field ? "#00e5a0" : "rgba(255,255,255,0.3)",
    marginBottom: "6px",
    transition: "color 0.2s",
  });

  const errorStyle: React.CSSProperties = {
    fontFamily: "'Courier New', monospace",
    fontSize: "0.65rem",
    color: "rgba(255,107,107,0.8)",
    margin: "5px 0 0",
    letterSpacing: "0.04em",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#0a0a0f",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#e8e8e8",
      }}
    >
      {/* ── LEFT PANEL ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem",
        }}
      >
        <CodeGrid />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,229,160,0.04) 0%, transparent 60%, rgba(77,159,255,0.04) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#00e5a0",
              letterSpacing: "-0.02em",
            }}
          >
            {"<devAI />"}
          </div>
        </div>

        {/* Centre copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              color: "rgba(0,229,160,0.6)",
              marginBottom: "1rem",
            }}
          >
            AI CODE INTELLIGENCE
          </p>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 400,
              lineHeight: "1.2",
              letterSpacing: "-0.03em",
              color: "#f5f5f0",
              margin: "0 0 1.25rem",
              maxWidth: "340px",
            }}
          >
            Join the devs{" "}
            <span
              style={{ fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}
            >
              shipping faster.
            </span>
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              lineHeight: "1.75",
              color: "rgba(255,255,255,0.38)",
              maxWidth: "320px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Free forever on the starter plan. Set up in under a minute. No
            credit card required.
          </p>

          {/* Feature list */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {[
              "Instant code review & bug detection",
              "Supports 40+ languages",
              "AI-generated patch diffs",
            ].map((f) => (
              <div
                key={f}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,229,160,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00e5a0",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: "0.83rem",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link
              href="/auth/login"
              style={{
                color: "#00e5a0",
                textDecoration: "none",
                fontWeight: 700,
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.opacity = "0.7")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.opacity = "1")
              }
            >
              SIGN IN →
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 4rem",
          position: "relative",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ width: "100%", maxWidth: "380px", position: "relative" }}>
          {/* Heading */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 400,
                letterSpacing: "-0.025em",
                color: "#f5f5f0",
                margin: "0 0 0.5rem",
                minHeight: "2rem",
              }}
            >
              {heading}
              <span
                style={{
                  display:
                    heading.length < fullHeading.length
                      ? "inline-block"
                      : "none",
                  width: "2px",
                  height: "1.2rem",
                  background: "#00e5a0",
                  verticalAlign: "middle",
                  marginLeft: "2px",
                  animation: "blink 1s step-end infinite",
                }}
              />
            </h1>
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              FREE FOREVER ON STARTER →
            </p>
          </div>

          {done ? (
            <div
              style={{
                padding: "2rem",
                background: "rgba(0,229,160,0.06)",
                border: "1px solid rgba(0,229,160,0.2)",
                borderRadius: "4px",
                textAlign: "center",
                animation: "fadeUp 0.4s ease",
              }}
            >
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.8rem",
                  color: "#00e5a0",
                  letterSpacing: "0.1em",
                  margin: "0 0 0.5rem",
                }}
              >
                ✓ ACCOUNT CREATED
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  margin: 0,
                }}
              >
                Redirecting to your workspace…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* OAuth buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "1.75rem",
                }}
              >
                {[
                  { label: "GitHub", icon: "⌥", provider: "github" as const },
                  { label: "Google", icon: "◉", provider: "google" as const },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => handleOAuth(btn.provider)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "0.65rem",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "3px",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.25)";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.8)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.1)";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.5)";
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{btn.icon}</span>
                    {btn.label.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "1.75rem",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255,255,255,0.07)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.1em",
                  }}
                >
                  OR
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255,255,255,0.07)",
                  }}
                />
              </div>

              {/* Name + Email row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "1.1rem",
                }}
              >
                <div>
                  <label style={labelStyle("name")}>FULL_NAME</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    style={inputBase("name")}
                  />
                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>
                <div>
                  <label style={labelStyle("mobile")}>MOBILE</label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      update(
                        "mobile",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    onFocus={() => setFocused("mobile")}
                    onBlur={() => setFocused(null)}
                    placeholder="9876543210"
                    autoComplete="tel"
                    style={inputBase("mobile")}
                  />
                  {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={labelStyle("email")}>EMAIL_ADDRESS</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  style={inputBase("email")}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={labelStyle("password")}>PASSWORD</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••••"
                    autoComplete="new-password"
                    style={inputBase("password", { paddingRight: "3rem" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.06em",
                      padding: 0,
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "#00e5a0")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        "rgba(255,255,255,0.3)")
                    }
                  >
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <StrengthBar password={form.password} />
                {errors.password && <p style={errorStyle}>{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={labelStyle("confirm")}>CONFIRM_PASSWORD</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  style={inputBase("confirm")}
                />
                {errors.confirm && <p style={errorStyle}>{errors.confirm}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  background: loading ? "rgba(0,229,160,0.5)" : "#00e5a0",
                  border: "none",
                  borderRadius: "3px",
                  color: "#0a0a0f",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    (e.currentTarget as HTMLElement).style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        border: "2px solid rgba(10,10,15,0.3)",
                        borderTopColor: "#0a0a0f",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    CREATING ACCOUNT…
                  </>
                ) : (
                  "CREATE ACCOUNT →"
                )}
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "1.25rem",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.62rem",
                  color: "rgba(255,255,255,0.18)",
                  lineHeight: 1.7,
                  letterSpacing: "0.04em",
                }}
              >
                BY CONTINUING YOU AGREE TO OUR{" "}
                <Link
                  href="/auth/login"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                  }}
                >
                  TERMS
                </Link>{" "}
                &amp;{" "}
                <Link
                  href="/auth/login"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                  }}
                >
                  PRIVACY POLICY
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.18); font-family: 'Courier New', monospace; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

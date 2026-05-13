"use client";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const loginUser = async (email: string, password: string) => {
  const res = await fetch("/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};
const GRID_CHARS = "01{}[];=><!/*abcdefghijklmnopqrstuvwxyz".split("");
const GRID_COLS = 18;
const GRID_ROWS = 28;

function randomChar() {
  return GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
}

function CodeGrid() {
  const [cells, setCells] = useState<string[]>([]);

  useEffect(() => {
    setCells(Array.from({ length: GRID_COLS * GRID_ROWS }, () => randomChar()));
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
            transition: "opacity 0.3s",
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

type Field = "email" | "password";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [greeting, setGreeting] = useState("");
  const fullGreeting = "Welcome back, developer.";
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: () => {
      setDone(true);
      setTimeout(() => router.push("/main/dashboard"), 1200);
    },
    onError: (error: Error) => {
      setErrors({ email: `// ${error.message}` });
    },
  });
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= fullGreeting.length) {
        setGreeting(fullGreeting.slice(0, i));
        i++;
      } else clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!email.includes("@")) e.email = "// invalid email address";
    if (password.length < 6) e.password = "// min 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    mutation.mutate({ email, password });
  }

  function handleOAuth(provider: "github" | "google") {
    void signIn(provider, { callbackUrl: "/dashboard" });
  }

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

        {/* Vertical gradient overlay */}
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
            Review. Debug.{" "}
            <span
              style={{ fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}
            >
              Ship.
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
            The AI developer tool that reads your code, spots the bugs, and
            hands you the fix — in under two seconds.
          </p>
        </div>

        {/* Bottom testimonial */}
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
              fontStyle: "italic",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 0.75rem",
              lineHeight: "1.6",
            }}
          >
            "Caught a null-pointer in prod before our Monday deploy. Saved us
            four hours of incident response."
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(0,229,160,0.15)",
                border: "1px solid rgba(0,229,160,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.65rem",
                color: "#00e5a0",
                fontWeight: 700,
              }}
            >
              VA
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                Vijay Amarnath M V. · Junior developer at{" Purpleslate"}
              </p>
            </div>
          </div>
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
        }}
      >
        {/* Subtle scanline texture */}
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
          {/* Greeting */}
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
              {greeting}
              <span
                style={{
                  display:
                    greeting.length < fullGreeting.length
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
              SIGN IN TO CONTINUE →
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
                ✓ AUTHENTICATED
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

              {/* Email field */}
              <div style={{ marginBottom: "1.1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    color:
                      focused === "email" ? "#00e5a0" : "rgba(255,255,255,0.3)",
                    marginBottom: "6px",
                    transition: "color 0.2s",
                  }}
                >
                  EMAIL_ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background:
                      focused === "email"
                        ? "rgba(0,229,160,0.04)"
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${errors.email ? "rgba(255,107,107,0.5)" : focused === "email" ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "3px",
                    color: "#f0f0ea",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.85rem",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                  }}
                />
                {errors.email && (
                  <p
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(255,107,107,0.8)",
                      margin: "5px 0 0",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <label
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      color:
                        focused === "password"
                          ? "#00e5a0"
                          : "rgba(255,255,255,0.3)",
                      transition: "color 0.2s",
                    }}
                  >
                    PASSWORD
                  </label>
                  <Link
                    href="/auth/forgetpass"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.25)",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "#00e5a0")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        "rgba(255,255,255,0.25)")
                    }
                  >
                    FORGOT?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      padding: "0.75rem 3rem 0.75rem 1rem",
                      background:
                        focused === "password"
                          ? "rgba(0,229,160,0.04)"
                          : "rgba(255,255,255,0.03)",
                      border: `1px solid ${errors.password ? "rgba(255,107,107,0.5)" : focused === "password" ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "3px",
                      color: "#f0f0ea",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.85rem",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                    }}
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
                {errors.password && (
                  <p
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(255,107,107,0.8)",
                      margin: "5px 0 0",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={mutation.isPending}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  background: mutation.isPending
                    ? "rgba(0,229,160,0.5)"
                    : "#00e5a0",
                  border: "none",
                  borderRadius: "3px",
                  color: "#0a0a0f",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  cursor: mutation.isPending ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  if (!mutation.isPending)
                    (e.currentTarget as HTMLElement).style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
              >
                {mutation.isPending ? (
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
                    AUTHENTICATING…
                  </>
                ) : (
                  "SIGN IN →"
                )}
              </button>

              {/* Register link */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.06em",
                }}
              >
                NO ACCOUNT?{" "}
                <Link
                  href="/auth/signin"
                  style={{
                    color: "#00e5a0",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.opacity = "0.75")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.opacity = "1")
                  }
                >
                  CREATE ONE FREE
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input::placeholder {
          color: rgba(255,255,255,0.18);
          font-family: 'Courier New', monospace;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

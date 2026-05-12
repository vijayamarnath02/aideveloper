"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const codeSnippet = `function processData(input) {
  // BUG: off-by-one error
  for (let i = 0; i <= input.length; i++) {
    const item = input[i].value;
    transform(item);
  }
}`;

const fixedSnippet = `function processData(input) {
  // ✓ Fixed: correct loop bounds
  for (let i = 0; i < input.length; i++) {
    const item = input[i].value;
    transform(item);
  }
}`;

const features = [
  {
    icon: "👁",
    tag: "01 / VIEW",
    title: "Instant Code Clarity",
    desc: "Paste any codebase snippet and get a structured breakdown — logic flow, dependencies, and purpose explained at a glance.",
    accent: "#00e5a0",
  },
  {
    icon: "🔍",
    tag: "02 / REVIEW",
    title: "Deep Code Review",
    desc: "AI-powered analysis surfaces performance bottlenecks, security vulnerabilities, style issues, and improvement suggestions.",
    accent: "#4d9fff",
  },
  {
    icon: "🔧",
    tag: "03 / FIX",
    title: "Automated Bug Fixes",
    desc: "Describe the bug or let the AI detect it. Get a precise diff-ready patch with a full explanation of the root cause.",
    accent: "#ff6b6b",
  },
];

export default function Home() {
  const [typed, setTyped] = useState("");
  const [showFixed, setShowFixed] = useState(false);
  const target = codeSnippet;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= target.length) {
        setTyped(target.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowFixed(true), 800);
      }
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e8e8e8",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#00e5a0",
          }}
        >
          {"<devAI />"}
        </div>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {["DOCS", "PRICING", "CHANGELOG"].map((item) => (
            <Link
              key={item}
              href="#"
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(255,255,255,0.9)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  "rgba(255,255,255,0.45)")
              }
            >
              {item}
            </Link>
          ))}
        </div>
        <Link
          href="auth/login"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
            background: "#00e5a0",
            color: "#0a0a0f",
            padding: "0.5rem 1.25rem",
            borderRadius: "2px",
            textDecoration: "none",
            fontWeight: 700,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        >
          GET ACCESS →
        </Link>
      </nav>

      {/* Hero */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 2.5rem 4rem",
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.16em",
              color: "#00e5a0",
              marginBottom: "1.5rem",
            }}
          >
            AI-POWERED CODE INTELLIGENCE
          </p>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
              lineHeight: "1.1",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              margin: "0 0 1.5rem",
              color: "#f5f5f0",
            }}
          >
            Your code,{" "}
            <span
              style={{
                fontStyle: "italic",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              understood,
            </span>{" "}
            reviewed &amp; fixed.
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: "1.75",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "2.5rem",
              maxWidth: "460px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Paste any code. Get instant comprehension, thorough review, and
            surgical bug fixes — powered by AI trained on millions of real-world
            codebases.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="auth/login"
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                background: "#00e5a0",
                color: "#0a0a0f",
                padding: "0.8rem 2rem",
                borderRadius: "2px",
                textDecoration: "none",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              START REVIEWING FREE →
            </Link>
          </div>
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "0.78rem",
              fontFamily: "'Courier New', monospace",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            No signup required. Works with JS, Python, Go, Rust, and 40+
            languages.
          </p>
        </div>

        {/* Right — animated terminal */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.75rem 1rem",
              background: "#161820",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.8,
                }}
              />
            ))}
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
                marginLeft: "0.5rem",
              }}
            >
              bugfix.js — devAI
            </span>
          </div>
          {/* Code area */}
          <div style={{ padding: "1.25rem 1.5rem", minHeight: "220px" }}>
            <pre
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.8rem",
                lineHeight: "1.7",
                margin: 0,
                color: showFixed ? "rgba(255,255,255,0.4)" : "#c8d3f5",
                textDecoration: showFixed ? "line-through" : "none",
                transition: "all 0.4s",
              }}
            >
              {typed}
              {!showFixed && (
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: "#00e5a0",
                    animation: "blink 1s step-end infinite",
                    verticalAlign: "text-bottom",
                    marginLeft: "1px",
                  }}
                />
              )}
            </pre>
            {showFixed && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  background: "rgba(0, 229, 160, 0.07)",
                  border: "1px solid rgba(0, 229, 160, 0.2)",
                  borderRadius: "4px",
                  animation: "fadeIn 0.5s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.7rem",
                    color: "#00e5a0",
                    margin: "0 0 0.5rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  ✓ BUG DETECTED &amp; FIXED
                </p>
                <pre
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.8rem",
                    lineHeight: "1.7",
                    margin: 0,
                    color: "#c8d3f5",
                  }}
                >
                  {fixedSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Features */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "5rem 2.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.25)",
            marginBottom: "3.5rem",
            textAlign: "center",
          }}
        >
          — THREE MODES OF INTELLIGENCE —
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5px",
            background: "rgba(255,255,255,0.07)",
          }}
        >
          {features.map((f) => (
            <div
              key={f.tag}
              style={{
                background: "#0a0a0f",
                padding: "2.5rem",
                transition: "background 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#0f1117")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#0a0a0f")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "2rem",
                }}
              >
                <span style={{ fontSize: "1.6rem" }}>{f.icon}</span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    color: f.accent,
                    opacity: 0.7,
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                  lineHeight: "1.3",
                  color: "#f0f0ea",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.42)",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
              <div
                style={{
                  marginTop: "2rem",
                  height: "1px",
                  background: f.accent,
                  opacity: 0.25,
                  width: "40px",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem 2.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            textAlign: "center",
            gap: "2rem",
          }}
        >
          {[
            { n: "40+", label: "Languages Supported" },
            { n: "< 2s", label: "Average Review Time" },
            { n: "94%", label: "Bug Detection Rate" },
            { n: "10M+", label: "Lines Reviewed" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "2.2rem",
                  fontWeight: 400,
                  color: "#f5f5f0",
                  letterSpacing: "-0.03em",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "0.25rem",
                }}
              >
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "7rem 2.5rem",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            color: "#00e5a0",
            marginBottom: "1.5rem",
          }}
        >
          READY TO START?
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: "1.15",
            color: "#f5f5f0",
            marginBottom: "1.5rem",
          }}
        >
          Ship cleaner code,{" "}
          <span
            style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}
          >
            faster.
          </span>
        </h2>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: "1.75",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "2.5rem",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Join thousands of developers who catch bugs before they reach
          production. Free forever. No credit card required.
        </p>
        <Link
          href="auth/login"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.9rem",
            letterSpacing: "0.06em",
            background: "#00e5a0",
            color: "#0a0a0f",
            padding: "1rem 2.5rem",
            borderRadius: "2px",
            textDecoration: "none",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          OPEN THE EDITOR →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.85rem",
            color: "#00e5a0",
          }}
        >
          {"<devAI />"}
        </div>
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.08em",
          }}
        >
          © 2025 · BUILT FOR DEVELOPERS, BY DEVELOPERS
        </p>
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media (max-width: 768px) {
          section { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

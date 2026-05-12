"use client";
import { useEffect, useRef, useState } from "react";

const STEPS: [number, string][] = [
  [0, "// initializing"],
  [12, "// parsing source files"],
  [28, "// building dependency graph"],
  [45, "// running static analysis"],
  [60, "// scanning for vulnerabilities"],
  [74, "// generating review report"],
  [88, "// applying patches"],
  [100, "// done"],
];

interface LoaderProps {
  /** Called once progress hits 100 */
  onComplete?: () => void;
  /** Override the label shown at 100% */
  doneLabel?: string;
}

export default function Loader({
  onComplete,
  doneLabel = "// done — ready",
}: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const currentRef = useRef(0);

  useEffect(() => {
    function tick() {
      const speed = currentRef.current < 90 ? 0.35 : 0.15;
      currentRef.current = Math.min(currentRef.current + speed, 100);
      setProgress(Math.round(currentRef.current));

      if (currentRef.current < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        onComplete?.();
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  const pct = Math.round(progress);
  const currentLabel =
    [...STEPS].reverse().find(([t]) => pct >= t)?.[1] ?? STEPS[0][1];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "320px",
        background: "#0a0a0f",
        fontFamily: "'Courier New', monospace",
        padding: "3rem 2rem",
      }}
    >
      {/* Brand mark */}
      <p
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "#00e5a0",
          letterSpacing: "-0.02em",
          opacity: 0.6,
          margin: "0 0 2.5rem",
        }}
      >
        {"<devAI />"}
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: 260,
          height: 2,
          background: "rgba(255,255,255,0.08)",
          marginBottom: "1.25rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "#00e5a0",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Percentage */}
      <p
        style={{
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.12em",
          margin: "0 0 0.6rem",
        }}
      >
        {pct}%
      </p>

      {/* Status message */}
      <p
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          color: "#00e5a0",
          opacity: done ? 1 : 0.7,
          margin: 0,
          minHeight: "1rem",
          transition: "opacity 0.3s",
        }}
      >
        {done ? doneLabel : currentLabel}
        {!done && (
          <>
            <Dot delay={0} />
            <Dot delay={0.4} />
            <Dot delay={0.8} />
          </>
        )}
      </p>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 1200);
    const offset = setTimeout(() => {}, delay * 1000);
    return () => {
      clearInterval(t);
      clearTimeout(offset);
    };
  }, [delay]);

  return (
    <span style={{ opacity: visible ? 1 : 0, transition: "opacity 0.1s" }}>
      .
    </span>
  );
}

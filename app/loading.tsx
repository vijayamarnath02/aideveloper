"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  ["// loading workspace", "initializing environment"],
  ["// fetching modules", "resolving dependencies"],
  ["// compiling sources", "building project tree"],
  ["// almost ready", "finishing up"],
] as const;

interface PageLoaderProps {
  onComplete?: () => void;
  duration?: number; // ms before calling onComplete (default 3200)
}

export default function Loading({
  onComplete,
  duration = 3200,
}: PageLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle status messages
  useEffect(() => {
    const t = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!onComplete) return;
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [onComplete, duration]);

  const [label, sub] = MESSAGES[msgIndex];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Scanline texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#00e5a0",
            letterSpacing: "-0.02em",
            marginBottom: "2.8rem",
            animation: "devai-fadein 0.6s ease forwards",
          }}
        >
          {"<devAI />"}
        </p>

        {/* Spinner rings */}
        <div
          style={{
            position: "relative",
            width: 64,
            height: 64,
            marginBottom: "2rem",
          }}
        >
          {/* Track */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.07)",
            }}
          />
          {/* Outer spinning arc */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1.5px solid transparent",
              borderTopColor: "#00e5a0",
              animation: "devai-spin 1s linear infinite",
            }}
          />
          {/* Inner counter-arc */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "1px solid transparent",
              borderBottomColor: "rgba(0,229,160,0.35)",
              animation: "devai-spin 1.6s linear infinite reverse",
            }}
          />
          {/* Centre dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00e5a0",
              transform: "translate(-50%, -50%)",
              animation: "devai-pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>

        {/* Status label */}
        <p
          key={label}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            color: "rgba(0,229,160,0.6)",
            margin: 0,
            animation: "devai-fadein 0.4s ease forwards",
          }}
        >
          {label}
        </p>
        <p
          key={sub}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.18)",
            margin: "0.4rem 0 0",
            animation: "devai-fadein 0.4s ease forwards",
          }}
        >
          {sub}
        </p>
      </div>

      <style>{`
        @keyframes devai-spin { to { transform: rotate(360deg); } }
        @keyframes devai-pulse {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(0.8); }
          50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.2); }
        }
        @keyframes devai-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}

"use client";

import { IconSparkles } from "@tabler/icons-react";
import "./ai-assistant.css";

/**
 * AI assistant FAB — SPARKLES variant (third FAB, for comparison). The
 * original two-star Tabler sparkles icon, now stroked with a brand gradient
 * (cyan → violet → magenta) via a shared <defs> gradient referenced from CSS.
 */
export function AiAssistantSparkles() {
  return (
    <button
      type="button"
      className="ai-fab ai-fab--left2 ai-fab--spark"
      aria-label="AI assistant (sparkles)"
      title="AI assistant"
    >
      {/* gradient def (zero-size svg) — referenced by id from the icon's
          stroke in CSS; userSpaceOnUse spans the icon's 24-unit viewBox */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="g-spark" gradientUnits="userSpaceOnUse" x1="3" y1="3" x2="21" y2="21">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="0.5" stopColor="#A78BFA" />
            <stop offset="1" stopColor="#F25CB0" />
          </linearGradient>
        </defs>
      </svg>
      <IconSparkles className="spark-ico" size={26} stroke={1.7} />
    </button>
  );
}

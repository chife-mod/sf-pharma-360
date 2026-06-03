"use client";

import { useEffect, useState } from "react";
import "./ai-assistant.css";

/**
 * AI assistant entry point — a premium round FAB pinned bottom-right on
 * every page. Black glass tile (matches the header pills) with a colourful
 * glow shimmering from underneath, and the Pharma-360 mark rebuilt as three
 * outline rings that draw on (0→100 stroke-draw), bloom for a few cycles,
 * then settle. Placeholder for now — the panel/chat is a later step.
 */
export function AiAssistant() {
  // After ~3 draw cycles the rings settle (stay drawn); the under-glow keeps
  // shimmering. CSS does the animation; this just flips to the settled state.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 7000);
    return () => clearTimeout(t);
  }, []);

  return (
    <button
      type="button"
      className={"ai-fab" + (settled ? " is-settled" : "")}
      aria-label="AI assistant"
      title="AI assistant"
    >
      <svg className="ai-rings" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="16" r="10.5" stroke="#FFE627" />
        <circle cx="16" cy="26.5" r="10.5" stroke="#DD45FF" />
        <circle cx="28" cy="26.5" r="10.5" stroke="#46FFE9" />
      </svg>
    </button>
  );
}

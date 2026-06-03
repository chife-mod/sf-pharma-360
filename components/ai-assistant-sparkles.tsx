"use client";

import { IconSparkles } from "@tabler/icons-react";
import "./ai-assistant.css";

/**
 * AI assistant FAB — SPARKLES variant (third FAB, left of the dots one, for
 * comparison). The original simple treatment: the two-star Tabler sparkles
 * icon on the same black glass tile + under-glow. Pops in; no draw motion.
 */
export function AiAssistantSparkles() {
  return (
    <button
      type="button"
      className="ai-fab ai-fab--left2 ai-fab--spark"
      aria-label="AI assistant (sparkles)"
      title="AI assistant"
    >
      <IconSparkles size={26} stroke={1.6} />
    </button>
  );
}

"use client";

import "./ai-assistant.css";

/**
 * AI assistant entry point — a premium round FAB pinned bottom-right on
 * every page. Black glass tile (matches the header pills) with a colourful
 * glow shimmering from UNDER it, and the Pharma-360 mark rebuilt as three
 * outline rings that draw on starting from the central intersection point.
 * Two bloom cycles, then it stops drawn (holds the last frame). Placeholder
 * for now — the panel/chat is a later step.
 *
 * Each ring is rotated so its stroke-draw begins at the point facing the
 * shared centre (≈22,23 = centroid of the three centres): yellow ring +90°,
 * magenta −30°, cyan −150°. So the mark blooms outward from the centre.
 */
export function AiAssistant() {
  return (
    <button type="button" className="ai-fab" aria-label="AI assistant" title="AI assistant">
      <svg className="ai-rings" viewBox="4 4 36 36" fill="none" aria-hidden="true">
        <circle cx="22" cy="16" r="10.5" stroke="#FFE627" style={{ transform: "rotate(90deg)" }} />
        <circle cx="16" cy="26.5" r="10.5" stroke="#DD45FF" style={{ transform: "rotate(-30deg)" }} />
        <circle cx="28" cy="26.5" r="10.5" stroke="#46FFE9" style={{ transform: "rotate(-150deg)" }} />
      </svg>
    </button>
  );
}

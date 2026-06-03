"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — TRI variant (fourth FAB, for comparison). Three small
 * separate colour circles in a triangle that pop in one after another
 * (scale + fade, slight overshoot). Same black glass tile + under-glow.
 */
const CIRCLES = [
  { id: "y", grad: "g-y4", cx: 22, cy: 14.5 },
  { id: "m", grad: "g-m4", cx: 15, cy: 26 },
  { id: "c", grad: "g-c4", cx: 29, cy: 26 },
];

export function AiAssistantTri() {
  return (
    <button
      type="button"
      className="ai-fab ai-fab--left3"
      aria-label="AI assistant (three circles)"
      title="AI assistant"
    >
      <svg className="ai-rings ai-tri" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-y4" gradientUnits="userSpaceOnUse" x1="17" y1="9.5" x2="27" y2="19.5">
            <stop offset="0" stopColor="#FFE627" />
            <stop offset="1" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="g-m4" gradientUnits="userSpaceOnUse" x1="10" y1="21" x2="20" y2="31">
            <stop offset="0" stopColor="#DD45FF" />
            <stop offset="1" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="g-c4" gradientUnits="userSpaceOnUse" x1="34" y1="21" x2="24" y2="31">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
        {CIRCLES.map((c) => (
          <circle key={c.id} className="tri" cx={c.cx} cy={c.cy} r="5" fill={`url(#${c.grad})`} />
        ))}
      </svg>
    </button>
  );
}

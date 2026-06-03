"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — DOTS variant (sits left of the rings variant, for
 * comparison). Three colour dots: each fades in softly, holds a beat, then
 * spins out along an arc (the round-cap head reads as the dot, the arc is
 * its trail), and stops — with a little overshoot "twist" on the whole
 * group. Same black glass tile / under-glow / shadow as the rings variant.
 *
 * Geometry: pinwheel of three 80° arcs on a circle (centre 22,21.5 r9.5),
 * 120° apart → three dots end up evenly spread. Same brand colours.
 */
const ARCS = [
  { id: "y", grad: "g-y2", d: "M22 12 A9.5 9.5 0 0 1 31.36 19.85" },
  { id: "m", grad: "g-m2", d: "M30.23 26.25 A9.5 9.5 0 0 1 18.75 30.43" },
  { id: "c", grad: "g-c2", d: "M13.77 26.25 A9.5 9.5 0 0 1 15.89 14.22" },
];

export function AiAssistantDots() {
  return (
    <button
      type="button"
      className="ai-fab ai-fab--left"
      aria-label="AI assistant (dots)"
      title="AI assistant"
    >
      <svg className="ai-rings ai-dots" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-y2" gradientUnits="userSpaceOnUse" x1="14" y1="12" x2="31" y2="27">
            <stop offset="0" stopColor="#FFE627" />
            <stop offset="1" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="g-m2" gradientUnits="userSpaceOnUse" x1="14" y1="12" x2="31" y2="31">
            <stop offset="0" stopColor="#DD45FF" />
            <stop offset="1" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="g-c2" gradientUnits="userSpaceOnUse" x1="31" y1="12" x2="13" y2="31">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
        {ARCS.map((a) => (
          <path key={a.id} className="arc" pathLength={100} d={a.d} stroke={`url(#${a.grad})`} />
        ))}
      </svg>
    </button>
  );
}

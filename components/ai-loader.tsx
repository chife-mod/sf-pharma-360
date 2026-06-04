"use client";

import "./ai-loader.css";

/**
 * AI loader / spinner — built on the dots-pinwheel mark (`ai-assistant-dots`),
 * keeping its native principle: the three brand-gradient arcs grow OUT of dots
 * and collapse back INTO dots, on a loop.
 *
 * Cycle (~4s, eased "whoosh"): 3 dots → swoosh out to the full pinwheel (~1.5s)
 * → hold (~0.5s) → collapse back into 3 dots (~1.5s) → hold (~0.5s) → repeat.
 * Each arc is one path (round cap = the dot) drawn via stroke-dashoffset; the
 * whole mark counter-twists as it draws (the "проворот").
 */
const ARCS = [
  { id: "y", grad: "g-ld-y", d: "M22 9.5 A12 12 0 0 1 33.82 19.42" },
  { id: "m", grad: "g-ld-m", d: "M32.39 27.5 A12 12 0 0 1 17.90 32.78" },
  { id: "c", grad: "g-ld-c", d: "M11.61 27.5 A12 12 0 0 1 14.29 12.31" },
];

export function AiLoader({ size = 26 }: { size?: number }) {
  return (
    <span
      className="ai-loader"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <svg className="ai-loader__svg" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-ld-y" gradientUnits="userSpaceOnUse" x1="14" y1="12" x2="31" y2="27">
            <stop offset="0" stopColor="#FFE627" />
            <stop offset="1" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="g-ld-m" gradientUnits="userSpaceOnUse" x1="14" y1="12" x2="31" y2="31">
            <stop offset="0" stopColor="#DD45FF" />
            <stop offset="1" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="g-ld-c" gradientUnits="userSpaceOnUse" x1="31" y1="12" x2="13" y2="31">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
        {ARCS.map((a) => (
          <path key={a.id} className="ai-loader__arc" pathLength={100} d={a.d} stroke={`url(#${a.grad})`} />
        ))}
      </svg>
    </span>
  );
}

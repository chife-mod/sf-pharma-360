"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — ORBIT variant (my reading of "wedding rings as dots").
 * Interpretation: the DOTS are the subject; the rings are just the faint
 * dotted tracks they travel. Three bright colour dots orbit three interlocked
 * faint ring-tracks (like stones / planets on their bands), so the rings are
 * "made of" the moving dots. Same tile/glow/shadow.
 *
 * Rings: r=10.5 at (22,16)/(16,26.5)/(28,26.5). Each dot starts at the top of
 * its ring and rotates around that ring's centre (staggered phase).
 */
const Y = "M22 26.5 A10.5 10.5 0 0 1 22 5.5 A10.5 10.5 0 0 1 22 26.5";
const M = "M25.07 21.21 A10.5 10.5 0 0 1 6.93 31.79 A10.5 10.5 0 0 1 25.07 21.21";
const C = "M18.93 21.21 A10.5 10.5 0 0 1 37.07 31.79 A10.5 10.5 0 0 1 18.93 21.21";

export function AiAssistantOrbit() {
  return (
    <button
      type="button"
      className="ai-fab ai-fab--left5"
      aria-label="AI assistant (orbiting dots)"
      title="AI assistant"
    >
      <svg className="ai-rings ai-orbit" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        {/* faint dotted ring-tracks */}
        <path className="track" d={Y} />
        <path className="track" d={M} />
        <path className="track" d={C} />
        {/* bright dots orbiting each ring's centre (staggered) */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 22 16" to="360 22 16" dur="5.5s" repeatCount="indefinite" />
          <circle cx="22" cy="5.5" r="2.4" fill="#FFE627" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 16 26.5" to="360 16 26.5" dur="5.5s" begin="-1.83s" repeatCount="indefinite" />
          <circle cx="16" cy="16" r="2.4" fill="#DD45FF" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 28 26.5" to="360 28 26.5" dur="5.5s" begin="-3.66s" repeatCount="indefinite" />
          <circle cx="28" cy="16" r="2.4" fill="#34E7CE" />
        </g>
      </svg>
    </button>
  );
}

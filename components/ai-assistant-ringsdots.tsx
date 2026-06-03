"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — RINGS-DOTS variant. The "wedding rings" (three
 * interlocked rings) rendered as DOTTED lines (round beads) instead of solid
 * strokes. Gradient beads; spins + fades into place. Same tile/glow/shadow.
 */
const Y = "M22 26.5 A10.5 10.5 0 0 1 22 5.5 A10.5 10.5 0 0 1 22 26.5";
const M = "M25.07 21.21 A10.5 10.5 0 0 1 6.93 31.79 A10.5 10.5 0 0 1 25.07 21.21";
const C = "M18.93 21.21 A10.5 10.5 0 0 1 37.07 31.79 A10.5 10.5 0 0 1 18.93 21.21";

export function AiAssistantRingsDots() {
  return (
    <button
      type="button"
      className="ai-fab ai-fab--left4"
      aria-label="AI assistant (dotted rings)"
      title="AI assistant"
    >
      <svg className="ai-rings ai-ringdots" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-c5" gradientUnits="userSpaceOnUse" x1="38.5" y1="16" x2="17.5" y2="37">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
          <linearGradient id="g-m5" gradientUnits="userSpaceOnUse" x1="5.5" y1="16" x2="26.5" y2="37">
            <stop offset="0" stopColor="#DD45FF" />
            <stop offset="1" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="g-y5" gradientUnits="userSpaceOnUse" x1="11.5" y1="5.5" x2="32.5" y2="26.5">
            <stop offset="0" stopColor="#FFE627" />
            <stop offset="1" stopColor="#FB923C" />
          </linearGradient>
        </defs>
        <path className="rd" d={Y} stroke="url(#g-y5)" />
        <path className="rd" d={M} stroke="url(#g-m5)" />
        <path className="rd" d={C} stroke="url(#g-c5)" />
      </svg>
    </button>
  );
}

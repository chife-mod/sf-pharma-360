"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — bottom-right on every page. Solid black tile with a
 * faint colour glow from under, and the Pharma-360 mark as three GRADIENT
 * outline rings woven Celtic-style — NO gaps.
 *
 * The weave (over/under) is done WITHOUT cutting the rings and WITHOUT
 * desynced bridge segments: the three full rings are drawn whole (one
 * continuous stroke each), then a couple of them are drawn AGAIN on top but
 * CLIPPED to just the crossing discs where they must go over. Because the
 * over-layer is the very same path with the very same animation, its
 * over-piece appears exactly when the ring's draw-head reaches that crossing
 * → perfect sync with the big ring. Base order Y(bottom)→M→C(top); the
 * clipped over-copies flip z at: Y>M @P1, Y>C @P3, M>C @P6 (Borromean).
 *
 * Two synchronised draw cycles, from the centre outward, then hold.
 * Placeholder for now (no panel yet).
 */
const Y = "M22 26.5 A10.5 10.5 0 0 1 22 5.5 A10.5 10.5 0 0 1 22 26.5";
const M = "M25.07 21.21 A10.5 10.5 0 0 1 6.93 31.79 A10.5 10.5 0 0 1 25.07 21.21";
const C = "M18.93 21.21 A10.5 10.5 0 0 1 37.07 31.79 A10.5 10.5 0 0 1 18.93 21.21";

export function AiAssistant() {
  return (
    <button type="button" className="ai-fab" aria-label="AI assistant" title="AI assistant">
      {/* viewBox centred on the rings' bbox (22, 21.25), a touch wider so the
          mark sits dead-centre and reads a little smaller. */}
      <svg className="ai-rings" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-c" gradientUnits="userSpaceOnUse" x1="38.5" y1="16" x2="17.5" y2="37">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
          <linearGradient id="g-m" gradientUnits="userSpaceOnUse" x1="5.5" y1="16" x2="26.5" y2="37">
            <stop offset="0" stopColor="#DD45FF" />
            <stop offset="1" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="g-y" gradientUnits="userSpaceOnUse" x1="11.5" y1="5.5" x2="32.5" y2="26.5">
            <stop offset="0" stopColor="#FFE627" />
            <stop offset="1" stopColor="#FB923C" />
          </linearGradient>
          {/* crossing discs where a ring must be drawn over on top */}
          <clipPath id="clip-y" clipPathUnits="userSpaceOnUse">
            <circle cx="26.45" cy="25.51" r="3.2" /> {/* P1: Y over M */}
            <circle cx="32.45" cy="16.99" r="3.2" /> {/* P3: Y over C */}
          </clipPath>
          <clipPath id="clip-m" clipPathUnits="userSpaceOnUse">
            <circle cx="22" cy="17.88" r="3.2" /> {/* P6: M over C */}
          </clipPath>
        </defs>

        {/* base: three whole rings, continuous (Y under, C over) */}
        <path className="ring" pathLength={66} d={Y} stroke="url(#g-y)" />
        <path className="ring" pathLength={66} d={M} stroke="url(#g-m)" />
        <path className="ring" pathLength={66} d={C} stroke="url(#g-c)" />

        {/* same paths + same animation, clipped to the crossing discs and
            painted on top → over-pieces, perfectly in sync with the rings */}
        <path className="ring" pathLength={66} d={Y} stroke="url(#g-y)" clipPath="url(#clip-y)" />
        <path className="ring" pathLength={66} d={M} stroke="url(#g-m)" clipPath="url(#clip-m)" />
      </svg>
    </button>
  );
}

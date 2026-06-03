"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — bottom-right on every page. Solid black tile (matches
 * the header pills) with a faint colour glow shimmering from under it, and
 * the Pharma-360 mark rebuilt as three GRADIENT outline rings woven Celtic-
 * style (Borromean over/under via masks) that draw on from the centre, then
 * un-draw (reverse) and redraw — two cycles, synchronised — then hold drawn.
 * Placeholder for now (no panel yet).
 *
 * Geometry: 3 circles r=10.5 at (22,16)/(16,26.5)/(28,26.5), centroid ≈
 * (22,23). Each ring is a <path> whose start point faces the centroid, so
 * the stroke draws (and un-draws) from the centre outward. The weave is done
 * with per-ring masks punching gaps at the crossings where that ring passes
 * UNDER another — each ring is under at 2 of its 4 crossings, over at 2.
 */
const RINGS = [
  // start point faces the centroid → draw begins at centre
  { id: "y", d: "M22 26.5 A10.5 10.5 0 0 1 22 5.5 A10.5 10.5 0 0 1 22 26.5", grad: "g-y", mask: "m-y" },
  { id: "m", d: "M25.07 21.21 A10.5 10.5 0 0 1 6.93 31.79 A10.5 10.5 0 0 1 25.07 21.21", grad: "g-m", mask: "m-m" },
  { id: "c", d: "M18.93 21.21 A10.5 10.5 0 0 1 37.07 31.79 A10.5 10.5 0 0 1 18.93 21.21", grad: "g-c", mask: "m-c" },
];

export function AiAssistant() {
  return (
    <button type="button" className="ai-fab" aria-label="AI assistant" title="AI assistant">
      {/* viewBox centred exactly on the rings' bbox centre (22, 21.25) and a
          touch wider than the content, so the mark sits dead-centre in the
          tile and reads a little smaller. */}
      <svg className="ai-rings" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          {/* gradient strokes: cold→violet, magenta→red, yellow→orange */}
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

          {/* weave masks — black discs hide the ring where it goes UNDER */}
          <mask id="m-y" maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44">
            <rect x="0" y="0" width="44" height="44" fill="#fff" />
            <circle cx="17.55" cy="25.51" r="2.7" fill="#000" />
            <circle cx="11.55" cy="16.99" r="2.7" fill="#000" />
          </mask>
          <mask id="m-m" maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44">
            <rect x="0" y="0" width="44" height="44" fill="#fff" />
            <circle cx="26.45" cy="25.51" r="2.7" fill="#000" />
            <circle cx="22" cy="35.12" r="2.7" fill="#000" />
          </mask>
          <mask id="m-c" maskUnits="userSpaceOnUse" x="0" y="0" width="44" height="44">
            <rect x="0" y="0" width="44" height="44" fill="#fff" />
            <circle cx="22" cy="17.88" r="2.7" fill="#000" />
            <circle cx="32.45" cy="16.99" r="2.7" fill="#000" />
          </mask>
        </defs>

        {RINGS.map((r) => (
          <path
            key={r.id}
            className="ring"
            d={r.d}
            stroke={`url(#${r.grad})`}
            mask={`url(#${r.mask})`}
          />
        ))}
      </svg>
    </button>
  );
}

"use client";

import "./ai-assistant.css";

/**
 * AI assistant FAB — bottom-right on every page. Solid black tile with a
 * faint colour glow from under, and the Pharma-360 mark as three GRADIENT
 * outline rings woven Celtic-style. The weave is done by paint order (no
 * gaps / cut-outs): the three full rings are drawn whole, then three short
 * "bridge" arcs are painted ON TOP at the crossings where the base order is
 * wrong — so a ring's piece simply goes over the other (the contrast carries
 * the over/under). Two synchronised draw cycles, from the centre, then hold.
 * Placeholder for now (no panel yet).
 *
 * Base paint order Y(bottom) → M → C(top). Bridges flip the z at 3 crossings
 * to make a Borromean alternation (each ring over at 2 crossings, under at 2):
 *   Y over M @ P1, Y over C @ P3, M over C @ P6.
 * pathLength=66 on every path so the bridges share the rings' draw timing.
 */
const RINGS = [
  { id: "y", grad: "g-y", d: "M22 26.5 A10.5 10.5 0 0 1 22 5.5 A10.5 10.5 0 0 1 22 26.5" },
  { id: "m", grad: "g-m", d: "M25.07 21.21 A10.5 10.5 0 0 1 6.93 31.79 A10.5 10.5 0 0 1 25.07 21.21" },
  { id: "c", grad: "g-c", d: "M18.93 21.21 A10.5 10.5 0 0 1 37.07 31.79 A10.5 10.5 0 0 1 18.93 21.21" },
];

// short over-segments, painted on top to flip z at 3 crossings (no gaps)
const BRIDGES = [
  { id: "b1", grad: "g-y", d: "M28.62 24.15 A10.5 10.5 0 0 1 24.02 26.30" }, // Y over M @ P1
  { id: "b2", grad: "g-y", d: "M32.38 14.43 A10.5 10.5 0 0 1 31.90 19.49" }, // Y over C @ P3
  { id: "b3", grad: "g-m", d: "M19.73 16.69 A10.5 10.5 0 0 1 23.90 19.58" }, // M over C @ P6
];

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
        </defs>

        {/* full rings (whole, no cut-outs) */}
        {RINGS.map((r) => (
          <path key={r.id} className="ring" pathLength={66} d={r.d} stroke={`url(#${r.grad})`} />
        ))}
        {/* over-segments on top → the weave, by paint order */}
        {BRIDGES.map((b) => (
          <path key={b.id} className="ring" pathLength={66} d={b.d} stroke={`url(#${b.grad})`} />
        ))}
      </svg>
    </button>
  );
}

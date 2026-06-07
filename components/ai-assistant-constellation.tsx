"use client";

import { useEffect, useRef } from "react";
import "./ai-assistant.css"; // base .ai-fab tile/glow/size/position (constellation is now the sole FAB)
import "./ai-assistant-constellation.css";

/**
 * AI assistant FAB — CONSTELLATION variant (orbit × sparkles merge).
 *
 * Scenario (one ~10s loop, JS rAF-driven):
 *   1. ORBIT  — three colour dots fly each on its OWN ring, INDEPENDENTLY
 *      (revs 2/3/4 + offset phases — never lockstep).
 *   2. DEPART — each dot peels off from its CURRENT orbit point and sweeps a
 *      cubic Bézier ARC into the icon. The arc LEAVES along the orbit tangent
 *      (ease-out) so there is no jerk — it flows out of the circle.
 *   3. MORPH  — parked, each round dot GEOMETRICALLY deforms into a 4-point
 *      star (quad controls slide corner→centre, radius grows). No fade.
 *   4. HOLD   — the stars sit ONE-TO-ONE on the real Tabler `sparkles` glyph:
 *      big star left-of-centre (9,12 r6 in 24-space) + two equal small stars
 *      upper-right (18,6 r2) & lower-right (18,18 r2), remapped to our viewBox.
 *   5. RETURN — collapse to dots, arc back (ease-in) ARRIVING along the orbit
 *      tangent so it merges into the circle without a jerk; resume orbit.
 */

const R_RING = 10.5;
const RINGS = [
  { cx: 22, cy: 16 },
  { cx: 16, cy: 26.5 },
  { cx: 28, cy: 26.5 },
];
const REVS = [2, 3, 4];
const PHASE = [-Math.PI / 2, -Math.PI / 2 + 2.39, -Math.PI / 2 + 4.78];

// Sparkle-icon SLOTS (Tabler layout, compact): big star left-of-centre + two
// small stars upper-right & lower-right. The smalls are enlarged ~2× and pulled
// in close to the big (Tabler-tight cluster). Dots are matched to the NEAREST
// slot at departure (see ASSIGN) so no dot crosses the whole circle — the
// magenta dot, closest to the big slot, forms the big star.
const TARGETS = [
  { x: 16, y: 21.25, R: 11.1 }, //  big slot   — bigger + further left (+50%)
  { x: 28.8, y: 13, R: 4.8 }, //    small slot — upper right, bigger + further right
  { x: 28.8, y: 29.5, R: 4.8 }, //  small slot — lower right, bigger + further right
];
const R_DOT = 2.4;
const LOOP_MS = 10000;

const P_DEPART = 0.42;
const P_ARRIVE = 0.52;
const P_MORPH = 0.58;
const P_HOLD_END = 0.74;
const P_UNMORPH = 0.79;
const P_RETURN_END = 0.89;

const TRACK_Y = "M22 26.5 A10.5 10.5 0 0 1 22 5.5 A10.5 10.5 0 0 1 22 26.5";
const TRACK_M = "M25.07 21.21 A10.5 10.5 0 0 1 6.93 31.79 A10.5 10.5 0 0 1 25.07 21.21";
const TRACK_C = "M18.93 21.21 A10.5 10.5 0 0 1 37.07 31.79 A10.5 10.5 0 0 1 18.93 21.21";

type Pt = { x: number; y: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
const easeIn = (t: number) => t * t;
const r2 = (n: number) => Math.round(n * 100) / 100;
const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const addS = (a: Pt, b: Pt, s: number): Pt => ({ x: a.x + b.x * s, y: a.y + b.y * s });
const norm = (v: Pt): Pt => {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
};
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

// orbit angle / position / unit tangent (direction of travel) for dot i
const orbitAngle = (p: number, i: number) => PHASE[i] + REVS[i] * 2 * Math.PI * p;
const orbitPosA = (a: number, i: number): Pt => ({
  x: RINGS[i].cx + R_RING * Math.cos(a),
  y: RINGS[i].cy + R_RING * Math.sin(a),
});
const orbitTangent = (a: number): Pt => ({ x: -Math.sin(a), y: Math.cos(a) });
const orbitPos = (p: number, i: number) => orbitPosA(orbitAngle(p, i), i);

// Match dots → slots by NEAREST (min total travel) from the deterministic
// departure positions, so a dot never crosses the whole circle to its slot.
// ASSIGN[dotIndex] = slot index.
const DEP_POS = [0, 1, 2].map((i) => orbitPos(P_DEPART, i));
const PERMS = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0],
];
let bestPerm = PERMS[0];
let bestCost = Infinity;
for (const perm of PERMS) {
  const c =
    dist(DEP_POS[0], TARGETS[perm[0]]) +
    dist(DEP_POS[1], TARGETS[perm[1]]) +
    dist(DEP_POS[2], TARGETS[perm[2]]);
  if (c < bestCost) {
    bestCost = c;
    bestPerm = perm;
  }
}
const ASSIGN = bestPerm;

function cubic(P0: Pt, C1: Pt, C2: Pt, P3: Pt, u: number): Pt {
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const c = 3 * v * u * u;
  const d = u * u * u;
  return { x: a * P0.x + b * C1.x + c * C2.x + d * P3.x, y: a * P0.y + b * C1.y + c * C2.y + d * P3.y };
}

// 4-point unit centred at (x,y). R = tip radius, m = morph (0 dot → 1 star).
function unitPath(x: number, y: number, R: number, m: number) {
  const c = (1 - m) * R;
  return (
    `M${r2(x)} ${r2(y - R)} ` +
    `Q${r2(x + c)} ${r2(y - c)} ${r2(x + R)} ${r2(y)} ` +
    `Q${r2(x + c)} ${r2(y + c)} ${r2(x)} ${r2(y + R)} ` +
    `Q${r2(x - c)} ${r2(y + c)} ${r2(x - R)} ${r2(y)} ` +
    `Q${r2(x - c)} ${r2(y - c)} ${r2(x)} ${r2(y - R)} Z`
  );
}

function sample(p: number, i: number) {
  const t = TARGETS[ASSIGN[i]];
  if (p < P_DEPART) {
    const o = orbitPos(p, i);
    return { x: o.x, y: o.y, R: R_DOT, m: 0 };
  }
  if (p < P_ARRIVE) {
    // DEPART — leave along the orbit tangent (ease-out → no jerk), ease into stop
    const a = orbitAngle(P_DEPART, i);
    const A = orbitPosA(a, i);
    const D = dist(A, t) || 1;
    const C1 = addS(A, orbitTangent(a), D * 0.45);
    const C2 = addS(t, norm(sub(A, t)), D * 0.28);
    const u = easeOut((p - P_DEPART) / (P_ARRIVE - P_DEPART));
    const pos = cubic(A, C1, C2, t, u);
    return { x: pos.x, y: pos.y, R: R_DOT, m: 0 };
  }
  if (p < P_MORPH) {
    const u = easeInOut((p - P_ARRIVE) / (P_MORPH - P_ARRIVE));
    return { x: t.x, y: t.y, R: lerp(R_DOT, t.R, u), m: u };
  }
  if (p < P_HOLD_END) {
    return { x: t.x, y: t.y, R: t.R, m: 1 };
  }
  if (p < P_UNMORPH) {
    const u = easeInOut((p - P_HOLD_END) / (P_UNMORPH - P_HOLD_END));
    return { x: t.x, y: t.y, R: lerp(t.R, R_DOT, u), m: 1 - u };
  }
  if (p < P_RETURN_END) {
    // RETURN — ease-in out of the stop, ARRIVE along the orbit tangent (no jerk)
    const a = orbitAngle(P_RETURN_END, i);
    const B = orbitPosA(a, i);
    const D = dist(t, B) || 1;
    const C1 = addS(t, norm(sub(B, t)), D * 0.28);
    const C2 = addS(B, orbitTangent(a), -D * 0.45);
    const u = easeIn((p - P_UNMORPH) / (P_RETURN_END - P_UNMORPH));
    const pos = cubic(t, C1, C2, B, u);
    return { x: pos.x, y: pos.y, R: R_DOT, m: 0 };
  }
  const o = orbitPos(p, i);
  return { x: o.x, y: o.y, R: R_DOT, m: 0 };
}

export function AiAssistantConstellation() {
  const paths = [
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null),
  ];
  const tracks = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      TARGETS.forEach((t, i) => paths[i].current?.setAttribute("d", unitPath(t.x, t.y, t.R, 1)));
      if (tracks.current) tracks.current.style.opacity = "0";
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = ((now - start) % LOOP_MS) / LOOP_MS;
      for (let i = 0; i < 3; i++) {
        const s = sample(p, i);
        paths[i].current?.setAttribute("d", unitPath(s.x, s.y, s.R, s.m));
      }
      let to = 1;
      if (p >= P_DEPART && p < P_ARRIVE) to = lerp(1, 0.18, (p - P_DEPART) / (P_ARRIVE - P_DEPART));
      else if (p >= P_ARRIVE && p < P_UNMORPH) to = 0.18;
      else if (p >= P_UNMORPH && p < P_RETURN_END) to = lerp(0.18, 1, (p - P_UNMORPH) / (P_RETURN_END - P_UNMORPH));
      if (tracks.current) tracks.current.style.opacity = String(to);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = (i: number) => {
    const o = orbitPos(0, i);
    return unitPath(o.x, o.y, R_DOT, 0);
  };

  return (
    <button
      type="button"
      className="ai-fab ai-fab--cst"
      aria-label="AI assistant"
      title="AI assistant"
      onClick={() => window.dispatchEvent(new CustomEvent("sf-open-assistant"))}
    >

      <svg className="ai-rings ai-cst" viewBox="2 1.25 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g-cst-y" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE627" />
            <stop offset="1" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="g-cst-m" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#DD45FF" />
            <stop offset="1" stopColor="#FF4D4D" />
          </linearGradient>
          <linearGradient id="g-cst-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34E7CE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>

        <g className="cst-tracks" ref={tracks}>
          <path className="cst-track" d={TRACK_Y} />
          <path className="cst-track" d={TRACK_M} />
          <path className="cst-track" d={TRACK_C} />
        </g>

        <path ref={paths[0]} className="cst-unit" fill="url(#g-cst-y)" d={init(0)} />
        <path ref={paths[1]} className="cst-unit" fill="url(#g-cst-m)" d={init(1)} />
        <path ref={paths[2]} className="cst-unit" fill="url(#g-cst-c)" d={init(2)} />
      </svg>
    </button>
  );
}

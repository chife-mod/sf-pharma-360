"use client";

import { useEffect } from "react";

/* Animated favicon — coloured dots fly into a dark disc on a conveyor (with
 * pauses + easing), overlapping like the brand mark; overlaps blend additively
 * so intersections show mixed colours. Canvas frames are swapped into the
 * <link rel="icon"> (the reliable cross-browser way — GIF/SVG favicons don't
 * animate in Chrome). */
export function AnimatedFavicon() {
  useEffect(() => {
    const S = 64;
    const cvs = document.createElement("canvas");
    cvs.width = S;
    cvs.height = S;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    const created = !link;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const prevHref = link.href;

    const cx = S / 2;
    const cy = S / 2;
    const R = S * 0.165; // dot radius
    const reach = S * 0.6; // fly-in start distance
    const ease = (x: number) => 1 - Math.pow(1 - x, 3); // ease-out cubic

    // 3 dots — colour, resting slot (offset from centre), entry angle, phase
    const dots = [
      { c: "#34E7CE", ox: -0.13, oy: -0.05, ang: -2.4, phase: 0 },   // teal
      { c: "#F25CB0", ox: 0.14, oy: -0.07, ang: -0.5, phase: 0.33 }, // magenta
      { c: "#F5B544", ox: 0.0, oy: 0.15, ang: 1.7, phase: 0.66 },    // gold
    ];

    const CYCLE = 90; // frames per loop (~9s at 100ms)
    let frame = 0;
    let timer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      // dark brand disc
      ctx.fillStyle = "#05071B";
      ctx.beginPath();
      ctx.arc(cx, cy, S * 0.47, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "lighter"; // additive → blended overlaps
      for (const d of dots) {
        const local = ((frame / CYCLE + d.phase) % 1); // 0..1
        let p: number;
        if (local < 0.32) p = ease(local / 0.32);            // fly in
        else if (local < 0.68) p = 1;                         // pause (settled)
        else p = 1 - ease((local - 0.68) / 0.32);             // fly back out
        const sx = cx + Math.cos(d.ang) * reach;
        const sy = cy + Math.sin(d.ang) * reach;
        const tx = cx + d.ox * S;
        const ty = cy + d.oy * S;
        const x = sx + (tx - sx) * p;
        const y = sy + (ty - sy) * p;
        ctx.fillStyle = d.c;
        ctx.beginPath();
        ctx.arc(x, y, R, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      try {
        link!.href = cvs.toDataURL("image/png");
      } catch {
        /* ignore */
      }
      frame = (frame + 1) % CYCLE;
      timer = window.setTimeout(draw, 100);
    };
    draw();

    return () => {
      window.clearTimeout(timer);
      if (created) link?.remove();
      else if (link) link.href = prevHref;
    };
  }, []);

  return null;
}

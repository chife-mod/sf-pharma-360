"use client";

import { useEffect } from "react";

/* Animated favicon — a circular MASK with big colour circles riding a conveyor
 * right→left. They overlap; overlaps blend ADDITIVELY so intersections show
 * mixed (logo) colours. Motion is shift→pause→shift→pause with an ease-in-out.
 * A static <link rel="icon" href=/favicon.svg> stays the baseline (shown before
 * JS / where the browser throttles favicon animation); this enhances it by
 * swapping the link href to canvas frames. Restores the static href on cleanup. */
export function AnimatedFavicon() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const S = 64;
    const cvs = document.createElement("canvas");
    cvs.width = S;
    cvs.height = S;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // update EVERY icon link (Next can emit more than one) so whichever the
    // browser actually displays gets the animation.
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']"));
    let createdLink: HTMLLinkElement | null = null;
    if (!links.length) {
      createdLink = document.createElement("link");
      createdLink.rel = "icon";
      document.head.appendChild(createdLink);
      links.push(createdLink);
    }
    const prev = links.map((l) => [l, l.getAttribute("href")] as const);

    const cx = S / 2;
    const cy = S / 2;
    const R_DISC = S * 0.47; // mask radius
    const R_BIG = S * 0.42; // travelling circle radius
    const SLOT = S * 0.5; // spacing → adjacent circles overlap (mix in the middle)
    const COLORS = ["#34E7CE", "#F25CB0", "#F5B544", "#A78BFA"]; // teal · magenta · gold · violet
    const STEP_FRAMES = 14; // frames per shift+pause (~1.3s at 90ms)
    const MOVE = 0.6; // first 60% of a step moves (eased), rest pauses
    const PERIOD = STEP_FRAMES * COLORS.length; // seamless loop (shift ≡ 0 again)
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let frame = 0;
    let timer = 0;

    const draw = () => {
      const stepf = frame / STEP_FRAMES;
      const istep = Math.floor(stepf);
      const local = stepf - istep;
      const moveE = local < MOVE ? easeInOut(local / MOVE) : 1;
      const shift = (istep + moveE) * SLOT;

      ctx.clearRect(0, 0, S, S);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R_DISC, 0, Math.PI * 2);
      ctx.clip(); // circular mask
      ctx.fillStyle = "#05071B"; // dark disc ground
      ctx.fillRect(0, 0, S, S);
      ctx.globalCompositeOperation = "lighter"; // additive → blended overlaps

      const kLo = Math.floor((shift - cx - R_BIG) / SLOT) - 1;
      const kHi = Math.ceil((shift + S - cx + R_BIG) / SLOT) + 1;
      for (let k = kLo; k <= kHi; k++) {
        const x = cx + k * SLOT - shift;
        ctx.fillStyle = COLORS[((k % COLORS.length) + COLORS.length) % COLORS.length];
        ctx.beginPath();
        ctx.arc(x, cy, R_BIG, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      try {
        const url = cvs.toDataURL("image/png");
        for (const l of links) l.setAttribute("href", url);
      } catch {
        /* ignore */
      }
      frame = (frame + 1) % PERIOD;
      timer = window.setTimeout(draw, 90);
    };
    draw();

    return () => {
      window.clearTimeout(timer);
      if (createdLink) createdLink.remove();
      for (const [l, h] of prev) if (l !== createdLink && h != null) l.setAttribute("href", h);
    };
  }, []);

  return null;
}

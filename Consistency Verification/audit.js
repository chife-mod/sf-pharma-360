/* ─────────────────────────────────────────────────────────────────────────
 * CONSISTENCY AUDITOR — runtime, pixel-truth QA for sf-pharma-360.
 *
 * Reads getComputedStyle off every rendered text element (not the source CSS,
 * which lies via inheritance / specificity / cascade) and checks it against
 * the DESIGN CONTRACT. Catches exactly the two failure modes we keep shipping:
 *   1) OFF-SCALE   — a font-size that isn't on the canonical type scale.
 *   2) DIVERGENCE  — one component role rendered at >1 size/weight (the
 *                    "13 here, 14 there for the same thing" bug).
 * Also emits a per-role SPEC table = the auto-extracted "design MD per
 * component" (role · count · size · weight · line-height · letter-spacing).
 *
 * HOW TO RUN
 *   • Claude preview:  paste this file's contents into preview_eval, then call
 *                      `JSON.stringify(auditConsistency(), null, 2)`.
 *   • DevTools console: paste, run `auditConsistency()`.
 *   • Run on EACH route (/dols and /dols/<id>) — different components mount.
 *
 * Re-run after every visual change. Zero off-scale + zero divergence = pass.
 * ───────────────────────────────────────────────────────────────────────── */

/* eslint-disable */
function auditConsistency(opts) {
  opts = opts || {};
  // ── DESIGN CONTRACT (keep in sync with DESIGN-CONTRACT.md) ──
  const SCALE = [11, 12, 14, 17, 22, 28, 36]; // px — the ONLY allowed sizes
  const WEIGHTS = [400, 500, 600, 700];
  // logo wordmarks are an explicit exemption (brand lockups, not UI type)
  const EXEMPT_ROLE = /(v2-brand-market|v2-brand-360|dd-bv-wordmark)/;
  // only audit OUR component roles, not Tailwind utility soup on shared chrome
  const SEMANTIC = /^(dd-|kpi|metric|tag\b|tags\b|card-|nav-|sort-|count-|cmp-|fchip|opt-|filter-|hdr-|search|ch-tab|channels|avatar|brand-pharma|empty)/;

  const root = document.querySelector(".v2-root") || document.body;
  const leaves = [...root.querySelectorAll("*")].filter((e) => {
    if (e.children.length !== 0) return false;
    if (!e.textContent || !e.textContent.trim()) return false;
    const cs = getComputedStyle(e);
    return cs.display !== "none" && cs.visibility !== "hidden";
  });

  const roleKey = (e) => {
    const cls =
      e.className && typeof e.className === "string"
        ? e.className.trim().split(/\s+/)
        : [];
    const semantic = cls.find((c) => SEMANTIC.test(c));
    return semantic || cls[0] || e.tagName.toLowerCase();
  };

  const byRole = {};
  for (const e of leaves) {
    const cs = getComputedStyle(e);
    const fs = Math.round(parseFloat(cs.fontSize));
    const fw = parseInt(cs.fontWeight, 10);
    const key = roleKey(e);
    (byRole[key] = byRole[key] || []).push({
      fs,
      fw,
      lh: cs.lineHeight,
      ls: cs.letterSpacing,
      color: cs.color,
      text: e.textContent.trim().slice(0, 28),
      semantic: SEMANTIC.test(key),
    });
  }

  const offScale = [];
  const divergent = [];
  const badWeight = [];
  const spec = [];

  for (const [key, arr] of Object.entries(byRole)) {
    const sizes = [...new Set(arr.map((a) => a.fs))].sort((a, b) => a - b);
    const weights = [...new Set(arr.map((a) => a.fw))].sort((a, b) => a - b);
    const exempt = EXEMPT_ROLE.test(key);
    const semantic = arr[0].semantic;

    if (!exempt) {
      const bad = sizes.filter((s) => !SCALE.includes(s));
      if (bad.length)
        offScale.push({ role: key, offending: bad, all: sizes, sample: arr[0].text, semantic });
      if (sizes.length > 1)
        divergent.push({
          role: key,
          sizes,
          count: arr.length,
          samples: arr.slice(0, 4).map((a) => `${a.fs}px "${a.text}"`),
          semantic,
        });
      const bw = weights.filter((w) => !WEIGHTS.includes(w));
      if (bw.length) badWeight.push({ role: key, weights, sample: arr[0].text });
    }

    spec.push({
      role: key,
      semantic,
      n: arr.length,
      size: sizes.join("/"),
      weight: weights.join("/"),
      lh: [...new Set(arr.map((a) => a.lh))].join("/"),
      ls: [...new Set(arr.map((a) => a.ls))].join("/"),
    });
  }

  // focus the noisy bits on OUR components by default
  const onlySemantic = (xs) => (opts.includeChrome ? xs : xs.filter((x) => x.semantic !== false));
  const result = {
    url: location.href,
    when: "(stamp after run)",
    totals: {
      roles: Object.keys(byRole).length,
      leaves: leaves.length,
      offScale: onlySemantic(offScale).length,
      divergent: onlySemantic(divergent).length,
      badWeight: badWeight.length,
    },
    offScale: onlySemantic(offScale),
    divergent: onlySemantic(divergent),
    badWeight,
    spec: spec.sort((a, b) => (a.semantic === b.semantic ? a.role.localeCompare(b.role) : a.semantic ? -1 : 1)),
  };
  result.pass = result.totals.offScale === 0 && result.totals.divergent === 0 && result.totals.badWeight === 0;
  return result;
}

if (typeof module !== "undefined") module.exports = { auditConsistency };

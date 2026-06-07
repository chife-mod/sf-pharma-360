# DESIGN CONTRACT — sf-pharma-360

> **Source of truth for QA.** Every rendered text element is checked against
> the values below by `audit.js`. This file and the auditor must stay in sync.
> If a value here changes, update `audit.js` (the `SCALE` / `WEIGHTS` consts)
> in the same commit.

---

## 1. Type scale (HARD RULE — the one we keep breaking)

Exactly **seven** sizes. Nothing else may render. One size per role; never a
1px gradation between two things that play the same role.

| px | Role | Examples |
|----|------|----------|
| **11** | CAPS / micro-labels (uppercase, tracked) | `kpi-label`, `dd-section-num`, `dd-bv-cap`, `dd-snap-hcol`, `tag`, `metric-label`, `dd-bar-meta` |
| **12** | Secondary / supporting text | `dd-handle`, `dd-aud-sub`, `dd-rank-val`, `dd-bv-tab` |
| **14** | **Body** — default reading size | `dd-bio`, `nav` items, `dd-rank-label`, `dd-topic-label`, `dd-bar-name`, `card-handle`, `dd-commenter-name` |
| **17** | Sub-headings / section titles | `dd-section-title`, `dd-hero-audtitle`, `cmp-title` |
| **22** | Medium numbers / card names | `metric-val`, `dd-bv-val`, `dd-aud-engval`, `card-name`, `avatar-num` |
| **28** | Big numbers (KPI hero) | `kpi-val`, `dd-aud-total` |
| **36** | Page H1 | `dd-name`, hero plain headline |

**Exemptions** (NOT UI type — brand lockups): `v2-brand-market`,
`v2-brand-360` (logo wordmark, ~19px), `dd-bv-wordmark` (brand-name fallback
standing in for a missing logo, 17px).

## 2. Weight

Allowed: **400 · 500 · 600 · 700**. (Inter variable axis.)

Convention by role:
- 400 — body / secondary running text
- 500 — interactive labels (tabs, nav, kpi-label)
- 600 — emphasised labels, caps, sub-headings, secondary numbers
- 700 — headline numbers (KPI/medium) and H1

> **Rule:** number values that share a *size* share a *weight*. All 22px
> numbers are **700** (`dd-bv-val`, `dd-aud-engval`, `metric-val`). `card-name`
> stays 600 — it's a name (heading), not a number. (Resolved 2026-06-07.)

## 3. Spacing & radius (tokens — no raw px in components)

- Spacing on a **4 px grid** (gaps/padding = multiples of 4). Use the v2
  tokens, never literal px in component CSS.
- Radius tokens only: `--r-xs --r-sm --r-md --r-lg --r-xl --r-pill`.
- Color: only the v2 token aliases (`--teal --cyan --magenta --amber --rose
  --blue --violet --text --text-dim --text-mute --text-faint --line --panel`)
  or `color-mix()` off them. No hand-typed hex in components — **the one
  intentional exception is `#fff`** for brand-logo tiles (logos need a white
  ground to stay legible on the dark page).

> Type + weight are the high-signal axes the auditor enforces today. Spacing/
> radius/color are contract'd here and spot-checked; extending `audit.js` to
> assert them is the documented next step (see audit.js header + REPORT.md).

## 4. Consistency laws (process)

1. **One denominator across pages.** `/dols` and `/dols/[id]` must share the
   same scale. (They do — verified.)
2. **Inherit principles via reusable components + shared styles**, never by
   copy-pasting a layout. New block → reuse an existing role class or add ONE
   new role to the contract; don't invent a per-card size/padding.
3. **No silent off-scale.** Any new size must be added to this table AND to
   `audit.js` deliberately — otherwise the auditor fails the build.

---

## How to verify (the conveyor)

Run `audit.js` on every route after any visual change:

1. Start dev (`preview_start` → port 4322) — note: **never** `next build`
   while dev runs (corrupts `.next`; if it happens: stop, `rm -rf .next`,
   restart).
2. Open each route: `/dols`, `/dols/<id>`.
3. Paste `audit.js`, run `auditConsistency()`.
4. `pass: true` (offScale 0 · divergent 0 · badWeight 0) = ship. Otherwise the
   report names the exact role + offending value.

Latest verdict: **REPORT.md**.

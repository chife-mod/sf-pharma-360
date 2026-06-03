# HANDOFF — sf-pharma-360 — 2026-06-03 (rev 4)

> **Entry point.** New Claude session reads this **FIRST**, then
> `CLAUDE.md`, then `DESIGN-SYSTEM-V2.md` (the active dev spec — `/dols`
> is built on it). Run `pnpm dev` (port 4310 per `.claude/launch.json`).
>
> Previous handoff archived as
> [`HANDOFF-2026-06-02-rev3.md`](HANDOFF-2026-06-02-rev3.md) — full
> history of the discovery → AI-tool brief phase. Read only if you need
> to know **how** we got here.

---

## 1. Where we are right now

Three concepts live side-by-side. The floating chip bottom-right
switches between them. Switch is sticky (localStorage).

| Route | Concept | Status |
|---|---|---|
| `/` | SFG-pattern tile launcher | live |
| `/dols` | **v1 — main (dev)** — Pharma OS-based, actively iterated | hot |
| `/concepts/v2/dols` | **v2 — Sterile Dark** — Market360 mirror | frozen snapshot |
| `/concepts/v3/dols` | **v3 — Pharma OS** — original source bundle port | frozen snapshot |

**The rotation that landed yesterday (2026-06-02):** the previous v2
(Pharma OS) was promoted to **the new v1** for active development. Old
v1 (Sterile Dark) became v2. v3 captures the original Pharma OS bundle
verbatim so we can A/B against polish.

**v2 and v3 are FROZEN** — they exist for comparison only. Don't touch
them. All polish lands on `/dols` (the new v1).

**Source repo:** `chife-mod/sf-pharma-360` (public).
**Live URL:** https://chife-mod.github.io/sf-pharma-360/ — GH Actions
auto-deploys on push to `main` via `peaceiris/actions-gh-pages`.

---

## 2. What landed this session (2026-06-03)

Order of events. Each is its own commit.

### 2.1 Grid overlay aligned to 1650 content rail
*Commit `8f02031` — "Cards: padding 24..."* (mixed with §2.2)

- Grid-overlay frame `max-width` 1440 → **1650** to match content shell.
- `html { scrollbar-gutter: stable both-edges }` added so the document
  and fixed-position overlays (grid-overlay, future modals) share the
  same effective centered viewport. Killed the ~8px misalignment
  between sidebar.l = 39 and overlay-cols.l = 40 (1px is the frame
  border).

### 2.2 Card polish
*Commit `8f02031`*

- Inner card padding **16 → 24**.
- **Default state quieted:** tier-color border highlight (`::before`)
  opacity 0.5 → **0**; top-right `.card-glow` opacity 0.10 → **0**.
- **Hover restores both:** border to 0.9, glow to 0.25.
- Channel beads got `align-self: flex-start` + dropped `padding-top` so
  they sit on the portrait's top edge (verified bead.top === avatar.top
  at y=219).
- Metrics strip padding/margin retuned to follow new 24 outer padding.
- Metric head icons bumped 12 → **16** (still Tabler via `Icons.*`
  re-export).
- **Labels shortened** (so all five fit comfortably):
  - "Audience Comments" → **"Comments"**
  - "Engagement Rate" → **"Engagement"**
- Values share font-size + `leading-none` so the 5-metric strip sits on
  one baseline (verified: tops = `[566,566,566,566,566]`).

### 2.3 Typography scale — 11px floor + round numbers
*Commit `d1d2f34`*

**Hard rule:** minimum font-size = **11px**. Matches Material 3
`labelSmall`, Apple HIG `caption2`, Atlassian DS smallest. Sub-11 is
rejected by every major DS.

**Hard rule:** round-number sizes only. No fractional values.

CSS shifts (only on active /dols; v2 and v3 snapshots stay verbatim):

| Selector | Was | Now |
|---|---|---|
| `.metric-label` | 9.5 | **11** ⬆ floor |
| `.v2-avatar-pill__role` / `.filter-count` | 10.5 | **11** ⬆ |
| `.filter-trigger .ft-label` / `.service-menu__item-desc` | 11.5 | **11** ⬇ |
| `.v2-nav-item` | 12.5 | **12** ⬇ |
| `.v2-avatar-pill__name` / `.card-handle` | 12.5 | **13** ⬆ |
| `.search input` / `.sort-value` / `.card-bio` / `.empty p` | 13.5 | **14** ⬆ |

### 2.4 WCAG AA contrast pass
*Commit `b663095`*

**Hard rule:** every text surface ≥ **4.5:1** for normal text / **3:1**
for large text (≥18.66px bold or ≥24px). Audited live on /dols, found
7 surfaces below AA (worst = filter opt-tally at **2.37**).

Token shifts (only on active /dols):

| Token / element | Was | Now | Ratio on bg |
|---|---|---|---|
| `--v2-text-mute` | `#5E6A87` (3.5:1 fail) | **`#8993AD`** | **5.5:1** ✓ |
| `--v2-text-faint` | `#45506C` (2.4:1 fail) | **`#7C869D`** | **4.6:1** ✓ |
| Header role label color | `text-white/45` (4.48 fail) | **`text-white/55`** | **6.3:1** ✓ |
| Header role label size | 10px (sub-floor) | **11px** | — |
| Header divider | `bg-white/20` | **`bg-white/[0.28]`** | (decorative, keeps ~2:1 vs role) |

All 8 prior failures verified live, now AA or AAA. A paste-ready
contrast-audit snippet lives in `DESIGN-SYSTEM-V2.md` under
"Accessibility — WCAG 2.1 AA contrast". Run it on every new surface.

---

## 3. Project rules now in force (carry forward)

These are project-wide invariants. New work must respect them. They are
documented in `DESIGN-SYSTEM-V2.md`; this is the cheat sheet.

1. **Minimum font-size = 11px** (`labelSmall` floor). No 9 / 10 / 9.5 /
   10.5 ever.
2. **Round-number font-sizes only** (10? no — floor is 11. Then 11 / 12
   / 13 / 14 / 16 / 18 / 20 / 21 / 22 / 24 / 28). No `12.5px`.
3. **WCAG 2.1 AA minimum** — text ≥ 4.5:1 (normal) / 3:1 (large).
   Audit every new text surface.
4. **8-pixel spacing grid** — 2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48
   / 56 / 64 … Banned: 20, 28, 36, 44 (off-grid). Only 12 is allowed
   as a half-step in the dense end.
5. **Icon-button standard** — 40×40 button + **20px Tabler** icon,
   centered via `inline-flex items-center justify-center` (NOT `grid
   place-items-center` — Tabler SVG default doesn't center horizontally
   in CSS Grid).
6. **Hover affordance** — `bg-white/20` minimum for icon-buttons and
   nav items, never lower (user explicitly couldn't see prior `white/5`).
7. **Retina images** — every avatar / photo sourced at ≥2× display
   size (Pravatar `?w=240` for a 60px display; Unsplash `?w=160` for
   40px display).
8. **Pixel-perfect default** — centering, balance, visible hovers, and
   on-baseline alignment are expected without being asked
   (`~/.claude/projects/.../memory/principle_pixel_perfect_default.md`).
9. **Layout binding** — content max-width **1650px**, 24 outer rail
   padding, 12-col CSS grid, 16px gap, sidebar `col-span-3` + main
   `col-span-9`. Grid overlay frame matches.
10. **`scrollbar-gutter: stable both-edges`** on `html` — never remove,
    it keeps fixed overlays aligned to document content.
11. **Icon library first, inline SVG only with reason.** Default is
    `@tabler/icons-react` via the `Icons` / `Social` re-exports in
    `components/v2/icons.tsx`. Reach for it before you reach for a
    hand-rolled `<svg>`. Inline SVG is allowed ONLY for: (a) brand
    marks not in any library (Pharma 360 multi-circle logo), (b)
    one-off illustrations (empty-state graphics), (c) animated SVG
    that needs `<animate>` morphs, (d) data visualization primitives
    (sparkline path generation). For everything else — UI affordances,
    nav glyphs, status icons, social brand marks — use Tabler. When
    porting a source bundle that ships inline SVGs, rewrite to Tabler
    before declaring the port done; don't leave the inline tail.

---

## 4. Open punch list — next session pickup

Stack-ranked from "user implied next" to "nice-to-have":

1. **Channels selector polish** (the 6 large channel icons below the
   bio on each card — `.channels` / `.ch-tab`). They already use the
   40+20 standard. Sanity-check the active-state underline + hover.
2. **Tags polish** — `Mid Tier` chip / `Bariatric Surgeon` chip /
   `Type Mixed` / `Group A`. The tier chip is tier-color-filled; the
   tag-kv (Type, Group) reads cleaner after §2.4 but the visual
   weight of 4 chips next to each other is heavy. Worth a pass.
3. **Sidebar filter panel** — re-do with the same pixel-perfect pass
   we just applied to the header + cards (spacing, hover states,
   accordion chevron motion).
4. **Single DOL detail page** — `/dols/[id]` still exists in legacy
   form. Needs full rebuild in the new aesthetic. Live ref:
   https://pharma.market360.ai/influencers/[id]
5. **Focus indicators (`:focus-visible`)** — WCAG 2.4.7 / 2.4.11. Not
   audited yet. Keyboard nav, skip-links, ARIA on custom controls
   (filter panel) — all open.
6. **Tap-target size** — buttons currently 40×40; WCAG 2.5.5 AAA wants
   44×44. Decide if we bump or accept AA.
7. **Color-blind sanity** — engagement traffic-light (red ≥3 / yellow
   ≥6 / green) and tier colors. Quick simulation via Chrome devtools
   "Emulate vision deficiencies".
8. **Inline-SVG audit on `/dols`** — sweep `components/v2/*` and
   `app/dols/*.tsx` for stray hand-rolled `<svg>` blocks and rewrite
   them to `@tabler/icons-react` per rule #11. Known exceptions to
   leave alone: `<PharmaMark />` in `site-header-v2.tsx`, the
   `Sparkline` component, the tier-star path inside the tier chip
   (could be `IconStarFilled` — worth checking).
9. **Three placeholder templates** the client asked for on 2026-05-21
   (carried from `vsevolod/CLAUDE.md`) — not relevant to this prototype
   but worth flagging when we move to the Vulcain deck.

---

## 5. Useful entrypoints

- **Active concept (where you write code):** `app/dols/page.tsx` →
  `components/v2/*` and `app/dols/v2.css`.
- **Frozen snapshots (don't edit):** `app/concepts/v2/dols/` and
  `app/concepts/v3/dols/`.
- **Design system spec:** `DESIGN-SYSTEM-V2.md` (active dev spec) +
  `DESIGN-SYSTEM.md` (rev 3, Market360 mirror — kept for v2 reference).
- **Concept switcher:** `components/service-menu.tsx` +
  `components/service-menu.css`.
- **Floating grid-overlay:** the same `service-menu.css` — toggle button
  is to the left of the concept chip.
- **Data mock:** `app/concepts/v3/data.ts` — 9 real DOL names, photos,
  channel sets. Shared across all three concepts.
- **Launch config:** `.claude/launch.json` → `pnpm dev` on `:4310`.

---

## 6. Conventions for the next handoff

This file is rev 4. The previous one is archived next to it. The
discipline going forward:

- **One HANDOFF.md** at the repo root, always the current session's
  state. Entry point.
- **Archive prior** on bump (today: `HANDOFF-2026-06-02-rev3.md`).
- **Inline this session's work** with commit refs so the new agent can
  jump back into git history.
- **Project rules** section is cumulative — it's the cheat sheet, never
  a session log.
- **Open punch list** is forward-looking, ranked by likely pickup.

---

*Written 2026-06-03 by Claude. Resume by reading §1–§3 (3 minutes), then
pick from §4.*

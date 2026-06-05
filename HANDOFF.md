# HANDOFF — sf-pharma-360 — 2026-06-04 (rev 6)

> **Entry point.** New session reads this **FIRST**, then `CLAUDE.md`,
> then `DESIGN-SYSTEM.md`. Dev server: `.claude/launch.json` → port
> **4310** (start via the preview tool, name `sf-pharma-360`; or
> `npm run dev`). Build check: `node_modules/.bin/tsc --noEmit`
> (+ `next build` only when the dev server is NOT running — corrupts `.next`).
>
> **Live:** https://chife-mod.github.io/sf-pharma-360/ — GH Actions
> auto-deploys on push to `main` (~1 min; `gh run watch <id>`). Repo
> `chife-mod/sf-pharma-360`. `basePath: /sf-pharma-360`, `trailingSlash: true`,
> `output: export`.
>
> Prior handoffs archived: `HANDOFF-2026-06-03-rev5.md` (and rev3/rev4).

---

## 1. Where we are now (all shipped + deployed)

### AI assistant FAB — DONE & consolidated
The **`constellation`** variant (orbit × sparkles morph) WON and is now the
**sole dashboard FAB**. `components/floating-fabs.tsx` renders only
`<AiAssistantConstellation/>` (hidden on `/sandbox` & `/uikit` via `usePathname`).
The other 6 variants survive **only in the `/sandbox` gallery** for reference.

- Motion (`components/ai-assistant-constellation.tsx`, JS rAF, ~10s loop): 3 dots
  orbit their own rings **independently** (revs 2/3/4) → peel off to the
  **nearest** icon slot along a tangent-matched cubic Bézier (no jerk) →
  **geometrically** morph (dot→4-point star, no fade) into the Tabler `sparkles`
  layout (1 big **magenta** R≈11 left-of-centre + 2 small gold/cyan, right) →
  hold → collapse → resume.
- **Button layering (don't regress!):** opaque face is `::after` (z-index **-1**)
  sitting ABOVE the conic glow `::before` (z-index **-2**), so the glow only
  haloes the edges and never tints the face. Border 24%. In the de-fixed
  galleries (`/sandbox`, `/uikit`) the FAB is `position: relative` (NOT static)
  so those pseudo-layers stay anchored to the button.
- The base `.ai-fab` tile/glow CSS lives in `components/ai-assistant.css`;
  the constellation now self-imports it (it's the lone FAB).

### Loader — DONE
`components/ai-loader.tsx` — looping spinner built on the **dots-pinwheel** mark
(`ai-assistant-dots`): 3 dots → swoosh OUT to the full pinwheel (~1.5s, eased) →
pause → collapse back INTO dots → pause → repeat (CSS, ~4s). The active/loading
indicator. Lives in the `/uikit` Components catalog.

### /sandbox — DONE
Inline comparison gallery of every FAB motion variant + the constellation merge.
**Frozen reference — leave as-is** (user: "не трогай").

### /uikit — REDESIGNED
shadcn-docs style: **left sticky scroll-spy rail** of tag/chip quick-links
(`↑ Top` + **Foundations** Color/Spacing/Type/Radius&Motion + **Components**
Tags/Buttons/Icons/KPI/Card/Pagination/Loader/AI-assistant). Full-width shell
(1680). KPI-hero / Toolbar span full width. Loader card + **AI assistant** card
(constellation, de-fixed). `IntersectionObserver` drives the active chip.

### Launcher (`/`) + ServiceMenu pill
Both **Design sandbox** & **UIKit** are Live and linked. The pill
(`components/service-menu.tsx`) uses Next **`<Link>`** (basePath-aware) — a raw
`<a href>` linked to the domain root on Pages (the bug we fixed).

### DOL detail `/dols/[id]` — FIRST ITERATION shipped
`app/dols/[id]/page.tsx` (static-export via `generateStaticParams` over the 9
DOLs) → `components/v2/dol-detail.tsx` + `app/dols/[id]/detail.css`. Mock detail
data: `data/dol-detail.ts` (`buildDetail(dol)`, deterministic).
Sections: back-link · **profile** (avatar, tags, bio, CTAs) + right
**Audience snapshot** (per-channel followers/eng%/Δ) · **two-tile toolbar**
(channel tabs — reuse `.ch-tab` with the channel-colour active underline |
search + date range + ⋮, empty space between) · **KPI strip** · Brands ·
Discussed conditions / Medications tiles · Top hashtags / Key topics (bars) ·
Per-post averages · Top commenters. Reachable by **direct URL only** (cards on
`/dols` don't link to it yet). All English, v2 dark system.

---

## 2. Project rules in force (cheat sheet — full in DESIGN-SYSTEM.md)

1. **Min font-size 11px**, round-number sizes only (11/12/13/14/16/18/20/22/24/28).
2. **WCAG 2.1 AA** — text ≥4.5:1 / 3:1 large. Audit new surfaces.
3. **8-px spacing grid** — 2/4/8/12/16/24/32/40/48/56/64. Banned 20/28/36/44.
4. **Icon-button standard** — 40×40 button + 20px Tabler icon, `inline-flex`.
5. **Hover affordance** — `white/[0.08]` band; hover ≤ active.
6. **Tabler-first** via `components/v2/icons.tsx`. Inline SVG only for brand
   mark, illustrations, animated SVG, sparklines, real brand logos.
7. **Single typeface = Inter**; tabular-nums on numbers.
8. **Retina images** ≥2×. 9. **Layout** max-w 1650, 24 rail, 12-col, 16 gap.
10. **Pixel-perfect default** — centring/balance/visible-hover expected.

> ⚠️ **Preview caveats (learned this session):** the preview `getComputedStyle`/
> `innerWidth` evals intermittently report a **4px window** (stale ctx) — trust
> **screenshots**, not eval-measured sizes. Preview **screenshots go blank after
> a programmatic scroll** (flaky) — verify lower sections via a DOM-count eval or
> in a real browser. Pages 404s get **edge-cached** — use a `?v=` cache-bust to
> confirm a fresh deploy.

---

## 3. NEXT SESSION — plan (resume here)

We just did a **component-reuse REVIEW** of the DOL detail page. The page works
but I **duplicated** a few styles that already exist in `v2.css`. Refactor +
finish the page:

**(A) Refactor DOL detail to reuse v2 components (DRY):**
| Duplicated (`dd-*`) | Reuse instead |
|---|---|
| `.dd-kpi` KPI tiles | `.kpi` (+ `.kpi-icon/val/label/delta`; `KpiHero` pattern) |
| `.dd-tag` tags | `.tag` / `.tags` |
| `.dd-search` | `.search` |
| `.dd-pp` per-post metrics | `.metric` (+ `.metric-spark` / `Sparkline` component) |
| `.dd-icon-btn` (⋮) | `.v2-icon-btn` (40×40 standard) |
Genuinely-new, keep as-is: Audience snapshot, topic tiles, rank-bars, profile header.

**(B) Real brand logos in the Audience snapshot.** Currently `channelMeta`
(Tabler brand glyphs). User wants **real logos** ("не Tabler") on the RIGHT
snapshot — inline simple-icons SVGs. **Tabs keep our channel glyphs** (user OK).

**(C) Disease / Medication line illustrations.** **Consilium already ran** (this
session) — Gemini + Codex returned concepts at
`/Users/oleg/Dev/oz/consilium/sessions/2026-06-04-dol-disease-line-illustrations/`
(`02b-gemini.md`, `02c-raw.txt` — **NOT yet synthesized/cleaned**). Next:
synthesize → write `99-final` → **generate the line-art via nano-banana**
(Gemini image gen) → replace the placeholder `.dd-topic-art` sparkle icons.

**(D) Wire `/dols` influencer cards → `/dols/[id]`** (the InfluencerCard in
`components/v2/influencer-card.tsx`; make the card a `<Link href={`/dols/${d.id}`}>`).

Open priority question for the user: do A+B+C+D in one pass, or order them.

---

## 4. Key files

- **DOL detail:** `app/dols/[id]/page.tsx` · `components/v2/dol-detail.tsx` ·
  `app/dols/[id]/detail.css` · `data/dol-detail.ts`. Chrome inherited from
  `app/dols/layout.tsx` (`.v2-root` + `AppBgV2` + `SiteHeaderV2` + `.v2-shell`).
- **DOLs list:** `app/dols/page.tsx` → `components/v2/dashboard.tsx`. Tokens +
  reusable component classes: `app/dols/v2.css` (`.kpi`, `.tag`, `.metric`,
  `.ch-tab`, `.search`, `.v2-icon-btn`, `.toolbar`, …).
- **AI FAB / loader:** `components/ai-assistant-constellation.{tsx,css}` ·
  `components/ai-assistant.css` (base `.ai-fab`) · `components/floating-fabs.tsx`
  · `components/ai-loader.{tsx,css}` · the 6 archived variants `components/ai-assistant-*.tsx`.
- **Sandbox / UIKit:** `app/sandbox/{page.tsx,sandbox.css}` ·
  `app/uikit/{page.tsx,uikit.css}`.
- **Refs:** `Screenshots/02_LOM/0{1..4}.png` (current live + the 3 drafts the user
  likes). Live page being rebuilt: pharma.market360.ai/influencers/[id].
- **Design spec:** `DESIGN-SYSTEM.md`. **Consilium illustrations:** session path in §3C.

*Written 2026-06-04 (rev 6). Resume: read §1–§2 (~3 min), then §3.*

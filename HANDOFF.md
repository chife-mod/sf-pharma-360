# HANDOFF — sf-pharma-360 — 2026-06-06 (rev 7)

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

### DOL detail `/dols/[id]` — REDESIGNED per client video review (2026-06-06)
`app/dols/[id]/page.tsx` (static-export via `generateStaticParams` over the 9
DOLs) → `components/v2/dol-detail.tsx` + `app/dols/[id]/detail.css`. Mock detail
data: `data/dol-detail.ts` (`buildDetail(dol)`, deterministic). All English, v2
dark. **Reachable by direct URL only** — list cards don't link yet (see §3).
Shipped this session from Vsevolod's feedback:
- **Sticky "прилипала" bar** (`top:80`, below the global topbar) — **3 zones**
  per the AAYED reference (Screenshots/02_LOM or transcript): LEFT avatar + name
  + "Xk audience · N channels" (always visible) · CENTER channel switcher · RIGHT
  tools (search + date range + ⋮). CSS = a `1fr auto 1fr` grid so tabs stay
  centred. (Earlier reveal-on-scroll attempt dropped — client wanted identity
  always shown.)
- **Audience snapshot**: **real social logos** (hand-authored inline-SVG app
  tiles in `components/v2/brand-logos.tsx` → `SocialLogo`, deliberately NOT
  Tabler) + a **Sparkline of audience growth** (`+abs ↑pct% vs prev period`,
  replaces the old red/green pill) + per-channel followers/eng%/Δ. Search bigger.
- **Brands**: clickable **logo chips** (`BrandMark` = brand-colour monogram
  tile; no open pharma-logo set exists — real assets can drop in later).
- **Conditions / Medications tiles**: relevant Tabler glyph per topic +
  **mention-trend Sparkline** + **dotted-underline count** signalling clickable.
  Custom line-illustrations CANCELLED (see §3 note). Hashtag/topic rank rows are
  clickable too (dotted labels).
- **Mentions drawer** (`components/v2/mentions-drawer.tsx`): right slide-in panel
  with real social logos + dates + ♥/💬 — replaces the old modal popup. Opened
  by any topic/brand/hashtag. Mock samples via `mentionsFor(dol,label)`.
- **Audience-reaction zone**: dark band (`.dd-reaction`, amber dot) wrapping
  Per-post averages (reused `.metric` + Sparkline) + Top commenters —
  philosophy: light surfaces = what the DOL posts, dark = audience reaction.
- **DRY refactor (was §3A):** `dd-kpi→.kpi`, `dd-tag→.tag`, `dd-search→.search`,
  `dd-pp→.metric`, `dd-icon-btn→.v2-icon-btn`. Genuinely-new `.dd-*` kept.
- New data: `audienceTrend`, `audienceGrowth`, per-topic `trend`,
  `Mention`/`mentionsFor` in `data/dol-detail.ts`. `BRAND_META`/`BRANDS` +
  per-DOL `brands` now live in **`data/dols.ts`** (single source for the Brands
  filter + logo chips).

### DOLs list `/dols` — feedback batch DONE (2026-06-06)
From Vsevolod's video, all shipped in `components/v2/{dashboard,influencer-card,
filter-panel}.tsx` + `app/dols/v2.css`:
- **Favorites:** ⭐ star on each card (top-right, always visible; amber when on),
  persisted to `localStorage["sf-pharma-360:favorites"]`. **My Favorites** toggle
  at the top of the filter panel (count = #starred) filters to them.
- **Brands filter** (left) — array-membership filter on `Dol.brands`
  (special-cased alongside `channels` in dashboard + `FilterSection` tally).
- **Compare = hover checkbox** (NOT a kebab): on card hover a checkbox appears →
  multi-select (max 4) → floating **Compare bar** (bottom-centre, enabled ≥2) +
  a teal ring on selected cards (`.card.is-comparing`). The old ⋮ kebab is gone;
  a hover-only **Report** button sits beside the star.
- **Cards link to detail:** whole card is a **stretched `<Link>`** (`.card-link`,
  z-1); interactive controls (channel tabs, star, checkbox, report) sit at z-2.

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
> in a real browser. **IntersectionObserver callbacks never fire** in the preview
> env (tested 2026-06-06) — use a **scroll listener** for scroll-driven reveals.
> **Dev server has NO basePath** — routes are `/dols/…`, not `/sf-pharma-360/dols/…`
> (basePath only applies to the exported build). Pages 404s get **edge-cached** —
> use a `?v=` cache-bust to confirm a fresh deploy.

---

## 3. NEXT SESSION — plan (resume here)

Both the **detail page** and the **`/dols` list** feedback batches (§1) are
**DONE, reviewed & DEPLOYED** (push to main → GH Actions, 2026-06-06; commit
`51f7451`). A code-review pass (superpowers:code-reviewer) ran and its findings
were applied (11px-min caption, modal/drawer body-scroll-lock, on-grid spacing,
`type=button`, Pfizer chip contrast, compare-cap toast, auto-close compare <2).
Decided with the client: **no kebab** — Compare is the hover checkbox flow,
Report is a direct hover button (one action ≠ worth a menu).

**Done this round (was "remaining"):**
- ✅ **Compare view** — `components/v2/compare-modal.tsx`: column compare of the
  selected DOLs, per-metric leader highlight, remove-column, body-scroll-lock.
  Opened from the floating Compare bar (`Dashboard.compare: string[]`, max 4).
- ⚠️ **Report / Export = toast stubs.** Per-card Report, detail Add-to-report /
  Watchlist / Export, and CompareModal "Create report" all fire a transient
  toast (`.v2-toast`). **Real wiring belongs in the report-builder** (sibling
  `sfg-reports` project) — intentionally out of scope here.

**Still open / nice-to-have (not requested):** persist compare selection across
reloads; "select all visible"; a search box inside the Brands filter if the list
grows; touch-device affordance for the hover controls (currently shown via
`@media (hover:none)`).

**(4) Wire list cards → `/dols/[id]`** — make `InfluencerCard` a
`<Link href={`/dols/${d.id}`}>` (cards currently don't link; detail is direct-URL
only). Keep the channel-tab clicks / menu from triggering navigation.

**Resolved / cancelled this round:**
- Mentions interaction = **drawer** (done on detail). ✓
- Custom disease/medication **line-illustrations CANCELLED** by client ("скорее
  нет, меня устраивает"). The old Consilium session
  (`2026-06-04-dol-disease-line-illustrations/`) is **dead** — don't generate.
- Plates/cards stay **dark** (no lightening) — client likes the current look; a
  light/dark toggle is a *future* top-bar item, not now.
- Strategy aside (W460 leftover in the export PDF; idea to give influencers the
  tool free for media-kits) = **context only, not a design task**.

---

## 4. Key files

- **DOL detail:** `app/dols/[id]/page.tsx` · `components/v2/dol-detail.tsx` ·
  `app/dols/[id]/detail.css` · `data/dol-detail.ts` · `components/v2/brand-logos.tsx`
  (`SocialLogo` real logos + `BrandMark`) · `components/v2/mentions-drawer.tsx`.
  Chrome inherited from `app/dols/layout.tsx` (`.v2-root` + `AppBgV2` +
  `SiteHeaderV2` + `.v2-shell`).
- **DOLs list (next batch lives here):** `app/dols/page.tsx` →
  `components/v2/dashboard.tsx` · `components/v2/influencer-card.tsx` (favorites
  star, hover Compare/Report, card→detail Link) · `components/v2/filter-panel.tsx`
  + `FILTER_DEFS`/`Dol.brands` in `data/dols.ts` (Brands + My Favorites filters).
  Tokens + reusable classes: `app/dols/v2.css` (`.kpi`, `.tag`, `.metric`,
  `.ch-tab`, `.search`, `.v2-icon-btn`, `.toolbar`, …).
- **AI FAB / loader:** `components/ai-assistant-constellation.{tsx,css}` ·
  `components/ai-assistant.css` (base `.ai-fab`) · `components/floating-fabs.tsx`
  · `components/ai-loader.{tsx,css}` · the 6 archived variants `components/ai-assistant-*.tsx`.
- **Sandbox / UIKit:** `app/sandbox/{page.tsx,sandbox.css}` ·
  `app/uikit/{page.tsx,uikit.css}`.
- **Refs:** `Screenshots/02_LOM/0{1..4}.png` (current live + the 3 drafts the user
  likes). Live page being rebuilt: pharma.market360.ai/influencers/[id]. The
  audience-snapshot / sticky-header references the client showed are in this
  session's transcript (Tina Karol growth popup + AAYED sticky header + snapshot).
- **Design spec:** `DESIGN-SYSTEM.md`.

*Written 2026-06-06 (rev 7). Resume: read §1–§2 (~3 min), then §3 (the `/dols`
list batch). Detail page is done; deploy pending the user's go.*

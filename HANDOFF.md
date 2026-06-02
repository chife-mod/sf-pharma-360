# HANDOFF — sf-pharma-360 — 2026-06-02 (rev 3)

> **Live state of the project.** New Claude session reads this **FIRST**,
> then `CLAUDE.md`, then `DESIGN-SYSTEM.md` (rev 3) and/or
> `DESIGN-SYSTEM-V2.md` depending on which concept is being touched.
> Run `pnpm dev` (port 4310 per `.claude/launch.json`).

---

## 1. Where we are right now

**Phase:** Two design concepts live side-by-side on the same Next.js 15
prototype. Both are functional. Switchable via the floating chip
bottom-right.

| Route | Concept | Source-of-truth |
|---|---|---|
| `/` | SFG-pattern tile landing | `app/page.tsx` |
| `/dols` | **v1 — Sterile Dark / Market360 mirror** | `DESIGN-SYSTEM.md` (rev 3) + Figma `oR5AwDiD7ek4IxUOgyZCbU` |
| `/dols/[id]` | v1 DOL detail (legacy, see §6 build issue) | `app/dols/[id]/page.tsx` |
| `/concepts/v2/dols` | **v2 — Pharma OS** | `DESIGN-SYSTEM-V2.md` + Claude Design source bundle (extracted to `/tmp/p360-v2-new/`) |

**Direction (locked 2026-06-02):** Market360-native (rev 3) — Pharma 360
visual layer mirrors existing Market360 design DNA. Navy `#0c0e25` bg,
cyan `#46CAFF` primary (Pharma vertical color from Figma `119:4015`),
teal `#46FFC4` secondary, purple sparing accent. **UX structure
FROZEN** — all nav items, filter inventory, card composition,
sort, pagination preserved 1:1 from the live portal at
`pharma.market360.ai`.

## 2. What was produced this session (chronological)

### Documentation / direction

1. `DESIGN.md` — rev 3 addendum at top, rev 2 history preserved.
2. `DESIGN-SYSTEM.md` — full Aether-format rewrite to v3 (Market360
   mirror). Recipes for 12+ primitives, anti-list, verbatim quotes
   from Figma client annotations `365:2039` + `365:2041`.
3. `AI-BRIEF-dols-list.md` — 858-line single-file paste-ready brief
   (intro + DESIGN-SYSTEM.md embedded). For Figma Make / Lovable /
   v0 / Claude Design / Stitch handoff.
4. `BRIEF-dols-list.md` — historical (rev 2 era), kept on disk.
5. `DESIGN-SYSTEM-V2.md` — Premium Dark "Pharma OS" spec for v2
   (verbatim port of the design system the user pasted).

### v1 — Sterile Dark / Market360-mirror

- **Pixel-perfect header** from Figma `365:5013` (Main Menu inside
  Pharma-360 frame `365:5008`):
  - Two glass pills, `bg #05071b`, `backdrop-blur 15px`,
    `border rgba(255,255,255,0.10)`, `rounded 12px`.
  - LEFT pill: Pharma 360 logo (inline icon SVG + **Montserrat
    ExtraBold** wordmark PHARMA / 360, `13.652px / +0.13em
    tracking` — exact Figma spec, paths through `next/font/google`)
    + nav items (Pharma Media / DOLs / Reports) at Inter Regular
    14px, active DOLs with cyan `#46CAFF` dot.
  - RIGHT pill: search + bell + RE avatar.
- **KPI hero strip** (`components/kpi-hero.tsx`) — 4 tiles above the
  filter bar in 1440px container: Total DOLs 234 / Markets 27 /
  Therapeutic Areas 18 / Medications 62. Pattern mirrored from Figma
  `365:5008` Verticals row (icon + cyan label + display value).
- **Polished palette to rev 3** (this session, in `app/globals.css`
  `.dark` block):
  - `--surface: #111539` (Market360 Card 100:400 canonical, was
    oklch generic)
  - `--surface-elevated: #1A2050`
  - `--border-strong: oklch(1 0 0 / 20%)` (was 14% — bumped to
    Market360 canonical)
  - `--primary: #46CAFF` (Pharma vertical, was violet)
  - `--cat-1: #46CAFF`, `--cat-2: #46FFC4` (Pharma cyan + teal)
- DOL card chip tones aligned with rev 3 spec
  (`components/dol-card.tsx`): Mid Tier → cyan primary (was off-cyan),
  Clinical Dietitian → default muted (was mint, off-spec), Public →
  teal secondary (was amber, off-spec).
- KPI hero labels at `#46CAFF` Pharma cyan (was Medical Verticals
  `#46FFE9`) for system unity.

### v2 — Pharma OS (NEW concept, parallel to v1)

Built from a Claude Design handoff bundle (`herogYaNV7iCmT1YmVBiyw` ↔
`hMreKJO8mkzCHormH2UfVw` — bit-identical, extracted to
`/tmp/p360-v2-new/p360-v2/project/app/{chrome,card,data,icons,main}.jsx`
and `styles.css`).

Files:
- `app/concepts/v2/layout.tsx` — wraps every v2 page with `.v2-root`
  scope + AppBgV2 + SiteHeaderV2 + shell container.
- `app/concepts/v2/v2.css` — full token system (OKLCH-ish vars,
  v2-prefixed + unprefixed aliases so source-bundle styles paste 1:1)
  + topbar + toolbar + layout + filters + grid + card + metrics +
  empty state + active-chips. Scoped to `.v2-root`.
- `app/concepts/v2/data.ts` — typed port of `data.jsx`: 9 DOLs,
  TIERS, FILTER_DEFS (8 filters), SORTS, BUCKET_LABEL, fmt, spark.
- `app/concepts/v2/dols/page.tsx` — renders `<Dashboard />`.
- `components/v2/app-bg-v2.tsx` — fixed aurora backdrop.
- `components/v2/logo-mark.tsx` — 3-disc Market360 mark (canonical
  Pharma OS visual).
- `components/v2/site-header-v2.tsx` — **hybrid header** per user
  direction: v1's chrome (two glass pills, Pharma 360 SVG mark +
  Montserrat ExtraBold wordmark, Inter Regular nav with cyan-dot
  active) + RIGHT pill enriched with Figma `370:6560` content
  (search + bell-with-magenta-dot + settings + divider + Rana
  El-Khoury / STRATEGY LEAD text block + RE avatar circle with
  teal/violet gradient).
- `components/v2/icons.tsx` — Icons + Social + channelMeta as TS.
- `components/v2/sparkline.tsx` — SVG sparkline with gradient fill.
- `components/v2/influencer-card.tsx` — full InfluencerCard
  (avatar+ring, social beads, tags, channel switcher, 5-tile metric
  strip with sparklines).
- `components/v2/filter-panel.tsx` — FilterPanel + FilterSection
  (8 sections, tally counts, channel-chip grid for `channels`).
- `components/v2/toolbar.tsx` — Hide/show filters, count badge,
  search input, sort dropdown with click-outside.
- `components/v2/dashboard.tsx` — composition with filters/query/sort
  state, useMemo filtering, active-chips row, empty state.

### Landing + service-menu (SFG umbrella)

- **`app/page.tsx`** — SFG-pattern tile landing (mirror of
  `!sfg-dashboard!/index.html` canonical: 340px auto-fill grid,
  28px padding, 12px radius, `repeat(auto-fill, minmax(340px, 1fr))`).
  4 tiles: DOLs list (live), DOL detail (live, sample), Design
  sandbox (planned), UI kit (planned), **v2 — Pharma OS** (WIP).
  Hero with eyebrow + cyan dot + accent span on key word.
- **`components/service-menu.{tsx,css}`** — Project-Dashboard pill
  pattern ported into React. Floating bottom-right with grid-toggle
  (12-col overlay, localStorage) + version capsule (concept switcher).
  CONCEPTS: v1 — Sterile Dark, v2 — Pharma OS.

### "Lovable" naming purge

User caught a tool-name leak in v2 client-facing UI ("v2 — Lovable
Aurora"). Renamed throughout:

- Service-menu chip + dropdown desc → "v2 — Pharma OS / Premium
  dark — aurora glass, neon accents".
- Landing tile → "v2 / Pharma OS".
- v2 page placeholder → "v2 — Pharma OS · DOLs" (now replaced by
  full dashboard).
- File rename: `DESIGN-SYSTEM-V2-LOVABLE.md` → `DESIGN-SYSTEM-V2.md`.
- All v2 code comments + v2.css "Lovable" → "v2 source bundle".

Grep verification: 0 "lovable" mentions in `components/v2/`,
`app/concepts/v2/`, `DESIGN-SYSTEM-V2.md`, or client-visible UI.
v1 docs (HANDOFF.md, DESIGN-SYSTEM.md, AI-BRIEF-dols-list.md,
BRIEF-dols-list.md, CLAUDE.md) still list "Lovable" as one of the
candidate AI tools in the v1 handoff plan — these are dev-process
artifacts about v1, left as-is per user scoping ("это я про вторую
версию").

### Memory written

- `~/.claude/projects/.../memory/project_direction_market360_native.md`
  — locked direction rev 3 (Market360-native, cyan over violet,
  frozen UX inventory).
- `~/.claude/projects/.../memory/MEMORY.md` — index updated.

## 3. File map (current uncommitted state)

```
sf-pharma-360/
├── HANDOFF.md                                   ← this file
├── CLAUDE.md                                    M (memory updated)
├── README.md                                    unchanged
├── DESIGN.md                                    M (rev 3 addendum)
├── DESIGN-SYSTEM.md                             ? (rev 3 rewrite — new)
├── DESIGN-SYSTEM-V2.md                          ? (Pharma OS spec — new)
├── AI-BRIEF-dols-list.md                        ? (paste-ready brief — new)
├── BRIEF-dols-list.md                           ? (rev 2 historical — new)
├── RESEARCH.md, BRIEF.md                        unchanged
├── app/
│   ├── layout.tsx                               M (Inter+Inter Tight+Montserrat+SpaceGrotesk fonts)
│   ├── page.tsx                                 M (SFG-pattern tile landing)
│   ├── globals.css                              M (rev 3 palette + .landing scoped tokens)
│   ├── dols/page.tsx                            M (KPI hero + filter bar + cards + pagination)
│   ├── dols/[id]/page.tsx                       unchanged (legacy, see §6)
│   └── concepts/v2/                             ? (full v2 — layout, dols/page, data.ts, v2.css)
├── components/
│   ├── site-header.tsx                          M (pixel-perfect from Figma 365:5013)
│   ├── dol-card.tsx                             M (chip tones aligned with rev 3)
│   ├── chip.tsx                                 ? (unchanged structure, picks up new --cat-* values)
│   ├── filter-bar.tsx                           ? (unchanged)
│   ├── kpi-hero.tsx                             ? (NEW — Market360 Verticals row pattern)
│   ├── service-menu.tsx, service-menu.css       ? (NEW — concept switcher)
│   └── v2/                                      ? (all v2 components, 8 files)
├── public/
│   └── pharma-360-logo.svg                      ? (canonical logo, multi-circle mark + Montserrat wordmark)
├── data/dols.ts                                 unchanged (3 DOLs)
├── Screenshots/
│   ├── 00.png, 01–06.{png,webp}                 ? (live + Market360 + external refs)
│   ├── 01-influencers-list-fullpage.jpg         D (superseded by 01.png)
│   ├── 02-influencer-detail-fullpage.jpg        D (superseded by 02.png)
│   ├── references/menus/                        ? (Figma menu screenshots)
│   └── v1-sterile-dark/                         unchanged (rev 2 era baseline)
└── data/, lib/                                  unchanged
```

Plus v2 source bundle at `/tmp/p360-v2-new/p360-v2/project/` (extracted
from the Anthropic Design API URL the user shared — `hMreKJO8mkzCHormH2UfVw`).
Files: `chrome.jsx`, `card.jsx`, `data.jsx`, `icons.jsx`, `main.jsx`,
`styles.css`, plus 3 review screenshots + `Market360 DOLs - Dark.html`.

## 4. How to continue

**Default entrypoints when next session opens:**

1. Open `http://localhost:4310/` to see the landing.
2. From landing → DOLs list (`/dols`) lands on **v1**.
3. Floating chip bottom-right → switch to **v2 — Pharma OS** at
   `/concepts/v2/dols`.

**Live URLs after deploy** (this session — see §7):
- Production (anti-reference): `https://pharma.market360.ai/`
- GH Pages: `https://chife-mod.github.io/sf-pharma-360/` (TBD if
  enabled at end of session).

**Service-menu pill** auto-detects active concept by path prefix.
When new concepts arrive (Figma Make output / Lovable / v0 / Stitch
results), add an entry to `CONCEPTS` array in `components/service-menu.tsx`
with `path: "/concepts/<id>/dols"` and create a route under
`app/concepts/<id>/`.

## 5. Open work — pick from here

**v2 polish (next session):**
- Hero card ("The pulse of pharma voices, decoded in real time" with
  4 KPI tiles) — present in Figma `370:6560` reference but NOT in the
  Claude Design source bundle. Build by mirroring Figma + spec
  guidelines (aurora glow blobs in corners, glass-card chrome).
- Pagination (the source bundle has none — add per spec, rounded-lg
  32×32 buttons with teal→violet gradient active).
- AI Suggest card at filter-sidebar bottom (magenta→violet gradient,
  sparkle icon, "Generate list" CTA — per spec §6.4).
- Channel-tab underline color verify on small viewports.

**v1 polish (optional):**
- Filter chip active state (currently no visible difference vs rest).
- Card hover subtle cyan glow inset per rev 3 spec (currently border
  tint shift only).
- KPI strip on cards: thin-space thousands separator per spec
  (currently `175K` shortcut, fine for compact view).

**Cross-cutting:**
- Fix `output: 'export'` static-export warning at `/dols/[id]` route.
  Needs `generateStaticParams()` returning `[{id:"1"},{id:"2"},...]`
  for each DOL in `data/dols.ts`. Blocks production build via
  `pnpm build` — must fix before GH Pages deploy.
- Right-pill content on v2 header diverges from the source bundle's
  bell+avatar minimal version (per user 2026-06-02 direction —
  intentional, not a bug, see §6 note 2).

## 6. Notable warnings / known issues

1. **`/dols/[id]` static export blocker.** Dev server logs:
   `Page "/dols/[id]/page" is missing param "/dols/[id]" in
   "generateStaticParams()", which is required with "output: export"
   config.` Runs fine in `pnpm dev`. Fails `pnpm build`. Fix: add
   `export function generateStaticParams() { return DOLS.map(d => ({
   id: d.slug })); }` in `app/dols/[id]/page.tsx`.

2. **v2 header diverges from source bundle.** Source bundle's TopBar
   has just bell + RE avatar (minimal). User explicitly asked for
   header chrome from v1 + right pill content from Figma `370:6560`
   (search + bell + settings + Rana El-Khoury pill). Documented in
   `components/v2/site-header-v2.tsx` docstring.

3. **`/dols/[id]` legacy implementation.** Pre-rev 3 sterile-dark
   styling. Functional but not polished to current palette. Not in
   the next-session priority list unless user asks.

## 7. Deploy notes (in flight)

Repo path: `chife-mod/sf-pharma-360` (per `CLAUDE.md`, may not exist
yet on GitHub — verify via `gh repo view chife-mod/sf-pharma-360`).
Local dev port: 4310 (`.claude/launch.json`).

**Commit + deploy steps:**
1. `git status` → review uncommitted state.
2. Stage all files (this session's surface area covers v1, v2,
   landing, docs, memory).
3. Commit with descriptive message.
4. `gh repo create chife-mod/sf-pharma-360 --public --source=. --push`
   if repo doesn't exist; else `git push -u origin main`.
5. Configure GH Pages: `peaceiris/actions-gh-pages` workflow at
   `.github/workflows/deploy.yml` (per workspace standard) using
   `pnpm build` → `out/` directory. Requires §6 issue 1 fixed first.

## 8. Live URLs (chife-mod org)

- Production (anti-reference): https://pharma.market360.ai/
- This prototype (GH Pages target): https://chife-mod.github.io/sf-pharma-360/
- Market 360 Design Figma:
  https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design
- v2 Pharma OS Figma export (right-cluster reference):
  https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design?node-id=370-6560
- v2 source bundle (Claude Design):
  https://api.anthropic.com/v1/design/h/hMreKJO8mkzCHormH2UfVw

## 9. Tasks completed this session

Tasks #1–22 (see TaskList for full audit trail). Highlights:
- #13: Pixel-perfect bg + header on /dols from Figma 365:5008
- #17: Build v2 route + v2 header + v2 bg foundation
- #18: v1: add KPI hero strip per Figma 365:5008 pattern
- #19: Strip "Lovable" from all v2 client-visible refs
- #20: Port v2 dashboard body (toolbar + sidebar + card grid)
- #21: Re-port v2 from new source bundle (verified identical)
- #22: Audit + polish v1 and v2 to ideal state

---

*Written 2026-06-02 by Claude Opus 4.7 as a session handoff. Next
session: read §4 to find entrypoints; pick from §5 to continue; resolve
§6 issue 1 before any production deploy.*

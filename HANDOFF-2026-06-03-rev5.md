# HANDOFF — sf-pharma-360 — 2026-06-03 (rev 5)

> **Entry point.** New session reads this **FIRST**, then `CLAUDE.md`,
> then `DESIGN-SYSTEM.md`. Dev server: `.claude/launch.json` → port
> **4310** (start via the preview tool, name `sf-pharma-360`; or
> `npm run dev`). Build check: `node_modules/.bin/tsc --noEmit` +
> `node_modules/.bin/next build` (never `next build` while the dev
> server is running — corrupts `.next`).
>
> Prior handoffs archived: `HANDOFF-2026-06-03-rev4.md`,
> `HANDOFF-2026-06-02-rev3.md` (read only for history).

---

## 1. Where we are now

**Single surface — `/dols`.** The old v1/v2/v3 concept rotation is GONE;
`app/concepts/*` deleted. Two routes only:

| Route | What |
|---|---|
| `/` | SFG-pattern tile launcher |
| `/dols` | **The DOLs directory** — the hi-fi prototype, all work lands here |

**Source:** `chife-mod/sf-pharma-360` (public). **Live:**
https://chife-mod.github.io/sf-pharma-360/ — GH Actions auto-deploys on
push to `main` (~1 min; watch with `gh run watch`).

### `/dols` — current state (polished, responsive, deployed)
- **Header** (`components/v2/site-header-v2.tsx`): two glass pills, 3-step
  responsive collapse (≤1100 sheds utility icons → ≤900 nav→hamburger →
  ≤600 logo→mark). **Auto-hides on scroll-down, reveals on scroll-up**
  (NB: `will-change:transform` and `overflow-x:clip` both silently break
  `position:sticky` in Chrome — don't reintroduce them).
- **KPI hero** (`components/v2/kpi-hero.tsx`): eyebrow + gradient headline
  ("pharma voices, decoded in real time", nbsp glues "pharma voices"),
  4 KPI tiles. ~30% shorter than the first cut; **−/+ minimise toggle**
  folds it to a thin headline strip; also auto-collapses once on
  scroll-down (stays collapsed; threshold past the hero so scroll-anchoring
  hides the jump).
- **Toolbar** (`components/v2/toolbar.tsx`): Filters btn (+count) · result
  count · search (2× wide on desktop) · split-menu sort. Responsive: ≤720
  search grows + "SORT" label drops; ≤440 sort goes icon-only.
- **Filters** (`components/v2/filter-panel.tsx`): inline sidebar desktop;
  ≤1024 → right-side drawer (backdrop, sticky "Show N", dark scrollbar).
- **Card grid** (`components/v2/influencer-card.tsx`): avatar+name, tags
  (tier color-ramp star / specialty / type+group), bio, channel tabs,
  4-metric strip + sparklines + vertical delta arrows. 2-up → 1-up.
- **Bg** (`components/v2/app-bg-v2.tsx`): de-blued navy (`--v2-bg #0A0B16`),
  fixed corner glows + a square 40px grid bound to the 1650 content rail.
- **Data:** `data/dols.ts` (9 real DOL names, photos, channels, `SORTS`,
  `TIERS`). Single source of truth.

### AI-assistant FAB — 6 variants live (for client comparison)
Bottom-**right**, a row of FABs (the preview `ServiceMenu` — grid toggle +
section pill — moved bottom-**left**; Next dev "N" badge silenced via
`devIndicators:false`). All share the black-glass tile + faint under-glow +
one drop-shadow, mounted in `app/layout.tsx`:

| File | Variant | Note |
|---|---|---|
| `ai-assistant.tsx` | woven gradient rings (logo), draw-from-centre | the "обручальные кольца" |
| `ai-assistant-dots.tsx` | **dots-pinwheel** (3 dots spin out arcs) | **Oleg's current favourite** — bigger r=12 |
| `ai-assistant-sparkles.tsx` | two-star sparkles, gradient stroke | universal "AI" signifier |
| `ai-assistant-tri.tsx` | three solid filled circles | simplest |
| `ai-assistant-ringsdots.tsx` | rings as dotted beads | literal "rings as dots" |
| `ai-assistant-orbit.tsx` | dots orbiting faint ring-tracks (SMIL) | my "rings as dots" reading |

All are **placeholders** (no panel yet). Animation primitives: stroke-draw
keyframes, `cubic-bezier` ease-outs, 0.6s start delay + `both` fill (kills
first-cycle load jank), one unified shadow per mark (never per-element).

---

## 2. Project rules in force (cheat sheet — full in DESIGN-SYSTEM.md)

1. **Min font-size 11px.** Round-number sizes only (11/12/13/14/16/18/20/
   22/24/28). No 9/9.5/10.5/12.5.
2. **WCAG 2.1 AA** — text ≥4.5:1 (normal) / 3:1 (large). Audit every new
   surface. (Snippet in DESIGN-SYSTEM.md.)
3. **8-px spacing grid** — 2/4/8/12/16/24/32/40/48/56/64. Banned 20/28/36/44.
4. **Icon-button standard** — 40×40 button + 20px Tabler icon, centred with
   `inline-flex` (not grid).
5. **Hover affordance** — `white/[0.08]` band, hover ≤ active (no bright hovers).
6. **Tabler-first** — `@tabler/icons-react` via `components/v2/icons.tsx`.
   Inline SVG only for: brand mark, illustrations, animated SVG, sparklines.
7. **Single typeface = Inter** everywhere; tabular-nums on numbers.
8. **Retina images** ≥2× display size.
9. **Layout** — content max-width **1650**, 24 rail padding, 12-col grid,
   16 gap, sidebar span-3 / main span-9.
10. **`scrollbar-gutter: auto`** on `html` (NOT `both-edges` — that reserved
    phantom strips and the corner glows stopped short. The fixed bg + centred
    content share the same width, so the grid still aligns).
11. **Pixel-perfect default** — centring/balance/visible-hover/baseline
    expected without asking. Verify via `getBoundingClientRect` before shipping.

> ⚠️ Verification note: the preview `getComputedStyle`/`getBoundingClientRect`
> evals return **stale values** after rapid Fast-Refresh edits — trust
> **screenshots** (for the small FABs: headless Chrome `--screenshot` at
> `--force-device-scale-factor=3` + crop with PIL — see git history).

---

## 3. NEXT SESSION — plan (what we do next)

**(A) AI assistant — animation.** Keep polishing the assistant's motion.
Oleg leans toward the **dots-pinwheel** (`ai-assistant-dots.tsx`) but it's
not locked — the 6 variants are up for side-by-side comparison. Likely
flow: refine the favoured variant's animation → once chosen, **consolidate
to one** (remove the rejected components from `layout.tsx`, return the
winner to the single standard bottom-right position `right:24`, drop the
`--left*` offset classes).

**(B) Start the design system.** Move from one-off `components/v2/*` JSX
toward a **reusable component library with a navigator/examples browser** —
the shadcn-/Storybook-style pattern Oleg referenced (a docs site that lists
every component with all its states + token tables). Steps:
  1. Research the top GitHub reference (shadcn-ui docs site / Storybook /
     Ladle) — pick the lightest fit for a Next static-export prototype.
  2. Extract primitives from the two pages into `components/ui/`
     (`tag`, `kpi-tile`, `card`, `filter-chip`, `channel-selector`,
     `sidebar-section`, the AI-FAB, …), each owning its variants.
  3. Build a **`/system` catalog route** — renders every primitive ×
     variants + token tables (color/spacing/type/radius/motion). Deploys
     with the prototype; client gets one link to the visual system.
  4. Storybook/Ladle only if `/system` proves insufficient.

> Rule of thumb (carried): two pages reveal the real reuse inventory — the
> DOL **detail page** (`/dols/[id]`) is still unbuilt; building it alongside
> the design-system extraction is sensible (live ref:
> pharma.market360.ai/influencers/[id] — KPI hero w/ photo+halo+5 numbers,
> tabbed Brands/Diseases/Medicaments/Engagement/Comments, CTA footer).

---

## 4. Key files

- **Page:** `app/dols/page.tsx` → `components/v2/*` + `app/dols/v2.css`
  (the big stylesheet, `.v2-root`-scoped) + `app/globals.css`.
- **Data:** `data/dols.ts`.
- **AI FABs:** `components/ai-assistant*.tsx` (+ shared `ai-assistant.css`).
- **Preview chrome (bottom-left):** `components/service-menu.tsx` + `.css`.
- **Design spec:** `DESIGN-SYSTEM.md`. **Design review:**
  `REVIEW-dols-2026-06-03.md` (Consilium scores + roadmap).
- **Launch:** `.claude/launch.json` → `:4310`.

---

*Written 2026-06-03 (rev 5). Resume: read §1–§2 (~3 min), then §3.*

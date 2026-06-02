# AI-BRIEF — DOLs list page (rev 3, Market360-native pass)

> **Self-contained single-file handoff brief** for AI design tools
> (Figma Make → Lovable → v0 → Claude Design → Stitch). Paste this
> entire file into the AI tool as the system + task context, attach
> screenshots per §3, and generate.
>
> This file embeds **`DESIGN-SYSTEM.md` (rev 3) verbatim at the end**.
> Source of truth is the on-repo `DESIGN-SYSTEM.md` — this file is the
> paste-ready merged copy. When `DESIGN-SYSTEM.md` updates, regenerate
> this file by re-running the brief-intro section + re-pasting the
> system below.

---

## TL;DR for the AI tool

You are styling an existing pharma analytics product (`pharma.market360.ai`-style
DOL directory) so it reads as a **native sibling of Market360**, not a
Watch360 legacy. **You are NOT redesigning the UX.** The page items,
filter inventory, card composition, sort, pagination, and information
architecture are FROZEN — preserve them 1:1 from the live portal.
Change only the visual layer: surface color, border, glow, typography
weight, spacing rhythm, micro-interactions.

Palette: navy bg `#0A0E26`, surface `#111539`, primary cyan `#46CAFF`
(Pharma vertical color from Market360 industry palette), secondary
teal `#46FFC4`, purple `#9C46FF` as sparing accent only. Full system
in the embedded `DESIGN-SYSTEM.md` below.

**The single most important rule:** if you find yourself adding a new
filter, a new chart, a new nav item, a new widget, a sidebar, or a
"premium" hero — stop. Go back to the live composition.

---

## 1. What we're building

ONE screen — the **DOLs list page** at `/dols`. It shows a directory
of digital opinion leaders (KOLs / pharma physicians / dietitians /
surgeons) that analysts browse to build watchlists and reports.

**Live production version** (what the structure must match — visual
layer only is being changed): https://pharma.market360.ai/influencers

**Sections to render (in order, top to bottom):**

1. **Top nav** (`SiteHeader`) — Pharma 360 logo (use the SVG at
   `public/pharma-360-logo.svg`) + `PHARMA MEDIA` / `DOLs` / `REPORTS`
   nav + search icon-button + bell icon-button + user avatar (right).
   Sticky, glass treatment (canonical Market360 — see embedded system).
2. **Page header** — `h1` "DOLs" + inline body-sm count "234 tracked"
   + sort cluster on the right ("Sort by: Influencer Name" with a
   surface-filled dropdown button).
3. **Filter chips row** — leading "Filters" button + 8 filter chips in
   this exact order: **Audience Size · Country · City · Group · Type ·
   Name · Gender · Channel**. Each chip is closed (chevron-down rest
   state, popover NOT in scope). Active filter (has value) → tinted
   active state per chip recipe.
4. **Card grid** — 3 columns at `xl` (≥1280px), 2 columns at `lg`
   (≥1024px), 1 column below. Gap 16px. Render 9 cards (3 rich, 3
   sparse, 3 empty) so the AI exercises all three data states.
5. **Pagination** — centered footer, 7 numbered page buttons + chevrons
   on both sides.

**Out of scope this iteration:** DOL detail page, home, filter popover
bodies, signup/auth, light theme, animated intros, i18n. Don't render
those — focus on the list page only.

---

## 2. Frozen UX inventory (DO NOT CHANGE)

Per client annotation `365:2041` (Figma): *"The objective is to make
the existing Pharma experience feel like a native part of the Market360
ecosystem while preserving all current functionality, content
hierarchy, and workflows."*

- **Top nav items:** `PHARMA MEDIA` · `DOLs` · `REPORTS` · avatar.
  Same labels, same order, no additions.
- **Filter inventory:** Audience Size · Country · City · Group · Type ·
  Name · Gender · Channel. Same 8 items, same order. The live portal
  renders them as a left sidebar accordion; we render them as a
  horizontal chip row above the grid (same items, different layout —
  client annotation `365:2039` explicitly: *"No sidebar navigation"*).
- **Sort + count:** "234 influencers" count badge, "Sort by: Influencer
  Name" dropdown affordance.
- **DOL Card composition (visible on every card):**
  - Avatar circle (top-left)
  - Display name
  - Social platform chips (Tabler brand icons, monochrome)
  - 4 chips: tier (e.g. "Mid Tier") · specialty (e.g. "Bariatric
    Surgeon") · audience type (e.g. "Type Paid") · group (e.g. "Gr. C")
  - 2-line bio
  - Bottom KPI strip: **5 tiles in this order: FOLLOWERS · POSTS ·
    AUD. COMMENTS · COMMENTERS · ER**. Same labels, same order.
  - Three-dot menu (top-right)
- **Pagination + search behavior:** unchanged.

---

## 3. Reference set with per-screenshot guidance

The operator will attach these files when handing off. Use the column
guidance — **take ONLY what's in "Take"**, never copy what's in
"Do NOT take".

| File | What it is | Take | Do NOT take |
|---|---|---|---|
| `Screenshots/01.png` | **Live Pharma 360 DOL list portal** (anti-reference for visuals, source-of-truth for structure) | Card composition inventory, filter inventory, sort cluster, count "234 influencers", overall page anatomy | Beige/tan chip fills, gold-ring disease circles, light-on-light surfaces, multi-color social icons, sidebar filter accordion |
| `Screenshots/02.png` | **Live Pharma 360 DOL detail portal** (anti-ref for visuals, source-of-truth for detail structure — only relevant for context, not this iteration) | Section inventory, KPI strip composition, CTA footer pattern | Beige/tan chip fills, gold rings, etc. — same anti-list as 01 |
| `Screenshots/03.png` | Market360 marketing "Where product signals come from" — **Market360 visual continuity reference** | Card tile rhythm in a grid, selected-tile cyan-glow pattern (border + bottom bloom), gradient-border explainer card chrome (for studying surface depth) | Magenta as primary palette member; gradient-bordered marketing explainer as a product pattern; bright neon glow |
| `Screenshots/04.png` | Market360 marketing "AI Copilot" — **Market360 visual continuity reference** | Dark gradient-border hero module pattern, button placement, copy hierarchy | Marketing CTAs ("Explore Copilot"); violet CTA fill as a product pattern |
| `Screenshots/05.webp` | External dashboard inspiration (Dribbble) — **study only** | Information density rhythm, KPI tile layout density, table density (for studying, not copying) | Anything verbatim — colors, type, illustrations, animated globe, chart styles. Sidebar nav. |
| `Screenshots/06.webp` | External dashboard inspiration (Dribbble) — **study only** | KPI rhythm with subtitled metrics, dotted world-map low-noise data viz pattern, sparkline-card composition | Anything verbatim — sales-report palette, gradient orb, heavy-weight numerals, decorative 3D effects |

**Logo asset:** `public/pharma-360-logo.svg` — pre-built single SVG with
the multi-circle mark + "PHARMA 360" wordmark in Montserrat ExtraBold.
Use this as one atomic image. **Do not** rebuild the wordmark in HTML.

---

## 4. Data shape (TypeScript types)

Render the card array against this type. Mock data should include 3
rich, 3 sparse, and 3 empty records.

```ts
type SocialChannel =
  | "facebook" | "instagram" | "x" | "linkedin"
  | "youtube" | "tiktok" | "threads";

type AudienceTier = "Mega" | "Macro" | "Mid Tier" | "Micro" | "Nano";

type DolKind =
  | "Bariatric Surgeon" | "Endocrinologist" | "Cardiologist"
  | "Clinical Dietitian" | "Family Physician" | "Diabetes Dietitian"
  | "Health & Nutrition Coach" | "Physician DOL" | "NHS Doctor"
  | "Medical Association" | "Obesity Physician";

interface DolSignal {
  followers: number | null;
  posts: number | null;
  audienceComments: number | null;
  commenters: number | null;
  engagementRate: number | null; // 0..1, render as percentage
}

interface Dol {
  id: string;
  slug: string;
  name: string;
  photo?: string;                  // optional, fall back to initials
  tier: AudienceTier;
  kind: DolKind;
  audienceType: "Mixed" | "Public" | "Specialist";
  group: "A" | "B" | "C";
  country: string;
  city: string;
  gender: "Male" | "Female" | "Other";
  bio: string;                     // may be ""
  channels: SocialChannel[];
  primary: SocialChannel;
  signal: DolSignal;
}
```

---

## 5. Three card states (mandatory render)

The original brief pain: the live portal renders sparse data with
decorative "1, 1, 1, 1" circles that read as junk. Fix that here.

1. **Rich** — `followers: 412 000, posts: 1247, audienceComments: 89,
   commenters: 234, engagementRate: 0.034`. All KPI tiles dense with
   numbers, bio 2 lines, 4 chips, 6 social icons.
2. **Sparse** — `followers: 11 600, posts: 8, audienceComments: 1,
   commenters: 1, engagementRate: 0.0283`. KPI tiles show real but
   small numbers, bio truncates to 2 lines, 4 chips, 3 social icons.
   **Must NOT degrade visually — same shape as rich.**
3. **Empty** — `followers: null, posts: null, ...`. KPI tiles all
   render `—` (em-dash), bio = `EmptyLine` italic *"No biography on
   file"*, 4 chips, 1 social icon (primary). **Strip stays full
   width; card height matches the others.**

Render order in the 3×3 grid: row 1 = rich, rich, rich · row 2 =
sparse, sparse, sparse · row 3 = empty, empty, empty. The visual
similarity across rows is the key check — if you can tell at a glance
which row is sparse vs rich just from layout (not content), the
polishing failed.

---

## 6. Acceptance criteria

The output is acceptable when:

- **Reads as Market360 sibling.** A person who knows Market360 opens
  this page and instantly recognises the design language — same navy,
  same cyan accent, same card silhouette as the Market360 marketing
  cards.
- **Frozen inventory preserved.** Every nav item, filter chip, card
  field, KPI label is exactly as listed in §2. No additions, no
  reorders, no renames.
- **All three card states render convincingly.** A skim across the 3×3
  grid shows consistent chrome; the only differences are number density
  and chip count.
- **One left rail.** Top nav logo, page title, filter row, and card
  grid all sit on the same x-coordinate (12-col rail enforced).
- **No Watch360 / no fintech / no cyberpunk artefacts.** No beige/tan,
  no gold rings, no purple-as-primary, no aggressive neon, no
  animated scanlines, no 3D orbs.
- **Token discipline.** Every color matches a token from the embedded
  `DESIGN-SYSTEM.md` palette. No inline hex strings outside the token map.
- **Recipe fidelity.** Every primitive (Card, Chip, KPI Mini-Tile, Top
  Nav, Filter Chip, Avatar, Pagination Button, Primary CTA, Ghost
  Button) follows the corresponding recipe in the embedded system —
  same padding, same radius, same border, same typography combo.

---

## 7. Handoff checklist (for the operator running the AI tool)

- [ ] Open AI tool (Figma Make first per direction; then Lovable, v0,
      Claude Design, Stitch).
- [ ] Paste this entire `AI-BRIEF-dols-list.md` as the system + task
      context (it embeds the design system below).
- [ ] Attach `Screenshots/01.png` and `02.png` labeled as
      **"ANTI-REFERENCE for visuals, source-of-truth for structure"**.
- [ ] Attach `Screenshots/03.png` and `04.png` labeled as
      **"Market360 visual continuity reference"**.
- [ ] Attach `Screenshots/05.webp` and `06.webp` labeled as
      **"Study only — do NOT copy"**.
- [ ] Attach `public/pharma-360-logo.svg` if the tool accepts SVG; else
      describe it as "multi-circle mark + Montserrat ExtraBold wordmark
      PHARMA 360".
- [ ] Generate.
- [ ] Score against §6 acceptance. If a criterion fails → iterate or
      reject and re-prompt.
- [ ] When accepted → port back into the Next.js prototype, commit,
      push.

---

---

# Embedded `DESIGN-SYSTEM.md` (rev 3, Market360-native) — verbatim

> The remainder of this file is a literal copy of `DESIGN-SYSTEM.md`
> at the point this brief was generated. Source of truth is the on-repo
> `DESIGN-SYSTEM.md`. When that file updates, regenerate this brief.

---

---
version: "v3"
name: "sf-pharma-360 — Market360-native (Dark)"
description: "Design system spec for the sf-pharma-360 product UI — a B2B analytics portal for pharma DOL (digital opinion leader) discovery, mirroring the Market360 visual language so Pharma 360 reads as a native sibling of the Market360 ecosystem rather than a Watch360 legacy. Direction (rev 3, 2026-06-02): dark navy canvas, cyan primary (Pharma vertical color #46CAFF from Market360 industry palette), teal/green secondaries, purple as sparing accent only. Existing Pharma UX is FROZEN — no changes to DOL List structure, filter inventory, card composition, navigation items, search, sort, pagination, or information architecture. This system changes only the visual layer (color, surface, border, glow, typography weight, micro-interactions). Source-of-truth: Figma file oR5AwDiD7ek4IxUOgyZCbU (Market 360 Design), Card 100:400 / Main Menu 89:4855 / Industry Colors 119:4015. Client annotation verbatim quotes embedded in §Reference."
sourceFigma:
  fileKey: "oR5AwDiD7ek4IxUOgyZCbU"
  fileName: "Market 360 Design"
  pages:
    - "0:1 — Design (Market 360 Home 4:19862, Pharma-360 landing 365:3461, Colors swatch board 119:4015, DOL List client annotation 365:2039, DOL Detail client annotation 365:2041)"
    - "1:2 — Ui Kit (Main Menu desktop 89:4855, Card variant frame 222:5989 with 7 states including Default 100:400, Toggle 306:1522, Tabler Icons 89:5021)"
  variablesDefined: false
  paletteSource: "Industry color frame 119:4015 (vertical = color: Pharma #46CAFF, Medical #46FFFC, Tractors #46FFC4, Furniture #FFBE46, Beauty #9C46FF, Electronics #FF46BB, Automotive #FF9F46, Fashion #FF4649, Appliances #DD46FF, Machinery #465BFF, Watches #DEB99B). Cards confirmed bg #111539. Glass nav confirmed bg rgba(7,11,42,0.75)."
colors:
  bg: "#0A0E26"
  surface: "#111539"
  surface-elevated: "#1A2050"
  surface-glass: "rgba(7, 11, 42, 0.75)"
  border: "rgba(255, 255, 255, 0.10)"
  border-strong: "rgba(255, 255, 255, 0.20)"
  border-focus: "rgba(70, 202, 255, 0.40)"
  text-primary: "#FFFFFF"
  text-muted: "rgba(255, 255, 255, 0.70)"
  text-faint: "rgba(255, 255, 255, 0.40)"
  primary: "#46CAFF"
  secondary-teal: "#46FFC4"
  secondary-medical: "#46FFFC"
  accent-purple: "#9C46FF"
  data-1: "#46CAFF"
  data-2: "#46FFC4"
  data-3: "#46FFFC"
  data-4: "#FF9F46"
  data-5: "#FF46BB"
  data-6: "#9C46FF"
  positive: "#46FFC4"
  warning: "#FF9F46"
  negative: "#FF4649"
  glow-primary: "rgba(70, 202, 255, 0.35)"
  glow-secondary: "rgba(70, 255, 196, 0.25)"
typography:
  fontFamily-sans: "Inter, Geist Sans, system-ui, sans-serif"
  fontFamily-mono: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
  fontFamily-logo: "Montserrat, sans-serif"
  h1:
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "1.1"
    letterSpacing: "-0.01em"
  h2-section:
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0.10em"
    textTransform: "uppercase"
  card-title:
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: "-0.01em"
  body:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
  body-sm:
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.4"
  card-label:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
    color: "{colors.text-muted}"
  label-uppercase:
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "0.08em"
    textTransform: "uppercase"
  kpi-value-md:
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "1.0"
    fontVariantNumeric: "tabular-nums"
  kpi-value-lg:
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "1.0"
    fontVariantNumeric: "tabular-nums"
  logo-wordmark:
    fontFamily: "{typography.fontFamily-logo}"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: "1.0"
    letterSpacing: "0.13em"
    textTransform: "uppercase"
    notes: "Montserrat ExtraBold (800) — used ONLY for the Pharma 360 logo wordmark. Never for body, heading, button, or any other UI text. Mirrors Market 360 canonical (Figma node 89:4858)."
rounded:
  none: "0"
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  base: "4px"
  scale: "4, 8, 12, 16, 24, 32, 48"
  container-max-width: "1440px"
  container-padding: "24px"
  card-padding: "24px"
  card-inner-gap: "12px"
  grid-gap: "16px"
  section-gap: "32px"
  chip-gap: "8px"
  header-height: "64px"
components:
  card:
    bg: "{colors.surface}"
    border: "1px solid {colors.border-strong}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
    hover:
      border: "1px solid rgba(255, 255, 255, 0.30)"
    selected:
      border: "1px solid {colors.primary}"
      glow: "inset 0 -40px 60px -20px {colors.glow-primary}"
      corner-dot: "8px {colors.primary} top-right"
  chip:
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 12px"
    fontSize: "12px"
    fontWeight: 500
    border: "1px solid {colors.border}"
    textColor: "{colors.text-muted}"
    bg: "transparent"
    hover:
      border: "1px solid {colors.border-strong}"
      textColor: "{colors.text-primary}"
    active:
      bg: "{colors.surface-elevated}"
      border: "1px solid {colors.border-focus}"
      textColor: "{colors.text-primary}"
  button-primary:
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 20px"
    bg: "{colors.primary}"
    textColor: "#0A0E26"
    fontSize: "13px"
    fontWeight: 600
    hover:
      bg: "{colors.secondary-medical}"
  button-ghost:
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 20px"
    bg: "transparent"
    border: "1px solid {colors.border-strong}"
    textColor: "{colors.text-primary}"
    fontSize: "13px"
    fontWeight: 500
    hover:
      border: "1px solid {colors.primary}"
      textColor: "{colors.primary}"
  top-nav:
    position: "sticky top-0 z-30"
    bg: "{colors.surface-glass}"
    backdrop-blur: "15px"
    border-bottom: "1px solid {colors.border}"
    height: "{spacing.header-height}"
    container-max: "{spacing.container-max-width}"
    padding-x: "{spacing.container-padding}"
---

## Overview

- **Layout:** Grid (12-column, 16px gutter, 1440px container — Market360 canonical)
- **Content Width:** Bounded (1440px) — wider than the v2 1280 to match Market360 homepage hero rail.
- **Framing:** Solid surfaces with thin white-outline borders (NOT glass) for cards / KPI / panels. Glass treatment allowed ONLY for the sticky top nav — Market360 canonical pattern.
- **Grid:** Strong (12 columns, gutter 16px). Top nav, page title, filter chip row, and card grid all align on one left rail.
- **Density:** Medium-high (B2B analytics, data-first). Cards have generous 24px padding (Market360 canonical) — denser than typical SaaS but breathing-room above a cramped enterprise admin tool.
- **Mood:** Calm, data-first, "mature product feel". The interface should read as a sibling of Market360, not a Watch360 holdover. Subtle cyan glow on selected/focused state — never aggressive neon, never crypto/fintech/cyberpunk.

Composition rules:

- Bounded container `max-width: 1440px`, side padding `24px` on every page.
- Sticky 64px top nav with glass treatment (`backdrop-blur: 15px` over `rgba(7,11,42,0.75)`). Border-bottom `1px solid border`.
- Information density wins over decoration: data-first hierarchy, KPI plates and tables stay the visual heroes.
- One primary accent (`primary` cyan `#46CAFF`). Secondary teal `#46FFC4` for positive/data-second. Purple (`#9C46FF`) is an accent only — sparingly, never primary.
- No sidebar navigation. Filters live in a horizontal chip row above the card grid (rev 2 decision preserved — chip row is NOT a "new pattern", it's a flat reading of the live portal's sidebar filter inventory).

## Colors

Palette is sourced directly from Market 360 Figma (`oR5AwDiD7ek4IxUOgyZCbU`):

- **Surface chain** confirmed from Card primitive `100:400` (bg `#111539`) and Main Menu `89:4855` (bg `rgba(7,11,42,0.75)` = `#070B2A` @ 75%).
- **Accent (Pharma vertical)** confirmed from industry color frame `119:4015`: Pharma = `#46CAFF` (light cyan/blue).
- **Other industry colors** from the same frame are used as data-series tokens — Medical `#46FFFC`, Tractors `#46FFC4`, Beauty `#9C46FF`, etc.

### Brand & surface

| Token | Hex / RGBA | Role |
|---|---|---|
| `bg` | `#0A0E26` | Page canvas. Deep navy (slightly bluer than the nav base `#070B2A`). |
| `surface` | `#111539` | Cards, KPI plate, sidebar panels. **Canonical Market360 card bg.** |
| `surface-elevated` | `#1A2050` | Hover card, nested panel, chip active. One step above surface. |
| `surface-glass` | `rgba(7, 11, 42, 0.75)` | Top nav background, ONLY — pairs with `backdrop-blur: 15px`. **Canonical Market360 nav glass.** |
| `border` | `rgba(255, 255, 255, 0.10)` | Default hairlines, KPI tile dividers, nav border. |
| `border-strong` | `rgba(255, 255, 255, 0.20)` | **Default card border** (canonical from `100:400`). Hover border step. |
| `border-focus` | `rgba(70, 202, 255, 0.40)` | Focus ring, selected state border tint. |

### Text

| Token | Value | Role |
|---|---|---|
| `text-primary` | `#FFFFFF` | Headings, KPI numbers, table values, active nav. |
| `text-muted` | `rgba(255, 255, 255, 0.70)` | Body, card labels, metadata. **Canonical Market360 card-label opacity** (from Card `100:400`). |
| `text-faint` | `rgba(255, 255, 255, 0.40)` | Disabled labels, provenance lines, fine print, inactive icons. |

### Accent & data

| Token | Hex | Role |
|---|---|---|
| `primary` | `#46CAFF` | **Pharma vertical color** (from industry frame `119:4015`). Single primary accent: filled CTAs, focus ring, active nav indicator, selected-card border, primary chart series. |
| `secondary-teal` | `#46FFC4` | Positive deltas, secondary CTA hover, second chart series. |
| `secondary-medical` | `#46FFFC` | Hover variant of primary (slightly brighter), third chart series. |
| `accent-purple` | `#9C46FF` | **Sparingly only.** Reserved for: rare emphasis pulls on detail pages (e.g. a single "premium" tag), one final-position chart series. **Never** as primary, never as background, never as button fill. |
| `data-1`..`data-6` | `#46CAFF / #46FFC4 / #46FFFC / #FF9F46 / #FF46BB / #9C46FF` | Categorical chart series in that order. Purple is last so it's the least-used. |
| `positive` | `#46FFC4` | Up arrows, positive deltas, success badges. |
| `warning` | `#FF9F46` | Caution states, warning badges. |
| `negative` | `#FF4649` | Down arrows, negative deltas, error states. |

### Glow

Glow is **subtle and restrained** — never the aggressive neon of crypto/cyberpunk aesthetics. Applied only to:

| Token | Value | Where |
|---|---|---|
| `glow-primary` | `rgba(70, 202, 255, 0.35)` | Selected card inner-bottom bloom; primary CTA hover; focus ring outer shadow. |
| `glow-secondary` | `rgba(70, 255, 196, 0.25)` | Selected secondary tile inner bloom; positive-delta badge halo. |

**Usage map:**

- Page bg: `bg`. Top nav: `surface-glass` + `backdrop-blur: 15px`.
- Cards: `surface` solid bg, `border-strong` 1px outline. Hover: border opacity 30% (not a step-up to elevated bg). Selected: cyan border + inset bottom-bloom `glow-primary` + 8px top-right corner dot in `primary`.
- KPI strip inside a card: each tile `surface-elevated` separated by 1px `border` hairlines (via `gap-px` trick).
- Chips: transparent bg + `border` rest, `border-strong` hover, `surface-elevated` + `border-focus` active.
- Social icons: monochrome `text-muted` rest, `text-primary` for the active channel. **Never** brand colors.
- Charts: data series `data-1`..`data-6` in fixed order. Lines stroke 2px, areas at 20% opacity, dots 4px filled.

**No purple neon palette as the primary accent.** Client annotation `365:2041` explicitly: *"What we do NOT want to borrow: Purple neon palette"*. Purple (`accent-purple`) is reserved for sparing accent moments, never the base mood.

## Typography

One sans family for body, one display family for the **logo wordmark ONLY**. No serif. No antiqua. No brush.

- **Body / heading family:** Inter (with Geist Sans, system-ui as fallback). Variable, single import covers 400/500/600.
- **Monospace family:** Geist Mono. Used only for code snippets; numeric tile values prefer `tabular-nums` over an explicit mono switch.
- **Logo family:** **Montserrat ExtraBold (800)** — Market360 canonical for the wordmark (Figma node `89:4858`). Used **ONLY** for the `PHARMA 360` wordmark in the top nav. Never for body, heading, button, chip, KPI, or any other UI text. Documented as an explicit carveout.
- **Weights allowed (body family):** 400, 500, 600. Never 700+, never below 400.
- **Numerals:** `font-variant-numeric: tabular-nums` GLOBALLY on every digit — KPI tiles, tables, charts, pagination, percentages. Thin-space thousands separator (`140 600`, never `140,600` or `140k`).
- **Tracking policy:** `-0.01em` for h1 and card titles; `0` for body; `+0.08em` to `+0.10em` for uppercase labels; `+0.13em` for the logo wordmark.

| Token | Size / Weight / LineH / Tracking | Where |
|---|---|---|
| `h1` | 28 / 600 / 1.1 / -0.01em | Page title ("DOLs"). Pair with `body-sm` count to the right ("234 tracked"). |
| `h2-section` | 13 / 500 uppercase / 1.4 / +0.10em | Section titles on detail pages. |
| `card-title` | 15 / 600 / 1.3 / -0.01em | DOL name on the card; truncate on overflow. |
| `body` | 14 / 400 / 1.4 / 0 | Bio, body copy, table values. |
| `body-sm` | 12 / 400 / 1.4 / 0 | Metadata, hints, nav items, sort-by label, pagination. |
| `card-label` | 14 / 400 @70% opacity / 1.4 | Card center label. **Canonical from Card `100:400`.** |
| `label-uppercase` | 11 / 500 uppercase / 1.4 / +0.08em | KPI tile labels, badge labels, "Sort by". |
| `kpi-value-md` | 16 / 600 tabular / 1.0 | KPI value inside a list card. |
| `kpi-value-lg` | 32 / 600 tabular / 1.0 | KPI value on the detail page KPI strip. |
| **`logo-wordmark`** | **17 / 800 uppercase / 1.0 / +0.13em** | **Montserrat ExtraBold. PHARMA 360 wordmark ONLY.** |

## Layout

Twelve-column grid, 16px gutter, single left rail. The top nav, page title, filter chip row, and card grid all align on the same x-coordinate. This is the rule client explicitly asked for in rev 2 and is preserved in rev 3.

- **Base unit:** 4px. Everything snaps to a multiple of 4.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48.
- **Container:** `max-width: 1440px`, side `padding: 24px`. Below 1440 it hugs the gutter.
- **Top nav:** 64px tall, sticky, full-bleed glass treatment with the 1440px content row inside.
- **Page padding:** `py-10` (40px top/bottom) inside the container for product pages.
- **Card grid (DOL list):** 3 columns at `xl` (`min-width: 1280px`), 2 at `lg`, 1 below. Gap 16px.
- **Section gap (detail page):** 32px between major sections; 16px between blocks inside a section.
- **Card inner padding:** 24px on the content block (Market360 canonical from Card `100:400`); KPI strip is full-width inside the card, 12px per tile.

## Elevation & Depth

Solid surfaces, glass nav only. Depth comes from three controlled moves:

1. **Surface tier shift** — `bg` → `surface` → `surface-elevated`. Each step ~+15% lightness in oklch space.
2. **Border tint shift** — `border` (10% white) → `border-strong` (20% white, canonical card outline) → `border-focus` (cyan-tinted, selected/focused).
3. **Inset cyan glow** — restricted to selected card state (inset bottom-bloom `glow-primary`) and primary CTA hover. **No drop-shadow, no box-shadow, no text-shadow** anywhere.

The only blur in the system is on the sticky top nav (`backdrop-blur: 15px` over `surface-glass`) — Market360 canonical pattern.

- **Card surface style:** Solid (NOT glass). 1px white-outline border.
- **Top nav surface style:** Glass (Market360 canonical) — `backdrop-blur: 15px` over `surface-glass`.
- **Borders:** 1px only. No 2px borders, no dashed.
- **Shadows:** `none` — explicitly. `box-shadow` in a design preview is a regression.
- **Glow:** inset bottom-bloom on selected cards / primary CTA hover only. Subtle, never neon-bright.

## Shapes

Tight radius family — five allowed values: `0`, `4px`, `8px`, `12px`, `9999px`.

- **`0`** — KPI tile dividers (`gap-px` exposes `border` between tiles).
- **`4px`** — chips, tag pills, sort dropdown, page nav buttons, filter chips. Rectangular badge silhouette.
- **`8px`** — secondary buttons, small badges.
- **`12px`** — **cards (Market360 canonical from Card `100:400`)**, KPI plate on detail page, top nav glass pill (when used), modal containers. This is the **canonical card radius** — no exceptions, no scaling up to 16px or 20px.
- **`9999px`** — avatar circles, icon buttons, the small active-nav dot, status indicators.

**No large rounded corners.** Client annotation `365:2039` explicitly: *"What we do not want: Large rounded corners"*. Cards at 12px, secondary buttons at 8px, chips at 4px. Never go above 12px for cards.

**Iconography:**

- **Set:** `@tabler/icons-react` (confirmed canonical in Market 360 Ui Kit, frame `89:5021` with ~70 mapped icons).
- **Treatment:** Linear, stroke `1.5px` (body / card / nav) or `1.6px` (small controls). Never solid-filled outside of brand-channel icons.
- **Sizes:** 12px (chevrons), 14px (filter chips), 16px (card row), 20px (top nav buttons), 24px (section headers), 32px (card icon, Market360 canonical from Card `100:400`).
- **Color:** `text-muted` rest, `text-primary` active. **In-card icons sit at `text-faint` (40% opacity)** — canonical from Card `100:400` where the Tabler icon is at opacity 40%. Brand icons (Facebook, Instagram, X, etc.) — monochrome via Tabler `IconBrand{Channel}`, NEVER colored.

## Components

> Recipes below are the **interface language**. Without them an AI tool can mix tokens randomly and still produce something that doesn't read as Market 360. Each recipe specifies bg, border, padding, radius, typography, and the hover/active states with concrete pixel values and Figma node references.

### Top Nav (`SiteHeader`)

**Pattern:** sticky full-width bar with Market360 glass treatment. **NOT** a floating pill (the floating pill `89:4855` in Ui Kit is a marketing-pages pattern, not the product-app pattern). The live Pharma 360 portal already uses a sticky full-width bar — we preserve that shape (client annotation: *"No new navigation patterns"*) and re-skin the visual layer.

- **Container:** `position: sticky; top: 0; z-index: 30;`. `bg: surface-glass; backdrop-blur: 15px; border-bottom: 1px solid border; height: 64px;`. Inner row `max-width: 1440px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px;`.
- **Logo cluster (left):** the Pharma 360 logo asset at `public/pharma-360-logo.svg` rendered at `height: 40px; width: 145px` (intrinsic size). The SVG already contains the multi-circle mark + "PHARMA 360" wordmark in Montserrat ExtraBold. **Do not** rebuild the wordmark in HTML — use the SVG as a single atomic asset.
- **Nav (after logo, left-center):** items `PHARMA MEDIA`, `DOLs`, `REPORTS`. Each: `padding: 0 16px; height: 64px; display: inline-flex; align-items: center; gap: 8px;`. Typography `body-sm` (12 / 400) `text-muted` rest, `text-primary` active. The active item shows a 6px cyan dot (`bg: primary; rounded-full`) inline-block 8px below the label baseline (NOT to the right — Market360 active-indicator convention). Hover: text → `text-primary`, no underline, no bg shift.
- **Right cluster:** Search icon-button + Bell icon-button + Avatar circle. Each icon button: `size: 36px; rounded: 8px; bg: transparent;`. Hover: `bg: surface-elevated; text-primary`. Avatar: `size: 36px; rounded-full; bg: surface-elevated; border: 1px solid border-strong;` with 11px / 600 initials centered (white).
- **DO NOT:** add a search bar inline in the nav (Search opens an overlay); use colored brand icons; bold the nav items; make the nav a floating pill (marketing pattern, not product).

### Page Header (title block on list pages)

- **Title row:** `h1` (28 / 600 / -0.01em) `text-primary` + an inline `body-sm` count ("234 tracked") in `text-muted` baseline-aligned `gap: 12px` to the right.
- **Sort cluster (right):** `label-uppercase` "SORT BY" (11 / 500 uppercase / +0.08em) `text-faint` + sort button — `bg: surface; border: 1px solid border-strong; padding: 6px 12px; rounded: 8px; text-primary; 13px / 500; tabular;` chevron-down 12px `text-muted`. Hover: `border-focus`.
- **Below:** 16px gap, then the Filter Chips row.

### Filter Chips Row

Inline horizontal row above the card grid. Reads the live portal's sidebar filter inventory **without** adopting a sidebar. Client annotation `365:2039`: *"No sidebar navigation"*.

- **Layout:** `flex flex-wrap; gap: 8px;`.
- **Leading "Filters" button:** `height: 28px; padding: 0 12px; rounded: 4px; border: 1px solid border-strong; bg: surface; 12px / 500; text-primary;`. Leading icon `tabler:adjustments-horizontal` 14px stroke 1.6. Hover: `border-focus`.
- **Each filter chip (Audience Size, Country, City, Group, Type, Name, Gender, Channel — the existing 8 from the live portal):** same dims, `border: 1px solid border; bg: transparent; 12px / 500; text-muted;`. Hover → `border-strong; text-primary`. Active (filter has value): `bg: surface-elevated; border: 1px solid border-focus; text-primary;` + trailing close-x 12px. Trailing chevron-down 12px stroke 1.6 if inactive.
- **Chip order is FROZEN:** Audience Size → Country → City → Group → Type → Name → Gender → Channel. Matches live portal sidebar order top-to-bottom. **Do not** reorder, rename, add, or remove.

### DOL Card (centerpiece of the DOLs list page)

Recipe matches Market360 Card primitive `100:400` (Default state) for surface, border, radius, padding. Selected state matches `222:6020` (cyan border + bottom glow + corner dot). Content composition matches the live `pharma.market360.ai/influencers` card — preserved 1:1.

- **Container:** `bg: surface (#111539); border: 1px solid border-strong (rgba(255,255,255,0.20)); rounded: 12px; display: flex; flex-direction: column; overflow: hidden;`.
- **Hover state:** `border: 1px solid rgba(255,255,255,0.30)` ONLY. No scale, no translate, no shadow.
- **Selected state** (for filtered-in or shortlisted cards): `border: 1px solid primary; inset glow-primary bottom-bloom (inset 0 -40px 60px -20px rgba(70,202,255,0.35)); 8px corner dot top-right in primary`. Mirrors `222:6020`.

- **Top block (content):** `padding: 24px; gap: 16px;`.
  - **Identity row** — `flex; align-items: flex-start; gap: 16px;`:
    - **Avatar circle** — `size: 48px; rounded-full; border: 1px solid border-strong; bg: surface-elevated;` centered initials 13px / 600 `text-primary` (max 2 letters). On photo: full bleed image inside the circle.
    - **Identity column** — `flex-1; min-width: 0; gap: 8px;`:
      - **Social icon row** — `flex; gap: 8px;` of monochrome Tabler brand icons at 14px stroke 1.5. Active channel: `text-primary`; rest: `text-muted`. **No brand colors.** Disabled (unavailable channel) → not rendered.
      - **Name** — `card-title` (15 / 600 / -0.01em) `text-primary` `truncate`.
      - **Location** — "City, Country", 12 / 400 `text-faint`.
  - **Chip row** — `flex flex-wrap; gap: 8px;`:
    - Chip 1 (tier — e.g. "Mid Tier"): tone `primary`. `border: 1px solid border-focus; color: primary; bg: transparent;`.
    - Chip 2 (specialty — e.g. "Bariatric Surgeon"): tone `default`. `border: 1px solid border-strong; color: text-muted;`.
    - Chip 3 (audience type — e.g. "Type Paid"): tone `secondary-teal`. `border: 1px solid rgba(70,255,196,0.40); color: secondary-teal;`.
    - Chip 4 (group): tone `default`, prefix `Gr.` so it reads as a code. `border: 1px solid border-strong; color: text-muted;`.
  - **Bio** — `body` (14 / 400 `text-muted`), `line-clamp: 2`. Fallback: `EmptyLine` italic 13 / 400 `text-faint` "No biography on file".

- **KPI strip (bottom band):** Visually a 5-column slab that bleeds to the card edge.
  - `display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; border-top: 1px solid border; bg: border;` (the `border` bg leaks through `gap-px` to form hairlines).
  - Each tile: `bg: surface-elevated; padding: 12px 8px; gap: 4px;`.
    - Label: `label-uppercase` 10 / 500 / +0.08em `text-faint`. Labels: "FOLLOWERS", "POSTS", "AUD. COMMENTS", "COMMENTERS", "ER".
    - Value: `kpi-value-md` 16 / 600 tabular `text-primary`. Missing → em-dash `—`. **Never** render `0` as a placeholder.

**Sparse / empty rules (CRITICAL — preserved from rev 2):**
- < 3 mentions across brands/diseases/medicaments on detail page → collapse to one italic line per axis: *"Sparse mentions — 3 hashtags · 1 brand"*. No decorative N-circles.
- Null KPI → `—`. No animated zero counter.
- All-null signal → strip still renders with 5 em-dashes; never blank out the strip.

### Tag Chip (`Chip`)

Used in card chip row, detail page tag clusters, section header hints.

- `display: inline-flex; align-items: center; height: 28px; rounded: 4px; padding: 0 12px; font-size: 12px; font-weight: 500; line-height: 1; border: 1px solid; gap: 6px;`.
- **Tone `default`:** `border: border-strong; color: text-muted; bg: transparent;`. Hover → `border-focus; color: text-primary`.
- **Tone `primary`:** `border: border-focus; color: primary; bg: transparent;`.
- **Tone `secondary-teal`:** `border: rgba(70,255,196,0.40); color: secondary-teal;`.
- **Tone `accent-purple`:** `border: rgba(156,70,255,0.40); color: accent-purple;`. **Sparingly only** — never the default chip.
- **State `active`:** `bg: surface-elevated; color: text-primary; border: border-focus;`.

**DO NOT:** make chips pill-shaped (`rounded-full`); use the live portal's beige/tan "Bariatric Surgeon" tan filling; use a different chip silhouette on the detail page than on the card; mix tones randomly within a card (max 2 tones per card chip row + default).

### KPI Mini-Tile (inside the DOL card's KPI strip)

- `display: flex; flex-direction: column; gap: 4px; bg: surface-elevated; padding: 12px 8px;`.
- Label: `label-uppercase` 10 / 500 / +0.08em `text-faint`.
- Value: `kpi-value-md` 16 / 600 tabular `text-primary`.

### KPI Plate (detail page, full version)

- Container: `rounded: 12px; border: 1px solid border-strong; bg: surface;`.
- Inner grid: 5 columns, hairline dividers via `gap-px` over `bg: border;`.
- Each tile: `bg: surface; padding: 20px;`, `gap: 8px`.
  - Label: `label-uppercase` 11 / 500 / +0.10em `text-faint`.
  - Value: `kpi-value-lg` 32 / 600 tabular `text-primary`.
- Provenance footer: `border-top: 1px solid border; padding: 12px 20px;` 11 / 400 `text-faint`, tabular, copy: `Period 2026-04-29 → 2026-05-29 · updated 2026-05-29`.

### Social Icon (`SocialIcon`)

- Tabler brand icon family — `IconBrandFacebook`, `IconBrandInstagram`, `IconBrandX`, `IconBrandLinkedin`, `IconBrandYoutube`, `IconBrandTiktok`, `IconBrandThreads`.
- Size 14px (card) or 16px (detail header). Stroke 1.5.
- Active = `text-primary`. Rest = `text-muted`. Disabled (unavailable channel) — not rendered.

### Empty Line (`EmptyLine`)

- One line, `font-size: 13px; font-style: italic; color: text-faint;`.
- Copy template: `"<Noun phrase> — <count breakdown>"`, e.g. `"Sparse mentions — 3 hashtags · 1 brand"`, `"No biography on file"`, `"No commenter activity in this period"`.

### Section Header (`Section`)

- `display: flex; flex-direction: column; gap: 16px;`.
- Header row: `flex; justify-content: space-between; gap: 16px; align-items: center;`.
  - Title block (left): `h2-section` (13 / 500 uppercase / +0.10em) `text-primary`, plus optional hint `body-sm` `text-faint`.
  - Action area (right): Chip / button cluster.

### Bar List (`BarList`)

- `ul` with rows separated by `border-bottom: 1px solid border; padding: 8px 0;` (last row no border).
- Each row: `display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center;`.
  - Left column: 12 / 400 `text-primary` label (truncate), under it a 3px bar `rounded-sm; bg: border;` with fill `bg: primary @ 70%; width: (v/max) * 100%;`. Series 2+ uses `data-2`, `data-3`, etc.
  - Right column: 12 / 500 `text-muted`, tabular, raw value.

### Pagination

- Centered, `gap: 4px`, font 13px tabular.
- Each page button: `size: 32px; rounded: 4px;`.
  - Active: `bg: surface-elevated; color: text-primary; border: 1px solid border-focus;`.
  - Rest: `color: text-muted; hover: bg: surface; color: text-primary;`.
- Chevron buttons (`«` `‹` `›` `»`): `padding: 4px 8px`, `text-faint` for ends, `text-muted` for inner, hover `text-primary`.

### Primary CTA Button (one per page, max)

- `height: 40px; padding: 0 20px; rounded: 8px; bg: primary; color: #0A0E26 (dark navy); font-size: 13px; font-weight: 600; gap: 8px;`.
- **Dark text on cyan fill** — the primary is bright enough that white text fails contrast. Use the `bg` token color (`#0A0E26`) for foreground.
- Hover: `bg: secondary-medical (#46FFFC)` (slightly brighter cyan). No translate, no scale.
- Trailing arrow icon `tabler:arrow-right` 15px stroke 1.7.
- Focus ring: 2px `border-focus` offset 2px, plus outer `glow-primary` blur 12px.

### Ghost Button (secondary)

- `height: 40px; padding: 0 20px; rounded: 8px; bg: transparent; border: 1px solid border-strong; color: text-primary; font-size: 13px; font-weight: 500;`.
- Hover: `border: 1px solid primary; color: primary`.

## Do's and Don'ts

### Do
- Keep ONE primary accent (`primary` cyan `#46CAFF`). When tempted to add a second, use a categorical token on a chip border or chart series instead.
- Use the existing live-portal IA: same nav items, same filter items, same card composition, same sort, same pagination. **Visual layer changes only.**
- Use tabular numerals on every digit (KPI tiles, pagination, chart axes, table values).
- Thin-space thousands separator (`140 600`, French style). Never `140,600` or `140k`.
- Render sparse-data fallbacks as one italic line of `text-faint` copy. No decorative empty placeholders.
- Snap every spacing value to a multiple of 4.
- Use Tabler icons exclusively, stroke 1.5 in body / cards / nav.
- Align chips, headings, and card grid on one left rail (12-col grid, 1440px container).
- Use Market360 glass treatment ONLY on top nav. Cards stay solid.
- Use Montserrat ExtraBold ONLY on the logo wordmark.

### Don't
- **Don't redesign the UX.** No new widgets, no new navigation, no new functions, no IA changes. Client annotation `365:2041`: *"Keep the current DOL List and DOL Detail structure intact."*
- **Don't use a sidebar navigation.** Client annotation `365:2039`: *"What we do not want: Sidebar navigation"*. Filters go in the horizontal chip row.
- **Don't introduce large rounded corners.** Cards at 12px max. Client annotation `365:2039`: *"What we do not want: Large rounded corners"*.
- **Don't use purple as primary.** Purple (`accent-purple`) is reserved as a sparing accent. Client annotation `365:2041`: *"What we do NOT want to borrow: Purple neon palette"*.
- **Don't add fintech-style widgets, additional charts, or dashboard modules** beyond what the live Pharma 360 portal already has. Client annotation `365:2039` and `365:2041` both explicit.
- **Don't apply sci-fi or cyberpunk styling** — no aggressive neon, no animated scanlines, no chromatic aberration. Subtle cyan glow only.
- **Don't apply `box-shadow`, `text-shadow`, or `filter: drop-shadow`** anywhere. Depth = surface tier + border tint + restricted inset glow only.
- **Don't apply gradient text** (`bg-clip-text text-transparent`). The Watch360 winery aesthetic is the explicit anti-direction.
- **Don't use serif, antiqua, brush, or display fonts** anywhere except the logo wordmark (Montserrat). One sans throughout the rest.
- **Don't use brand colors on social icons.** Monochrome only.
- **Don't render hover scale/translate effects.** Border tint shift only.
- **Don't add CTAs ("Create dashboard / Create report") inside list cards.** Those belong on the detail page hero, one each, primary + ghost.
- **Don't make chips pill-shaped (`rounded-full`).** 4px radius only.

## Motion

Motion is **subtle**. The interface should feel still, with hovers reading as "the page noticed you" rather than "the page is performing for you".

- **Motion Level:** subtle.
- **Durations:** 150ms (color, opacity, border), 200ms (max — for chip popovers and modal entries when added).
- **Easings:** `ease-out` for hovers; `linear` for indeterminate progress only.
- **Hover patterns:** border color shift, text color shift, opacity shift, subtle inset glow on primary CTA. **No** transform, **no** scale, **no** translate, **no** outer drop-shadow.
- **First-paint:** no staggered grid intro, no animated KPI counters. If data is loaded, render it.
- **Focus ring:** 2px outline `border-focus` offset 2px + outer `glow-primary` blur 12px. Visible only on keyboard focus (use `:focus-visible`).
- **Selected-card glow:** static inset bottom-bloom (no pulse). Pulse animation reads as "fintech alert" — not the mood.

## Reference

### Figma source-of-truth nodes

All `https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design?node-id=<id>` (replace `:` with `-` in id).

| Node ID | What it defines | Used for |
|---|---|---|
| `100:400` | Card primitive — Default state | Card bg `#111539`, border `rgba(255,255,255,0.20)`, radius 12px, padding 24px, in-card icon @40% opacity, label 14px @70% opacity |
| `222:5989` | Card frame (parent of all 7 variants) | Full state matrix: Disable / Default / Hover / Active / Active Hover / Selected / Selected Hover |
| `222:6020` | Card — Selected | Cyan border + inset bottom-bloom + 8px top-right cyan dot |
| `222:6010` | Card — Hover | Border opacity step from 20% → 30% |
| `89:4855` | Main Menu desktop (floating glass-pill) | Market360 marketing nav pattern. Glass treatment values: `backdrop-blur 15px`, `bg rgba(7,11,42,0.75)`, `border rgba(255,255,255,0.10)`, `rounded 12px`. **We adopt the glass treatment for the product top nav but keep the live sticky-bar shape, NOT the pill.** |
| `89:4858` | MARKET 360 wordmark | Montserrat ExtraBold (800), 17px, tracking +0.13em. Carveout adopted for `PHARMA 360` logo wordmark. |
| `89:5021` | Tabler Icons frame | ~70 mapped icons. Canonical icon system. |
| `119:4015` | Industry Colors swatch board | Vertical→color map. **Pharma = `#46CAFF`** (primary). Medical `#46FFFC`, Tractors `#46FFC4`, Beauty `#9C46FF`, etc. |
| `365:3461` | Pharma-360 marketing page | Layout reference for marketing-side Pharma 360 chrome (NOT for product UI). |
| `365:4877` | Main Menu inside Pharma-360 page | Sticky-bar form (1440×96), used on marketing landing — reference for visual treatment of a sticky bar, not for product nav items. |

### Client annotation `365:2039` (DOL List) — verbatim

> This reference is not about the layout or functionality itself. It is primarily a visual language reference.
>
> Please keep the existing DOL List structure, information architecture, filters, and card hierarchy. Do not redesign the UX or introduce new features.
>
> **What we like in this reference:**
> - Dark enterprise SaaS aesthetic
> - Surface hierarchy and depth
> - Card styling and spacing
> - Typography scale and contrast
> - Subtle glow and elevation
> - Clean KPI presentation
> - Modern premium feel
>
> **What we do not want:**
> - Fintech-style widgets
> - Additional dashboards or charts
> - Sidebar navigation
> - Excessive visual complexity
> - Large rounded corners
> - Sci-fi or cyberpunk styling
>
> **The goal is simple:** Keep the current Pharma DOL List structure, but make it feel like it was designed using the Market360 design language and visual system.

### Client annotation `365:2041` (DOL Detail) — verbatim

> This reference is primarily a visual system reference, not a layout reference.
>
> **What we want to borrow:**
> - Dark enterprise analytics aesthetic
> - Card-based composition
> - Surface hierarchy and depth
> - Clean KPI presentation
> - Strong spacing and alignment
> - Consistent card radii
> - Subtle glow and elevation
> - Data-first visual hierarchy
> - Modern SaaS dashboard feel
>
> **What we do NOT want to borrow:**
> - Purple neon palette
> - Fintech-specific widgets
> - Additional charts or dashboard modules
> - New navigation patterns
> - Complex visual effects
> - Changes to information architecture
>
> **For Market360 Pharma, replace the purple/cyan palette with the existing Market360 color system (navy, cyan, teal, green).**
>
> **Keep the current DOL List and DOL Detail structure intact.**
>
> **The objective is to make the existing Pharma experience feel like a native part of the Market360 ecosystem while preserving all current functionality, content hierarchy, and workflows.**

### Frozen UX inventory (preserve exactly)

- **Top nav items:** PHARMA MEDIA · DOLs · REPORTS · user avatar (right). Same labels, same order.
- **DOL List filter inventory:** Audience Size · Country · City · Group · Type · Name · Gender · Channel. Same names, same order. (Live portal renders them as a left sidebar; this system renders them as an inline chip row — same items, different presentation.)
- **DOL List sort + count:** "234 influencers" count, "Sort by: Influencer Name" affordance.
- **DOL Card composition:** avatar + display name + social platform chips + tier/specialty/type/group chips + bio + 5-tile KPI strip (Followers · Posts · Aud. Comments · Commenters · ER).
- **DOL Detail composition:** hero (photo + chips + bio) + Audience & Eng Rate panel + social-channel strip with date range + 5-tile KPI agg-stats row + Brands / Diseases / Medicaments / Hashtags / Posts Key Topics blocks + Avg Views/Likes/Comments Per Post + Top Commenters + Comments Insights + Commenters Interest Profile Description + CREATE DASHBOARD / CREATE REPORT CTAs + footer.
- **Pagination + search behavior:** unchanged.

### External references (study only — do NOT copy)

| Path | What it shows | Take | Do NOT take |
|---|---|---|---|
| `Screenshots/01.png` | Live Pharma 360 DOL List portal | Card composition inventory, filter inventory, sort behavior, count "234 influencers" | Beige/tan chip fills, gold-ring disease circles, light-on-light surfaces, multi-color brand icons |
| `Screenshots/02.png` | Live Pharma 360 DOL Detail portal | Section inventory + order, KPI strip composition, Brands/Diseases/Medicaments block patterns, CTA footer pattern | Same anti-list as 01 |
| `Screenshots/03.png` | Market360 marketing "Where product signals come from" | Selected-tile glow pattern (cyan + magenta highlights with inset bottom-bloom), grid composition rhythm, KPI density of the right-rail explainer | Marketing-only gradient bordered explainer card; magenta as a routine palette member |
| `Screenshots/04.png` | Market360 marketing "AI Copilot" | Dark gradient-border card pattern for hero modules, button position above the fold | Marketing CTAs ("Explore Copilot"); purple CTA button as a primary product pattern |
| `Screenshots/05.webp` | External dashboard inspiration (Dribbble) | Information density, sidebar+main split rhythm (for studying density only — we don't use sidebar nav), KPI plate composition | Anything verbatim — colors, type, illustrations, animated globe, chart styles. Study only. |
| `Screenshots/06.webp` | External dashboard inspiration (Dribbble) | KPI tile rhythm with subtitled metrics, heatmap composition density, dotted world map as a low-noise data viz pattern | Anything verbatim — sales-report glow palette, gradient orb, heavy-weight numerals, decorative 3D orb |

### Current implementation status

- **v1 polishing pass (sterile dark)** committed in `74ff67b` and `d3b8eda` is now **superseded** by this rev 3 spec. The v1 implementation in `app/dols/page.tsx`, `app/dols/[id]/page.tsx`, and components under `components/` will need re-polishing against this Market360-mirror system.
- **Visual baseline of v1 (for diff comparison):** `Screenshots/v1-sterile-dark/`.
- **Logo asset:** `public/pharma-360-logo.svg` (Pharma 360 mark + Montserrat ExtraBold wordmark, pre-built single SVG).

### Companion brief

- **`AI-BRIEF-dols-list.md`** — paste-ready single-file brief for AI design tools (Figma Make → Lovable → v0 → Claude Design → Stitch). Embeds a copy of this DESIGN-SYSTEM.md + the DOLs list per-screen task brief.
- **Original client brief and constraints:** `BRIEF.md` (rev 2-era client voice transcript).
- **Direction note:** `DESIGN.md` (rev 3 at top, rev 2 sterile-dark history preserved below).

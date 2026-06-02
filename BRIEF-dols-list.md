# BRIEF — DOLs list page polishing pass

> **Self-contained handoff brief.** Designed to be fed to a single AI design tool (Lovable / Figma Make / Stitch / Claude Design / v0) along with `DESIGN-SYSTEM.md` and the screenshots under `Screenshots/`. The tool should not need any other repo context.

---

## 1. What we're building

A polished version of the **DOLs list page** for `sf-pharma-360` — the new product UI of Market 360's Pharma vertical. The screen shows a directory of digital opinion leaders (KOLs / DOLs / pharma influencers) that the customer's analysts browse to build watchlists and reports.

**Live production version (the thing being replaced):** [https://pharma.market360.ai/influencers](https://pharma.market360.ai/influencers).

**Our current polished v1:** see `Screenshots/v1-sterile-dark/02-dols-list.png` in this repo. The polishing pass that produced it is committed as `74ff67b`. The v1 hits the brief's intent but still has rough spots: chip alignment off the 12-col rail in spots, KPI strip on cards reads dense, sort dropdown wants more breathing room, filter chips lack a visible "active" state on rest.

This brief asks for **the next polishing iteration on top of v1** — same direction (Sterile Enterprise, Dark), tighter execution.

## 2. Scope of this iteration

ONE screen. The DOLs list page at `/dols`. Specifically:

1. **Top nav** (`SiteHeader`) — Market 360 Pharma logo + "Pharma Media / DOLs / Reports" nav + search/bell icons + user avatar.
2. **Page header** — h1 "DOLs" + count "234 tracked" + "Sort by: Influencer Name" cluster on the right.
3. **Filter chips row** — leading "Filters" button + 7 filter chips (Audience size, Country, City, Group, Type, Gender, Channel). Each chip opens a popover (popover content NOT in scope for this iteration — only the chip-on-rest and chip-on-hover states matter).
4. **Card grid** — 2 columns at desktop, 1 column on mobile, 16px gap. Renders an array of `Dol` records (typed below).
5. **Pagination** — centered footer, 7 page buttons + chevrons.

**Out of scope this iteration:** DOL detail page (`/dols/[id]`), home (`/`), the popover bodies for filter chips, any signup/auth/onboarding screens.

## 3. Hard constraints (anti-list)

Pulled from the client's voice transcript and codified in `DESIGN-SYSTEM.md`. **Violating any of these = polishing pass fails.**

1. **One sans-serif throughout** — Geist Sans (or Inter fallback). No serif, no antiqua, no display, no Watch360 winery typography. The original portal has a beige/tan tier-badge from a Watch360 copy-paste — that aesthetic is the explicit anti-direction.
2. **Monochrome social icons.** No Facebook blue, no Instagram gradient, no X black-on-pill. Use Tabler `IconBrand{X}` family in `text-muted` (rest) / `text-primary` (active). The active channel is the one in `dol.primary`.
3. **No decorative placeholders on sparse data.** If a value is null or count ≤ 1, render an em-dash (`—`) on numeric tiles or an italic one-line `EmptyLine` (`"No biography on file"`) on text fields. **NEVER render a placeholder circle with "1" inside.**
4. **No shadows. No glass. No backdrop blur on cards.** Depth only via surface tier (`background` → `surface` → `surface-elevated`) and border tint (`border` → `border-strong`). The sticky top nav is the ONE place backdrop-blur is allowed.
5. **No gradient text, no gradient backgrounds in the product UI.** Gradients live on the marketing site only.
6. **No hover scale, translate, or glow effects.** Hover changes border color (`border` → `border-strong`) and/or text color (`text-muted` → `text-primary`) only.
7. **No left sidebar of accordion filters.** That's how the live portal does it; we explicitly flattened it to a chip row above the grid.
8. **No brand colors on chips.** Use `cat-1` through `cat-4` per the chip recipe in `DESIGN-SYSTEM.md`. The original tan "Bariatric Surgeon" pill is the anti-example.
9. **All numbers use tabular numerals.** Thin-space thousands separator (`140 600`, never `140,600`).
10. **All spacing values snap to multiples of 4px.** No 5, no 7, no 11.
11. **At most one accent color (`primary`, violet `#7c7cf5`)** per visible state. Don't tint the search icon AND the active nav dot AND the sort chevron all in primary — pick one.
12. **One sans, three weights only:** 400, 500, 600.
13. **No icon migration.** We use `@tabler/icons-react`. Don't swap to Lucide / Phosphor / Heroicons.

## 4. Data shape (TypeScript types)

The cards render an array of `Dol` records. Type definitions (verbatim from `data/dols.ts`):

```ts
type SocialChannel =
  | "facebook" | "instagram" | "x" | "linkedin" | "youtube" | "tiktok" | "threads";

type AudienceTier = "Mega" | "Macro" | "Mid Tier" | "Micro" | "Nano";

type DolKind =
  | "Bariatric Surgeon" | "Endocrinologist" | "Cardiologist" | "Clinical Dietitian"
  | "Family Physician" | "Diabetes Dietitian" | "Health & Nutrition Coach"
  | "Physician DOL" | "NHS Doctor" | "Medical Association" | "Obesity Physician";

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
  photo?: string; // optional, render avatar circle with initials if missing
  tier: AudienceTier;
  kind: DolKind;
  audienceType: "Mixed" | "Public" | "Specialist";
  group: "A" | "B" | "C";
  country: string;
  city: string;
  gender: "Male" | "Female" | "Other";
  bio: string; // may be empty string
  channels: SocialChannel[];
  primary: SocialChannel;
  signal: DolSignal;
}
```

## 5. Three card states to handle (mandatory test cases)

The polishing pass must explicitly render all three states convincingly — this is the original brief pain. The client opened the live portal and pointed at a Lucca Di Marchin card with "1, 1, 1, 1" rendered as decorative circles. That's the failure mode we're fixing.

1. **Rich** — `signal.followers = 412 000, posts = 1247, audienceComments = 89, commenters = 234, engagementRate = 0.034`. All KPI tiles dense with numbers, bio 2 lines, 4 chips, 6 social icons.
2. **Sparse** — `signal.followers = 11 600, posts = 8, audienceComments = 1, commenters = 1, engagementRate = 0.0283`. KPI tiles show real but small numbers, bio truncates to 2 lines, 4 chips, 3 social icons. **Must NOT degrade visually — the page should look the same shape as the rich case.**
3. **Empty** — `signal.followers = null, posts = null, ...`. KPI tiles all render `—` (em-dash) flush left, bio = `EmptyLine` italic "No biography on file", 4 chips, 1 social icon (the primary). **Strip stays full-width, card height matches the others.**

## 6. Reference

- `DESIGN-SYSTEM.md` — full spec for tokens (colors, typography, spacing) AND recipes (per-component composition rules). Read this in full before generating. It encodes the "interface language" — without those recipes the generation will produce a token-consistent but visually generic UI.
- `Screenshots/v1-sterile-dark/02-dols-list.png` — the current v1 polished version. Your job is to polish from this baseline, NOT from the live portal screenshot.
- `Screenshots/01-influencers-list-fullpage.jpg` — the live `pharma.market360.ai/influencers` screenshot. This is the **anti-reference** — every Watch360 artifact you see (beige tier badges, tan chip "Bariatric Surgeon", colored social icons, sidebar accordion filters, the Engagement Rate column header in title case) is something we removed.
- `BRIEF.md` — the original client voice transcript and decision log (Russian). Provides the "why" behind every anti-asks listed here.

## 7. Deliverable shape

A single React component (or set, your call) implementing the DOLs list page. Whatever the AI tool's native output format is — Figma frame, JSX file, Lovable project — the output must:

1. Use only tokens defined in `DESIGN-SYSTEM.md` YAML front-matter. No hex values inline.
2. Match the component recipes in `DESIGN-SYSTEM.md > Components` section. For every primitive (Card, Chip, KPI Mini-Tile, Top Nav, Filter Chip, Avatar, Pagination Button) the output should follow the recipe verbatim — same paddings, same radii, same typography combos.
3. Render 8 cards in the grid mock — 3 rich, 3 sparse, 2 empty. This stress-tests the sparse/empty behavior alongside the rich cards.
4. Be responsive: 2 columns at ≥1024px, 1 column below.
5. Use Tabler icons (or render equivalent Tabler-style strokes inside Figma if generating a Figma file).

## 8. What "polished" looks like (acceptance)

The output is acceptable when:

- A person can't tell at a glance whether the cards are rich or sparse — the chrome is consistent, only the numbers / chip count vary.
- A skim from top-left to bottom-right shows the eye landing on: page title → leftmost card's name → its primary social icon → its first KPI number, in that order. Visual hierarchy isn't fighting itself.
- Chip row, page title, and the leftmost edge of every card sit on the same x-coordinate (12-col rail enforced).
- No element feels like it survived from Watch360.
- Hovering on a card produces a single, sub-perceptible border tint change. Nothing else moves.

## 9. Out-of-scope explicit list

So the AI tool doesn't waste tokens on these:

- DOL detail page (`/dols/[id]`).
- Light theme. We're dark-default for v1.
- Filter popover bodies (only the chip-on-rest and chip-on-hover are needed).
- Authentication, signup, paywall.
- Empty-grid state ("no DOLs matched") — that's a separate brief later.
- Animations on first paint (no staggered intro, no number counters).
- Internationalisation. Copy is English-only this pass.
- Tablet-specific breakpoint between mobile and desktop — go straight from 1-col to 2-col at `lg`.

---

## Handoff checklist (for the operator running the AI tool)

- [ ] Paste `DESIGN-SYSTEM.md` into the tool first, as the system context / design context.
- [ ] Paste this `BRIEF-dols-list.md` second, as the task.
- [ ] Attach `Screenshots/v1-sterile-dark/02-dols-list.png` as the visual baseline.
- [ ] If the tool supports image references, also attach `Screenshots/01-influencers-list-fullpage.jpg` and label it "**ANTI-REFERENCE** — do not reproduce".
- [ ] Generate.
- [ ] Compare the output side-by-side with v1 — does it cleanly read as a v1+1 iteration, or is it a different direction? If different, reject and retry with a sharper prompt.
- [ ] Port acceptable result back into the Next.js prototype.

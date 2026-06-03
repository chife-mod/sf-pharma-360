# DESIGN-SYSTEM.md — Pharma 360 active design system

> **Active spec** for the live dev surface at `/dols` (the new v1 main).
> This file replaces the old `DESIGN-SYSTEM-V2.md` (promoted to
> canonical on 2026-06-03) and the older `DESIGN-SYSTEM.md`
> Market360-mirror (archived as
> [`DESIGN-SYSTEM-2026-06-02-market360-mirror.md`](DESIGN-SYSTEM-2026-06-02-market360-mirror.md)).
>
> One file. The active rules live below. Frozen concept snapshots
> (`/concepts/v2/dols`, `/concepts/v3/dols`) preserve their original
> styles for comparison; they are not driven by this spec.
>
> **Source materials (origin trail):**
> - Premium Dark "Pharma OS" source bundle:
>   `https://api.anthropic.com/v1/design/h/herogYaNV7iCmT1YmVBiyw?open_file=Market360+DOLs+-+Dark.html`
> - Figma right-cluster reference:
>   `https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design?node-id=370-6560`
> - The historic Market360-mirror system lives in the archive file
>   (link above) — read only if you need to know how we got here.

---

## Market360 Pharma — Dashboard Design System

**Direction:** Premium dark "Pharma OS" — глубокий midnight navy/violet
фон с яркими неоновыми акцентами (teal, magenta, orange, violet).
Glassmorphism, aurora-свечения, futuristic but trustworthy.
Forward-looking design that should feel relevant for the next 3–5 years.

---

### 1. Brand Voice & Mood

- **Premium, confident, intelligence-grade.** Это не просто дашборд —
  это "operating system" для фарма-маркетинга.
- **Dark-first.** Светлая тема не нужна — продукт живёт в тёмной среде,
  как Linear, Arc, Vercel, Raycast.
- **Aurora energy.** Намёк на северное сияние: глубокая ночь +
  холодные неоновые градиенты.
- **Tactile glass.** Полупрозрачные карточки с blur, тонкие белые
  границы (5–10% opacity).
- **Никакого** скевоморфизма, никаких "корпоративных" иконок-эмодзи.

---

### 2. Color System (OKLCH)

Все цвета определяются в `src/styles.css` через CSS custom properties.
**Никаких хардкод-цветов** в компонентах — только семантические токены
(`bg-background`, `text-teal`, `border-magenta/30` и т.д.).

#### 2.1 Base surfaces

| Token | OKLCH | Назначение |
|---|---|---|
| `--background` | `oklch(0.16 0.04 270)` | Главный фон страницы — deep midnight navy с лёгким violet shift |
| `--surface` | `oklch(0.20 0.05 270)` | Карточки, фильтр-панели |
| `--surface-elevated` | `oklch(0.24 0.06 275)` | Поднятые поверхности (аватары, бэйджи) |
| `--foreground` | `oklch(0.97 0.01 270)` | Основной текст |
| `--muted-foreground` | `oklch(0.65 0.02 270)` | Вторичный текст, лейблы |
| `--border` | `oklch(1 0 0 / 0.06)` | Тонкие разделители (белый @ 6%) |

#### 2.2 Accent palette

| Token | OKLCH | HEX ≈ | Где используется |
|---|---|---|---|
| `--teal` | `oklch(0.72 0.18 195)` | `#3fd9d6` | Primary action, "Mid Tier", активные состояния, signal-метки |
| `--magenta` | `oklch(0.66 0.27 340)` | `#ef3d8a` | Уведомления, AI-suggest, "горячие" метрики |
| `--orange` | `oklch(0.76 0.18 55)` | `#f5a142` | Specialty, тёплые акценты, warnings |
| `--violet` | `oklch(0.62 0.22 295)` | `#8b5cf6` | Tertiary действия, Type-теги, gradient endpoints |

**Правило акцентов:** на одном экране максимум 4 цвета (teal /
magenta / orange / violet). Каждая influencer-карточка получает один
доминирующий accent (`accent: "teal" | "magenta" | "orange" |
"violet"`) — он окрашивает аватар-glow, активную channel-метку и
ER-метрику.

#### 2.3 Gradients

```css
--gradient-primary: linear-gradient(135deg, var(--teal), var(--violet));
--gradient-accent:  linear-gradient(135deg, var(--magenta), var(--orange));
--gradient-aurora:
  radial-gradient(at 20% 0%,  oklch(0.72 0.18 195 / 0.18), transparent 50%),
  radial-gradient(at 80% 10%, oklch(0.66 0.27 340 / 0.18), transparent 50%),
  radial-gradient(at 50% 100%, oklch(0.62 0.22 295 / 0.15), transparent 50%);
```

- `--gradient-primary` — главный CTA, лого, активная страница пагинации.
- `--gradient-accent` — AI-блоки, "Top Voice", промо-зоны.
- `--gradient-aurora` — фоновое свечение Hero-секции и body.

#### 2.4 Glow shadows

```css
--shadow-glow-teal:    0 0 24px oklch(0.72 0.18 195 / 0.35);
--shadow-glow-magenta: 0 0 24px oklch(0.66 0.27 340 / 0.35);
--shadow-elevated:     0 30px 80px -30px oklch(0 0 0 / 0.7);
```

Применяются на hover карточек и активных пилюлях
(`shadow-[0_0_8px_currentColor]` для маленьких dot-индикаторов).

---

### 3. Typography

> Updated 2026-06-03 — floor lifted to **11px**, fractional sizes
> banned. See "Typography floor + scale" below for the binding scale.

| Роль | Font | Size / Weight | Tracking |
|---|---|---|---|
| Display (H1, KPI numbers, заголовки карточек) | **Space Grotesk** / Geist | 4xl–5xl, 700 | -0.02em |
| Body / UI | **Inter** | sm (14px), 400–500 | normal |
| Micro-labels (UPPERCASE) | Inter | **11px** (floor), 500–600 | 0.2em–0.32em |
| Mono (опционально, метрики) | JetBrains Mono | — | — |

**Hierarchy moves:**

- Заголовки используют gradient text (`bg-clip-text` от
  `--gradient-primary` / `--gradient-accent`) на ключевых словах.
- Микро-лейблы всегда UPPERCASE + wide tracking — это
  "machine-readable" эстетика.
- Числа KPI крупные, жирные, display-шрифтом — это герои экрана.

---

### 4. Spacing, Radius, Elevation

> Updated 2026-06-03 — spacing scale tightened to a strict 8-px grid.
> No more 20 / 48. See "Spacing scale (strict 8-px grid)" below for
> the binding scale + rationale.

- **Spacing scale (strict 8-px grid):** **2 / 4 / 8 / 12 / 16 / 24 /
  32 / 40 / 48 / 56 / 64 …** (continues on multiples of 8). Reach for
  these first; deviate only with explicit reason. Banned values: **20,
  28, 36, 44** — anything not a multiple of 8 (12 is the one allowed
  half-step in the dense end of the scale).
- **Radius:**
  - Pills, tags, кнопки → `rounded-full` или `rounded-xl` (12px).
  - Cards → `rounded-2xl` (16px) / `rounded-3xl` (24px) для главных
    контейнеров.
  - Inputs → `rounded-xl`.
- **Borders:** всегда 1px белого с opacity 5–15% (`border-white/5` …
  `border-white/15`) — никаких сплошных серых линий.
- **Glass:**

```css
.glass       { background: oklch(1 0 0 / 0.03); backdrop-filter: blur(20px); border: 1px solid oklch(1 0 0 / 0.06); }
.glass-card  { background: oklch(1 0 0 / 0.04); backdrop-filter: blur(24px); border: 1px solid oklch(1 0 0 / 0.08); box-shadow: 0 1px 0 0 oklch(1 0 0 / 0.05) inset; }
```

---

### 5. Layout

- **Max width:** 1480px, центрированный, padding `px-6`.
- **Grid:** 12-колоночный. Sidebar (Filters) — 3 колонки, основной
  контент — 9. На < lg стек.
- **Sticky:** top-nav и sidebar Filters (`sticky top-24`).
- **Hero-секция:** одна большая стеклянная карточка с aurora-свечениями
  (absolute blur-3xl круги в углах) + 4 KPI справа в сетке 2×2 / 4×1.

---

### 6. Component Patterns

#### 6.1 TopNav

- Sticky, `backdrop-blur-xl`, `bg-background/60`.
- Лого: gradient orb (teal → violet → magenta) с blur-glow позади.
- Навигация — pill-кнопки, активная имеет `ring-1 ring-white/10` +
  teal dot.
- Профиль справа в pill-контейнере с avatar-gradient.

#### 6.2 InfluencerCard (главный объект)

- `glass-card`, `rounded-3xl`, padding `p-6`.
- Фоновый glow (`-top-20 -right-20`, `blur-3xl`) в accent-цвете
  карточки.
- Hover: `translate-y-[-2px]` + `shadow-elevated`.
- **Структура:**
  - Header: аватар с gradient-ring + ряд channel-иконок + меню.
  - Identity: имя (display, bold) + теги (tier / specialty / type /
    group).
  - Bio: 2 строки, `text-muted-foreground`.
  - Channel tabs: активный получает accent-цвет underline
    `shadow-[0_0_8px_currentColor]`.
  - Stats strip: вложенная карточка с 5 метриками (Followers / Posts /
    Comments / Commenters / ER), ER подсвечен accent-цветом.

#### 6.3 Tags

4 варианта: `primary` (gradient teal→violet), `accent-teal`,
`accent-violet`, `accent-orange`. Все — pill, UPPERCASE,
`tracking-wider`, border + soft bg.

#### 6.4 Filters sidebar

- Glass-card.
- Каждый фильтр — кнопка с цветной dot-индикатор (циклится по 4
  акцентам), counter справа, chevron поворачивается на hover.
- Bottom: AI Suggest карточка с magenta→violet градиентом,
  sparkle-иконкой и CTA "Generate list".

#### 6.5 Toolbar

Glass-полоса с фильтр-чипом (счётчик активных), inline-сводкой
("234 influencers · Saudi Arabia · …" с цветными словами), поиском,
сортировкой и gradient CTA "Export".

#### 6.6 Pagination

Numbers в `rounded-lg` 32×32, активная — gradient teal→violet с
teal-glow shadow.

---

### 7. Iconography

- **lucide-react** только. Размер по умолчанию `h-4 w-4` (16px), микро —
  `h-3 w-3`.
- Channel-иконки: Facebook, Instagram, Twitter (=X), Linkedin, Youtube,
  Activity (=TikTok placeholder), MessageSquare (=Threads).
- Иконки никогда не цветные сами по себе — наследуют `text-*` от
  родителя.

---

### 8. Motion (guidelines)

- Transition default: `transition-all duration-200 ease-out`.
- **Hover lifts:** карточки поднимаются на 2px, fade-in shadow.
- **Glow pulses:** активные dot-индикаторы статичны, но имеют
  `shadow-[0_0_8px_currentColor]` — псевдо-свечение.
- **Chevrons:** `group-hover:rotate-180` для аккордеонов.
- Для будущих расширений — Motion for React (framer-motion) на
  stagger-появление карточек и aurora-parallax в Hero.

---

### 9. Accessibility

- **Контраст:** основной текст ≥ 12:1, muted ≥ 4.5:1 (на `--background`).
- **Focus ring:** `focus-visible:ring-1 focus-visible:ring-teal/60`.
- Все интерактивные элементы — минимум 32×32px hit-area.
- Channel/иконочные кнопки получают `aria-label`.

---

### 10. Do / Don't

✅ **Do**

- Один accent-цвет — одна сущность (карточка / KPI).
- Использовать gradient text на 1–2 словах в заголовке, не больше.
- Aurora-blobs только в Hero и больших секциях, не в каждой карточке.
- Всё через семантические токены `src/styles.css`.

❌ **Don't**

- **Не использовать чистый `#000` или `#fff`** — только OKLCH-токены.
- **Не смешивать > 2 accent-цветов** в одном маленьком компоненте.
- **Не добавлять border-radius < 8px** (кроме dot-индикаторов).
- **Не использовать тяжёлые drop-shadow без blur** — только мягкие,
  "atmospheric".
- **Никаких light-mode переменных** — продукт dark-only.

---

### 11. Future-proofing

Дизайн рассчитан на 3–5 лет:

- **OKLCH вместо HSL/HEX** → готов к wide-gamut дисплеям (P3, Rec.2020).
- **Glassmorphism + aurora** — актуальная "Apple Vision / Arc / Linear"
  эстетика.
- **Token-first архитектура** → ребрендинг = смена 6 переменных.
- Готовность к motion-слою (Motion for React) и 3D-акцентам (Spline /
  R3F orbs в Hero).

---

## Implementation notes (Claude — 2026-06-02)

- **v2 route:** `/concepts/v2/dols`. Foundation + header first; cards,
  filters, KPI strip, etc. — incremental, as user iterates.
- **Token scope:** all OKLCH tokens scoped to `.v2-root` class so they
  don't collide with v1 tokens. v2 root wraps `/concepts/v2/*` pages.
- **Right-side header controls:** instead of mirroring the v2 source
  header right-cluster verbatim, mirror **Figma node `370:6560`**
  (user-directed deviation — they prefer that variant).
- **Font loading:** Space Grotesk + Inter via `next/font/google`,
  exposed as `--font-space-grotesk` / `--font-inter`.
- **Service-menu pill:** add entry `{ id: "v2-pharma-os", label: "v2 —
  Pharma OS", desc: "Premium dark Pharma OS, OKLCH + glass +
  aurora", path: "/concepts/v2/dols" }`.
- **Landing tile:** add a "v2 Pharma OS" tile that links to the v2 route.

---

## Evolution log — new v1 active dev (2026-06-02)

After rotation (v2 → v3 snapshot, v1 — Sterile Dark → v2 snapshot, new
v1 = active Pharma OS clone at `/dols`), the live v1 spec evolves here.
Snapshots at `/concepts/v2/dols` and `/concepts/v3/dols` are frozen.

### Layout

- **Container max-width:** `1650px` (bumped from 1440 — premium analytics
  norm matching Stripe / Amplitude). Outer padding `24px`.
- **12-col CSS grid** binds content: `.layout` is the grid container,
  filter sidebar = `col-span-3`, dashboard main = `col-span-9`. Inside
  main, cards use a nested `repeat(2, 1fr)` grid.
- **Gap:** `16px` everywhere (between grid columns, between cards,
  between KPI tiles, between landing tiles, in grid overlay).
- **Inner tile padding:** `16px`.
- **Outer rail symmetric** — header pills, KPI hero, toolbar,
  sidebar, main content all align to the same content rail (24 from
  viewport edge to 1650 max).

### Colors

- **Bg:** `#0C0E25` (less blueish, more navy-violet lift than original
  Pharma OS `#080C18`).
- **Muted icon / nav rest:** `#949EB8` (light blue-grey, not white).
  Used for icon-button rest, inactive nav items.
- **Active text / icon-on-hover:** white.
- **Hover bg on dark glass:** `rgba(255, 255, 255, 0.20)` (was 5% —
  too subtle on most monitors). Used on icon-buttons, nav items.
- **Divider on dark glass:** `rgba(255, 255, 255, 0.20)` — same as
  hover bg, subtle but visible.

### Icons — library first, inline only with reason (project-wide rule, 2026-06-03)

**Default = `@tabler/icons-react`** via the `Icons` / `Social` re-exports
in `components/v2/icons.tsx`. Reach for the library before hand-rolling
an `<svg>`.

**Why a library over inline SVG:**

| Concern | Inline SVG | `@tabler/icons-react` |
|---|---|---|
| Sweep all sizes | 40 hand-edits | `size={20}` prop, one keystroke |
| Sweep stroke-width | hand-edit every path | one `stroke={1.6}` prop |
| Bundle size | full markup inlined | tree-shaken, pay only what you import |
| Visual consistency | each author drifts | single optical grid (Pavel Kuna) |
| IDE discovery | "where's that bell SVG" | `Icon<Tab>` autocomplete |
| A11y defaults | author has to remember | shipped |
| Updates | none | `pnpm up` brings new glyphs |

**Inline SVG allowed only for:**
1. **Brand marks** not in any library — e.g. the Pharma 360
   multi-circle logo in `PharmaMark` (site-header-v2.tsx).
2. **One-off illustrations** — empty-state graphics, marketing
   hero artwork.
3. **Animated SVG** — when the design needs `<animate>` morphs or
   stroke-dash drawing.
4. **Data viz primitives** — `Sparkline` (its `<path>` is generated
   from data, not iconographic).

**Porting source bundles** that ship inline SVGs: rewrite to Tabler
before declaring the port done. Don't leave the inline tail.

### Icon-button standard

Single icon convention across the product:
- **Button:** `40×40` (size-10) — same height as 40-px avatar / photo
- **Icon glyph:** `20×20` Tabler (`size={20}` on `@tabler/icons-react`)
- **Breathing ring:** 10px around glyph
- **Centering:** `inline-flex items-center justify-center` (not
  `grid place-items-center` — SVG default inline-block didn't always
  center horizontally in CSS Grid; flex is robust)
- **Hover:** `bg-white/20` (visible) + `text-white`
- **Notification dot:** `absolute right-[3px] top-[3px] size-1.5`
  (6px dot, 3px gap from button top-right corner) with `outline: 1.5px
  solid bg-color` for "pop out" effect

Applied to: top-nav search/bell/settings, card menu-btn (top-right
dots), card channel tabs (`.ch-tab`).

### Typography (header right pill)

- **Name (Rana El-Khoury):** Inter Regular `14px`, font-weight 600,
  `leading-none`
- **Role (STRATEGY LEAD):** Inter Medium `10px`, UPPERCASE,
  `tracking-[0.08em]`, `leading-none`, color `white/45`
- **Gap name ↔ role:** `4px` (gap-1)

### Typography floor + scale (project-wide rule, 2026-06-03)

**Minimum font-size = 11px.** Anything smaller is forbidden, including
eyebrow labels, axis ticks, and badge counters. Matches Material 3
`labelSmall`, Apple HIG `caption2`, Atlassian DS "UI Text smallest".

Round-number sizes only — no half-pixel values:

| Role | px |
|---|---|
| KPI numbers / metric values | 21 |
| Card name / display heading | 22 |
| Body input / sort value / bio | 14 |
| Card handle / body small | 13 |
| Nav uppercase / count badge / opt-label | 12 |
| **Floor**: uppercase labels, filter chips, badge | **11** |
| ⛔ forbidden | < 11 |

Refactored 2026-06-03 from a fractional scale (9.5 / 10.5 / 11.5 /
12.5 / 13.5) inherited from the Pharma OS source bundle. Active /dols
surface is clean; concept snapshots (`/concepts/v2/dols`,
`/concepts/v3/dols`) preserve their original sizes by design.

### Accessibility — WCAG 2.1 AA contrast (project-wide, 2026-06-03)

**Every text surface must hit AA 4.5:1** (normal text) or 3:1 (large
text ≥18.66px bold / ≥24px). Audited live on /dols on 2026-06-03;
seven surfaces failed and were fixed by lifting two color tokens.

Token shifts (active dev `/dols` only — snapshots frozen):

| Token | Before | After | Ratio on `--v2-bg` (#0C0E25) |
|---|---|---|---|
| `--v2-text-mute` | `#5E6A87` | **`#8993AD`** | 3.5 → **5.5** AA ✓ |
| `--v2-text-faint` | `#45506C` | **`#7C869D`** | 2.4 → **4.6** AA ✓ |
| Header role label | `text-white/45` | **`text-white/55`** | 4.48 → **6.26** AAA ✓ |
| Header divider | `bg-white/20` | **`bg-white/[0.28]`** | (decorative, keeps ~2:1 vs role) |

Affected surfaces (all now AA or better):
- Card handle (@dr.alqahtani · Riyadh, Saudi Arabia) → 6.19
- Tag-kv key ("Type", "Group") → 5.88
- Metric label (FOLLOWERS, POSTS, COMMENTS, COMMENTERS, ENGAGEMENT) → 6.19
- Filter section h3 (FILTERS) → 6.19
- Filter opt-tally (234 / 0 / etc) → 5.21
- Toolbar count-label (INFLUENCERS) → 6.19
- Sort label (SORT) → 5.88
- Header role (STRATEGY LEAD) → 6.26

### Live contrast audit snippet (paste into browser console)

```js
// WCAG 2.1 contrast — surveys key surfaces on /dols.
// Walk bg stack, composite alpha, compute relative luminance.
const channelL = c => { c = c/255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
const lum = (r,g,b) => 0.2126*channelL(r) + 0.7152*channelL(g) + 0.0722*channelL(b);
const parseColor = s => { const m = s.match(/rgba?\(([^)]+)\)/); if(!m) return null; const p = m[1].split(',').map(x=>parseFloat(x.trim())); return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}; };
// ...full helper in app code (see WCAG audit in git history)
```

When adding a new surface, run the audit. Anything < 4.5:1 (or 3:1
for large) is a bug, not a style preference.

### Spacing scale (strict 8-px grid)

`2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 56 / 64 …` (continues on
multiples of 8). Reach for these first; deviate only with explicit
reason. **Banned:** 20, 28, 36, 44 — anything off the 8-px grid.
**Exception:** 12 is the one allowed half-step in the dense end of
the scale (between 8 and 16).

### Header right pill — anatomy (current)

```
[pl-3=12] [icons cluster gap-1=4] [ml-3=12 → divider h-10 w-px white/20 →
ml-6=24] [name block ml-6 + photo ml-4=16] [pr-3=12]
```

Symmetric paddings around icons (12 on all 4 sides). Divider matches
photo height (40) and role label color brightness (white/20 — half
of white/45).

### Images / retina

- All avatar / photo sources at **2× display size minimum**, ideally
  4× for hi-DPI safety.
- Pravatar `?w=240` for a 60-px display (card avatar).
- Unsplash `?w=160&q=85` for a 40-px display (header photo).
- `object-fit: cover` to handle aspect mismatch.

### Test content

Real DOL names sourced from `pharma.market360.ai/influencers` (live
portal, visible in `Screenshots/01.png`). Channels per profile aligned
with portal visibility. KPI values synthetic (deferred per user).

Real names in use: Aayed Alqahtani, Abdullah Al-Barrak, Abdulrahman
Al-Saigh, Adina Bachar, Akshay Jain, Alberto Langione. Plausible MENA
synthetic: Leila Karimi, Omar Benali, Sara Al-Mutairi.

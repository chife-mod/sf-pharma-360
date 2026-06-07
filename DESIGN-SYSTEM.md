# DESIGN-SYSTEM.md — Pharma 360 design system

> **The** design system for the live dev surface at `/dols`. Single
> source of truth — there is no "v2" doc; this is it. A historic
> Market360-mirror spec is archived as
> [`DESIGN-SYSTEM-2026-06-02-market360-mirror.md`](DESIGN-SYSTEM-2026-06-02-market360-mirror.md)
> (read only for history).
>
> The active rules live below. The frozen concept snapshots under
> `/concepts/` preserve their own original styles for side-by-side
> comparison; they are not driven by this spec.
>
> **Source materials (origin trail):**
> - Premium Dark "Pharma OS" source bundle:
>   `https://api.anthropic.com/v1/design/h/herogYaNV7iCmT1YmVBiyw?open_file=Market360+DOLs+-+Dark.html`
> - Figma right-cluster reference:
>   `https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design?node-id=370-6560`
> - The historic Market360-mirror system lives in the archive file
>   (link above) — read only if you need to know how we got here.

---

## ✅ CURRENT DESIGN SYSTEM — pixel-truth snapshot (2026-06-07)

> **This block is the authoritative spec.** Extracted from the live build —
> tokens in `app/dols/v2.css`, computed styles on **`/dols`** (list) and
> **`/dols/[id]`** (detail), verified by `Consistency Verification/audit.js`
> (both pages PASS). Where the older sections below (OKLCH / Space Grotesk /
> lucide "Market360-mirror") disagree with this, **this wins** — they are kept
> only as history. Foundations are CSS custom properties scoped to `.v2-root`
> (`--v2-*` raw + unprefixed aliases like `--teal`). **Components use the
> aliases or `color-mix()`, never raw hex — the ONE exception is `#fff` as the
> ground for brand-logo tiles** (logos need white to stay legible on dark).

### 1. Colour

**Surfaces** (dark, navy-violet):
| token | hex | use |
|---|---|---|
| `--bg` | `#0A0B16` | page background |
| `--panel` | `#10111B` | cards / panels |
| `--panel-2` | `#161824` | nested raised panels |
| `--panel-3` | `#0D0E17` | recessed panels |
| `--raise` | `#1A1C28` | active tab / segmented bg |
| `--inset` | `#0B0C14` | inputs / wells |

**Text:**
| token | hex | ratio on bg | use |
|---|---|---|---|
| `--text` | `#EAEEF8` | ~15:1 | primary |
| `--text-dim` | `#93A0BC` | — | secondary |
| `--text-mute` | `#8993AD` | 5.5 AA | muted labels |
| `--text-faint` | `#7C869D` | 4.6 AA | faint caps / tallies |

**Accents** — categorical; **max 4 live per screen**, one dominant accent per entity:
| token | hex | role |
|---|---|---|
| `--teal` / `--teal-bright` | `#2DD4BF` / `#34E7CE` | primary action · rising trend |
| `--cyan` | `#22D3EE` | hashtags · secondary KPI |
| `--violet` | `#A78BFA` | Type meta · posts KPI |
| `--magenta` | `#F25CB0` | notifications · comments KPI · AI |
| `--amber` | `#F5B544` | commenters KPI · "Rising" tier |
| `--orange` | `#FB923C` | specialty · "Micro" tier · warnings |
| `--rose` | `#FB7185` | **falling trend** (declining sparkline) |
| `--blue` | `#60A5FA` | "Elite" tier |
| `--green` | `#4ADE80` | Type/Group meta chips |

Tints via `color-mix(in srgb, var(--accent) N%, transparent)`. Aurora glow
tints (`--*-glow`, ~0.30 alpha) only on `.v2-app-bg` and large sections.

### 2. Lines / outlines

**Never solid grey.** 1px blue-grey at low alpha:
- `--line` `rgba(150,170,210,0.10)` — default card/divider border
- `--line-soft` `rgba(150,170,210,0.06)` — faint inner separators
- `--line-strong` `rgba(160,180,220,0.18)` — emphasis (avatar ring, hover border)

Hover border lift on cards: `rgba(150,170,210,0.22)`.

### 3. Radius

`--r-xs 6` · `--r-sm 9` · `--r-md 13` · `--r-lg 18` · `--r-xl 22` · `--r-pill 999`.
Tags/buttons → pill or sm; tiles/cards → md/lg; big containers → lg/xl.

### 4. Shadow & motion

- `--shadow-card` `0 18px 50px -22px rgba(0,0,0,.85), 0 2px 8px -2px rgba(0,0,0,.5)`
- `--shadow-pop` `0 24px 60px -18px rgba(0,0,0,.9)` (menus/popovers)
- `--ease` `cubic-bezier(0.16, 1, 0.3, 1)`; transitions 0.15s (micro) – 0.3s (sticky/slide).
- Hover: card lifts/border-brightens; **no** heavy shadows without blur.

### 5. Type — ONE typeface (Inter), 7-step scale

`--font` = Inter everywhere; `--font-num` = Inter + `tabular-nums` for figures.
Hierarchy = **size + weight + colour**, never font pairing. **No size off this
scale, no 1-px gradations, same role = same size on both pages.**

| px | role | weight | example classes |
|---|---|---|---|
| **36** | H1 / hero | 700 | `dd-name`, hero headline |
| **28** | big numbers | 700 | `kpi-val`, `dd-aud-total` |
| **22** | medium numbers · card names | **700** (numbers) / 600 (`card-name`) | `metric-val`, `dd-bv-val`, `dd-aud-engval` |
| **17** | sub-headings | 600 | `dd-section-title`, `dd-hero-audtitle`, `cmp-title` |
| **14** | **body** | 400 (text) / 600 (emph) | `dd-bio`, `dd-rank-label`, `dd-topic-label`, nav, `card-handle` |
| **12** | secondary | 400 / 500 (tabs) / 600 (`*-val`) | `dd-handle`, `dd-aud-sub`, `dd-rank-val`, `dd-bv-tab` |
| **11** | UPPERCASE caps (tracked) | 500 / 600 | `kpi-label`, `dd-section-num`, `dd-bv-cap`, `tag`, `dd-snap-hcol` |
| ⛔ <11 | forbidden | | |

Weights in use: **400 / 500 / 600 / 700**. Number values that share a size
share a weight (all 22px numbers = 700). Full 35-role table:
`Consistency Verification/REPORT.md`.

### 6. Spacing — strict 8-px grid

`2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 56 / 64 …`. **12 is the only allowed
half-step** (dense end). **Banned:** 20 / 28 / 36 / 44. Layout: content rail
`max-width 1650`, `24px` gutters, **`16px` gaps everywhere**, `16px` tile
padding. 12-col grid (filters `col-span-3`, main `col-span-9`).

### 7. Icons — `@tabler/icons-react` (library-first)

Via `Icons` / `Social` re-exports in `components/v2/icons.tsx`. Inline `<svg>`
only for: brand marks not in any lib, one-off illustrations, animated SVG, and
data-viz primitives (`Sparkline`). Icon-button standard: **40×40 button · 20×20
glyph · stroke 1.6 · 10px breathing ring · flex-centered**, hover `bg-white/20`
+ `text-white`. Icons inherit `text-*` from parent — never self-coloured
(exception: real social-network logos in `brand-logos.tsx`, which are
brand-coloured app tiles).

### 8. Component recipes (reuse — never copy-paste)

- **KPI tile** `.kpi` — `--kpi-accent` drives icon + glow; 28px value, 11px
  caps label, optional 11px delta top-right.
- **Tag** `.tag` (`tier` / `specialty` / `meta` k-v) — 11px caps, pill, soft
  bg + 1px line; tier colour from the audience-size ramp (`TIERS`).
- **Sparkline** (`Sparkline`) — area gradient + 1.5px line, **no endpoint dot**
  (removed 2026-06-07); **teal when rising, `--rose` when net-declining**;
  seeded id for SSR stability.
- **Brand logo tile** `.dd-bv-logo` — **square white tile** (`#fff`,
  `aspect-ratio:1`, `--r-md`), logo = clean SVG at uniform width + **24px inset
  all edges**, centred. Logos from MinIO `sf-ai` / official sites; brand set
  curated to those with real SVGs (Novo Nordisk, Eli Lilly, Pfizer,
  AstraZeneca, Sanofi).
- **Sticky bar** `.dd-bar` — pins at `var(--dd-stick-top)` (16px when the top
  menu is hidden-on-scroll, 88px when shown); identity reveals after the
  profile scrolls out; channel switcher redraws **all** sections below.
- **Channel switcher** `.ch-tab` — active gets accent underline; switching a
  network re-reads `detail.byChannel[channel]`.
- Reused primitives: `InfluencerCard`, `Toolbar`, `KpiHero`, `MentionsDrawer`,
  `CompareModal`, `.metric`, `.search`, `.v2-icon-btn`, `.card-menu`.

### 9. Laws (non-negotiable)

1. **One scale, role-based** — a role uses ONE size on both pages; no ±1px.
2. **No per-card/per-instance sizes or paddings** — reuse a role + the 8-px grid.
3. **Inherit via shared components + tokens, never copy-paste** layout-to-layout.
4. **Dark-only.** No light-mode tokens. No pure `#000`; `#fff` only as the
   brand-logo tile ground.
5. **AA contrast** (4.5:1) on every text surface — re-audit new surfaces.
6. Verify with `audit.js` after every visual change: `pass: true` to ship.

---

## ⏮ Rollback — surface de-blue (2026-06-03)

On 2026-06-03 the whole surface palette was darkened and de-blued (the
navy read "too blue" next to the SFG landing). **To revert everything in
one command:** `git revert 976471f` (the de-blue commit). If you'd
rather hand-restore the pre-de-blue values, here's the full table.

| Token / surface | Pre-de-blue (old) | Current (de-blued) |
|---|---|---|
| `--v2-bg` | `#0C0E25` | `#0A0B16` |
| `--v2-bg-grad-a` | `#0E1230` | `#0D0F22` |
| `--v2-bg-grad-b` | `#0D0E26` | `#0A0B16` |
| `--v2-panel` | `#0E1426` | `#10111B` |
| `--v2-panel-2` | `#111A30` | `#161824` |
| `--v2-panel-3` | `#0C1222` | `#0D0E17` |
| `--v2-raise` | `#15203A` | `#1A1C28` |
| `--v2-inset` | `#0A0F1F` | `#0B0C14` |
| `.card` gradient | `rgba(21,32,58,.65)` / `rgba(12,18,34,.85)` | `rgba(28,30,44,.65)` / `rgba(13,14,22,.85)` |
| `.filters` gradient | `rgba(17,26,48,.55)` / `rgba(12,18,34,.55)` | `rgba(22,24,36,.55)` / `rgba(13,14,22,.55)` |
| `.hero` gradient | `rgba(20,28,52,.55)` / `rgba(12,16,34,.6)` | `rgba(24,26,40,.55)` / `rgba(13,14,22,.6)` |
| `.metrics` gradient | `rgba(8,12,24,.4)` / `rgba(6,9,20,.85)` | `rgba(10,11,18,.4)` / `rgba(7,8,13,.85)` |
| `.v2-avatar-pill` bg | `rgba(17,26,48,.55/.80)` | `rgba(22,24,36,.55/.80)` |

All edits are in `app/dols/v2.css`. The aurora glow tints (teal/violet/
magenta `.v2-app-bg`) and the blue-grey line tokens (`rgba(150,170,210,…)`)
were left untouched.

---

## Market360 Pharma — Dashboard Design System

> ⚠️ **HISTORICAL (Market360-mirror, superseded).** This section described an
> earlier OKLCH / Space Grotesk / lucide direction. The shipped system is HEX
> tokens + Inter + Tabler — see "✅ CURRENT DESIGN SYSTEM" at the top. Kept for
> the origin trail only.

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

**CANONICAL SCALE — exactly 6 steps. Same role → same size, everywhere.**
(Consolidated 2026-06-07 on the DOL-detail page from a sprawl of
10/12/14/18/20/24/26/30/34. That page is now the reference implementation;
the `/dols` list (`v2.css`) should be harmonised to this scale next.)

| Step | px | Role |
|---|---|---|
| Hero | **36** | H1 / hero title — DOL name, "The Pulse of Pharma…" |
| Stat-L | **28** | Big card numbers — KPI value, total audience, brands count |
| Stat-M | **22** | Secondary numbers — per-post avg, eng value |
| Heading | **17** | Sub-headings — section titles, block headers, drawer title, back/breadcrumb |
| **Body** | **14** | Primary content — bio, names, row values, buttons, inputs, brand/topic/rank labels |
| Secondary | **12** | Supporting text — handle, sub-captions, deltas, counts, dates, "vs prev period" |
| **Floor** | **11** | UPPERCASE micro-labels — eyebrows, column/section headers, tags, KPI labels |
| ⛔ forbidden | < 11 | — |

Text rule (client-locked): **14 body · 12 secondary · 11 caps.** Numbers/headings
use 17 / 22 / 28 / 36. That's the whole scale — 7 steps, nothing else.

**Consistency law (non-negotiable):**
- **One scale, role-based.** A given role uses ONE size project-wide. **No
  1-px gradations** (never 11 *and* 12 for the same role — pick one).
- **No per-card / per-instance sizes or paddings.** Don't invent bespoke
  `font-size` / `padding` on a card. Reuse the role from the scale + the
  8-px spacing grid. If a new role is truly needed, add it to THIS table first.
- Hierarchy comes from **weight + colour**, not from ±1-2px nudges.
- **Inherit principles through shared components + styles — never by
  copy-paste.** We do NOT re-declare texts / buttons / blocks from layout to
  layout. Reuse the components (`InfluencerCard`, `Toolbar`, `KpiHero`,
  `Sparkline`, `MentionsDrawer`, …) and the shared classes/tokens (`.kpi`,
  `.tag`, `.metric`, `.search`, `.v2-icon-btn`, the type scale). A new screen
  *composes* existing pieces; it doesn't fork their styling. If two layouts
  need the same thing, it lives in one place.

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

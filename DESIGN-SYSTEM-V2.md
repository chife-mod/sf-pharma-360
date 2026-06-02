# DESIGN-SYSTEM-V2.md — Premium Dark "Pharma OS"

> **v2 concept** — based on a v2 source design. Parallel to v1
> (Market360-native mirror in `DESIGN-SYSTEM.md`). v1 and v2 coexist in
> the repo and are switchable via the service-menu pill bottom-right.
>
> **Source materials:**
> - v2 source: `https://api.anthropic.com/v1/design/h/herogYaNV7iCmT1YmVBiyw?open_file=Market360+DOLs+-+Dark.html`
> - Figma export of the v2 source (right-side header controls
>   reference): `https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design?node-id=370-6560`
> - The full v2 spec is reproduced verbatim below.

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

| Роль | Font | Size / Weight | Tracking |
|---|---|---|---|
| Display (H1, KPI numbers, заголовки карточек) | **Space Grotesk** / Geist | 4xl–5xl, 700 | -0.02em |
| Body / UI | **Inter** | sm (14px), 400–500 | normal |
| Micro-labels (UPPERCASE) | Inter | 10–11px, 600 | 0.2em–0.32em |
| Mono (опционально, метрики) | JetBrains Mono | — | — |

**Hierarchy moves:**

- Заголовки используют gradient text (`bg-clip-text` от
  `--gradient-primary` / `--gradient-accent`) на ключевых словах.
- Микро-лейблы всегда UPPERCASE + wide tracking — это
  "machine-readable" эстетика.
- Числа KPI крупные, жирные, display-шрифтом — это герои экрана.

---

### 4. Spacing, Radius, Elevation

- **Spacing scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 px
  (Tailwind 1/2/3/4/5/6/8/12).
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

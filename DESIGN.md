# DESIGN.md — sf-pharma-360 polishing

> **Revision 2 (2026-06-01).** Первая итерация была light off-white (Codex)
> — Всеволод откатил: исходник Market 360 dark (Figma
> [oR5AwDiD7ek4IxUOgyZCbU](https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design?node-id=4-19862)),
> sans throughout, никакой антиквы / serif. Палитра ниже выровнена под
> исходник; «форма» (типографика, формы карточек, anti-list) сохранена
> из синтеза Consilium.

## Concept

**Sterile Enterprise — Dark.** Vibe: спокойный рабочий инструмент
аналитика на тёмной канве; «дорого» за счёт дисциплины, пустого
пространства и единого шрифта, а не за счёт декоративных gradient'ов и
hyper-accent цветов.

## Палитра (dark, выверена под Market 360 homepage)

| Token | oklch | HEX | Назначение |
|---|---|---|---|
| `bg` | `oklch(0.17 0.025 265)` | `~#0c0f1d` | Канва страницы (тёмно-навигационный, не чёрный) |
| `surface` | `oklch(0.215 0.028 265)` | `~#181c2b` | Карточки, sidebar, KPI-плашка |
| `surface-elevated` | `oklch(0.255 0.03 265)` | `~#212640` | Hover карточки, chip active, секции на detail |
| `surface-invert` | `oklch(0.98 0.002 250)` | `~#fafafa` | Светлые content-блоки на тёмном (как «Without MCP» / «With LuxuryIQ MCP» в Market 360 home) — на фарме осторожно |
| `border` | `oklch(1 0 0 / 8%)` | `rgba(255,255,255,.08)` | 1px разделители, контуры карточек |
| `border-strong` | `oklch(1 0 0 / 14%)` | `rgba(255,255,255,.14)` | Hover-border, разделители секций |
| `text-primary` | `oklch(0.985 0 0)` | `~#fafafa` | Заголовки, KPI-цифры |
| `text-muted` | `oklch(0.72 0.012 265)` | `~#a7adbb` | Подписи, метки, bio, hint'ы |
| `text-faint` | `oklch(0.55 0.012 265)` | `~#737a8c` | Disabled, fine print, provenance |
| `accent-primary` | `oklch(0.7 0.16 270)` | `~#7c7cf5` | **Один** primary accent (focus ring, single CTA, link). Violet/indigo как у Market 360 hero CTA |
| `cat-1` | `oklch(0.75 0.10 200)` | `~#7ed0e6` | Категориальный: Engagement |
| `cat-2` | `oklch(0.72 0.10 145)` | `~#80d4a6` | Категориальный: Audience size |
| `cat-3` | `oklch(0.78 0.10 55)` | `~#e9b985` | Категориальный: Activity |
| `cat-4` | `oklch(0.72 0.13 350)` | `~#e58cb5` | Категориальный: Disease/topic |

**Категориальные — desaturated.** Никакого «cinema neon»: cyan/magenta/lime/orange как в первой версии прототипа уходят. Categorical акценты используем **только** в chip/tag, KPI-иконку и chart-series — не в hero, не в CTA, не в hover-glow.

## Типографика

- **Семейство:** Inter (или Geist) — **один sans-serif на всё**. Никаких
  antiqua/serif / display-fonts, никаких brush-стилей с засечками.
- **Шкала:** h1 28/32 weight 600 · h2 20/26 weight 600 · h3 16/22 weight
  500 · body 14/20 weight 400 · small 12/16 weight 400.
- **Tracking:** `-0.01em` для h1/h2; `0` для body; `+0.04em` uppercase
  для меток (`FOLLOWERS`, `POSTS`).
- **Numerals:** `font-variant-numeric: tabular-nums` глобально на
  цифрах в KPI, в таблицах, в чартах. Тысячи — thin-space разделитель
  (`'140 600'` → `140 600` через `Intl.NumberFormat('fr-FR')`-style).
- **Weight policy:** только 400 / 500 / 600. Никаких 700+.

## Грид и spacing

- **Base unit:** 4px. Шкала gap/padding: 4 / 8 / 12 / 16 / 24 / 32 / 48.
- **Container max-width:** 1280px, padding 24px.
- **Grid:** 12 колонок, gutter 16px. На detail header/секции/чипы должны
  стоять на одной grid-направляющей слева (правка из brief'а Всеволода).
- **List card grid:** 2 колонки на ≥lg, 1 на md и ниже. Gap 16px.
- **Section gap (detail):** 32px между секциями, 16px между блоками
  внутри секции.

## Card / chip / KPI plate / иконки / empty state

- **Card:** `surface` bg, `border` 1px, radius `8px`, **без shadow и
  без blur backdrop**. Padding 16px. Hover: border → `border-strong`,
  без translate/scale.
- **Chip / tag:** прямоугольник, radius `4px`, height 22px, padding
  `0 8px`, font 12/16 weight 500, **border-only** (1px `border-strong`,
  text `text-muted`). Active chip: filled `surface-elevated`, text
  `text-primary`. Цветные «Mid Tier / Type / Group» чипы → **один
  category-color** на chip (см. `cat-1…cat-4`), не радуга.
- **KPI plate** (нижняя плашка на DOL list card): `surface-elevated` bg,
  без border, padding 12px. Цифры 16px weight 600 `text-primary`,
  подписи 11px uppercase tracking +0.04em `text-muted`.
- **Social icons:** все **монохромные** (`text-muted`, Tabler stroke
  1.5px, 16px). На hover → `text-primary`. Брендовые цвета НЕ
  возвращаем на list. На detail активный канал может получить тонкий
  category-tint.
- **Disease / Brand / Medicament circles:** если в карточке N=1 или
  пусто — **одной строкой**: `text-muted italic 13px: «Sparse mentions —
  3 hashtags · 1 brand»`. Не рендерим decorative ring/test-tube
  placeholder'ы.
- **KPI provenance:** под KPI-блоком на detail — строка 11px
  `text-faint`: «Period: last 30 days · updated 2026-05-29».

## Hero / страницы

- **List hero:** одна строка sticky header сверху — лого + nav (Platform
  / Use cases / Reports / Contacts) + аватарка пользователя.
- **List title block:** только `h1` («DOLs · 234 tracked»), `text-muted`
  одна строка справа («Sort by: …»), фильтр-чипы под title-block в
  одну строку. Никаких hero gradient'ов.
- **Detail hero:** photo (64×64 или 96×96 на lg) + name + chips + 4-5
  KPI cifr в одну строку. Никакого «animated halo» — это противоречит
  «sterile». Если нужен accent — тонкое 1px свечение
  `border-strong` под аватаркой.

## Anti-list (что НЕ делать сегодня)

1. **Не возвращать gradient на тексте** (`bg-clip-text text-transparent`)
   и hero-level multicolor glow. Это уходит из прототипа.
2. **Не использовать shadow / blur / glow-backdrop** на карточках —
   depth только через `surface-elevated` и `border-strong`.
3. **Не делать bubbly / pill-shaped chips** — только прямоугольник
   radius 4px.
4. **Не возвращать брендовые цвета социалок на list** — только monochrome.
5. **Не рендерить decorative placeholder'ы** при sparse-данных —
   одна строка empty state.
6. **Не показывать клиенту несколько direction'ов** — один путь, иначе
   встреча уходит в выбор стиля вместо approval полишинга.
7. **Не мигрировать иконки Tabler → Lucide** — это work on stack, не
   polishing.
8. **Не трогать IA / фильтры / state** — компоновку оставляем такой
   как в live-портале.

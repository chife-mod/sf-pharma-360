# sf-pharma-360 — Project Memory

> **Статус (2026-05-31):** инициация завершена.
> Stack согласован, Next.js + shadcn + Tabler подняты, репо `chife-mod/sf-pharma-360`
> опубликован, live на https://chife-mod.github.io/sf-pharma-360/, карточка
> в SFG Dashboard добавлена.
>
> **🔥 СЕЙЧАС в работе:** discovery. Всеволод прислал голосовую транскрибацию
> (см. [BRIEF.md](BRIEF.md)) — там ВАЖНОЕ: клиент просит ЛЁГКИЙ стайлинг, а
> мы уже сделали полноценный «макси»-рефакторинг. Эту разницу надо обсудить
> до следующих изменений. Ждём вторую транскрибацию + Consilium-ресёрч →
> `RESEARCH.md`.

---

## Что это

Прототип нового веб-портала для Pharma-вертикали SemanticForce / Market360,
который мы покажем большой фарме на встрече **на этой неделе**. Заменяет
текущий live-портал [pharma.market360.ai](https://pharma.market360.ai/),
который технически работает, но визуально выглядит устаревше: его собрали
на базе старого темплейта Watch360, и за время разработки программисты
испортили внешний вид. Нужна модернизация дизайна + новая интерактивная
подача дашбордов под фарма-аудиторию.

Репозиторий: `chife-mod/sf-pharma-360` (public, ещё не создан)
Локальный путь: `/Users/oleg/Dev/vsevolod/prototypes/sf-pharma-360/`
Будущий live URL: `https://chife-mod.github.io/sf-pharma-360/`

---

## Source material

### Live production (что переделываем)

- **DOLs list:** https://pharma.market360.ai/influencers — 234 инфлюенсера,
  карточная сетка, sidebar-фильтры слева (Audience Size, Country, City,
  Group, Type, Name, Gender, Channel)
- **Single DOL:** https://pharma.market360.ai/influencers/16afb2bcf2fa1e_dashboard_generated_id
  — детальная карточка с топовыми блоками (Audience & Eng Rate, agg-stats,
  Brands, Diseases, Medicaments, Hashtags, Posts Key Topics), затем
  dark-секция (Avg Views/Likes/Comments Per Post, Top Commenters, Comments
  Insights, Commenters Interest Profile Description), CTA-кнопки CREATE
  DASHBOARD / CREATE REPORT

Full-page стич-скриншоты обеих страниц лежат в
[Screenshots/](Screenshots/). Снимались через Chrome MCP scroll+stitch
(headless Chrome упирается в sign-up wall, нужна авторизованная сессия).

**Что бросается в глаза в текущей версии:**
- Палитра из Watch360: beige/gold-акценты (gold-thin outlines у Diseases
  circles, brown chips типа `Bariatric Surgeon`) — **для фармы не годится**.
- Mid Tier / Type / Group чипы — много мелких цветных бэйджей, разнобой
  без системы.
- Тёмная нижняя секция через резкий cut на середине страницы — выглядит как
  два разных сайта склеенных вместе.
- Footer тёмно-серый, нейтральный.
- Иконки соцсетей разноцветные (FB blue, IG gradient, X black и т. д.) —
  это ок для распознавания, но добавляет визуального шума.

### Figma references

| Файл | Что взять | URL |
|---|---|---|
| Market 360 Design | **Главный референс** — dark-тема палитра, hero с gradient-ring, layout-grid, типографика, набор Tabler-иконок зашит в UI Kit | https://www.figma.com/design/oR5AwDiD7ek4IxUOgyZCbU/Market-360-Design |
| Market 360 Analysis — Process | Inspiration board: dark UI с magenta/cyan/lime акцентами, glow-эффекты, gradient rings, cosmic vibe | https://www.figma.com/design/L9EDTInjJN89AIfwMb1EFe/Market-360-Analysis---Process |
| Watch360 UI Kit | Только как референс шрифтов и иконок (beige/gold НЕ берём) | https://www.figma.com/design/Vlac7C4NWfTvX3K2dLFat5/⏱️-Watch360 |

PNG-снимки референсов в [Screenshots/references/](Screenshots/references/).

**Ключевое из Market 360 UI Kit (page `1:2` aka "Ui Kit"):**
- В дизайн-системе уже **прописаны Tabler Icons** (есть фрейм
  `Tabler Icons /` с ~70 mapped иконками: `tabler:search`, `tabler:apps`,
  `tabler:chart-line`, `tabler:pill`, `tabler:stethoscope`,
  `tabler:trending-up`, `tabler:eye`, `tabler:users-group`, …)
- Components section содержит: Main Menu (desktop/mobile/expanded
  варианты), Card (Default / Hover / Active / Selected / Disabled /
  Active Hover / Selected Hover), Toggle (On / On Hover / Off / Off Hover)
- Variables в файле ещё не определены (`get_variable_defs` → `{}`) — цвета
  пока живут как raw fill values

---

## Дизайн-направление (новое)

- **Dark тема — основной, light тема — потом.** Стартуем с тёмной (Market
  360 homepage style).
- **Палитра** (приближённо, надо снять токены из Figma по mvp-секции):
  - Background: глубокий navy/almost-black (#0A0B14 — ish)
  - Surface: тёмно-серый с лёгким blue-tint
  - Accents: **magenta/pink, cyan/teal, lime green, оранжевый** —
    разноцветные категориальные акценты, как в Market 360 hero
  - Text primary: pure white или off-white
- **Типографика:** забираем из Market 360 файла (вероятно Inter/Geist sans
  + потенциально что-то с display-варантом для hero).
- **Иконки:** `@tabler/icons-react` — это уже их система, остаёмся в ней.
- **Анимации:** **ненавязчивые** трендовые — fade/slide-in при первом
  рендере, hover-tilt на карточках, animated number counters в KPI,
  staggered grid intros. Никаких распирающих анимаций по триггеру.
- **Дашборды:** живые, интерактивные. Карточки с анимированными
  числами, гейджи/прогрессы с анимированным fill, чарты с tooltip+brush.
- **Иллюстрации:** для пустых состояний и hero — простые линейные
  (как в Market 360 Pharma_Placeholder / Beauty_Placeholder), на единой
  stroke-системе. Можно сгенерировать через Tabler illustration set или
  кастом.

---

## Stack (proposed → требует подтверждения user'а)

| Слой | Выбор | Почему |
|---|---|---|
| Framework | **Next.js 15** (App Router, Static Export) | SF-проекты живут под GitHub Pages, static export обязателен |
| Язык | TypeScript strict | стандарт workspace'a |
| Стили | **Tailwind CSS v4** | стандарт shadcn |
| UI primitives | **shadcn/ui** (slate base, dark) | компонентный layer, customizable, owns the code |
| Иконки | **`@tabler/icons-react`** | Market 360 уже на Tabler — мы наследуем |
| Анимации | **Framer Motion** | гладкие, declarative, лучшие enter/exit |
| Theme switch | **next-themes** + Tailwind dark mode | dark default, light позже |
| Charts | **Recharts** (или **Tremor**) | для дашбордовых виджетов; решим по ходу |
| Fonts | **Geist Sans + Geist Mono** (variable, Vercel) | современный, бесплатный, fallback'и хорошие |
| Deploy | **GitHub Pages** через `peaceiris/actions-gh-pages` | стандарт workspace'а |
| Прототип-данные | mock JSON в `/data/` (234 DOL'а, скопировать структуру с live) | dashboard сам сгенерим без бэкенда |

**Альтернативы, которые ОТКЛОНИЛ (если будут вопросы):**
- ❌ Vite + React — Next.js даёт image opt, fonts opt, static export из
  коробки, и оба проекта в workspace'е (m360-signal-selector, wwg) уже на
  Next.
- ❌ NextUI / MUI — shadcn даёт owned code, проще кастомить под brand.
- ❌ GSAP — Framer Motion достаточно для React-flow, GSAP overkill.

---

## Что предстоит (next session pickup)

1. ✅ Папка + Screenshots + CLAUDE.md
2. **🔜 Поднять Next.js проект** (`pnpm create next-app sf-pharma-360-app`
   внутри этой папки), сразу установить tailwind / shadcn init /
   tabler-icons / framer-motion / next-themes / recharts
3. **🔜 Создать `chife-mod/sf-pharma-360` public repo** + GH Pages
   workflow (`peaceiris/actions-gh-pages` из `out/`)
4. **🔜 Добавить карточку в SFG Dashboard** в раздел **Prototypes** (cover
   = stitched screenshot live версии? или сгенерим новую обложку после
   того как будет первый screen)
5. Снять design tokens из Figma Market 360 (точные цвета, типография,
   spacing) — сейчас живут как литералы, надо вывести в `theme.css`
6. Дизайн **DOLs list** (новая версия): grid влево-вверх, sidebar фильтров
   справа в drawer/inline, smooth search-bar сверху
7. Дизайн **DOL detail**: hero с photo + animated halo + 5 KPI big numbers
   с counter-animation, ниже tabbed view (Brands / Diseases / Medicaments
   / Engagement / Comments)
8. Mock-data в `/data/dols.json` — копировать структуру с live API
9. Light mode (позже)

---

## Конвенции

- Все CSS-токены в `app/globals.css` через `@theme` (Tailwind v4) →
  никаких хардкодных HEX в компонентах
- shadcn components в `components/ui/` (owned, можем редактировать)
- Кастомные компоненты в `components/`
- Mock-data в `data/`
- Pages под App Router в `app/`
- Tests — пока не настраиваем (прототип)

---

## Live materials (для быстрого открытия)

- Скриншоты production: [Screenshots/01-influencers-list-fullpage.jpg](Screenshots/01-influencers-list-fullpage.jpg), [02-influencer-detail-fullpage.jpg](Screenshots/02-influencer-detail-fullpage.jpg)
- Figma reference snapshots: [Screenshots/references/](Screenshots/references/)

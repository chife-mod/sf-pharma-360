# Финальный синтез — sf-pharma-360 polishing methodology

Источники: оба delegate-файла (`02b-gemini.md`, `02c-codex.md`) присутствуют и полны.

## TL;DR

> **Поправка (2026-06-01):** ниже Codex'овский light-вариант был выбран как
> «единый direction». Всеволод откатил: исходник Market 360 dark
> (Figma `oR5AwDiD7ek4IxUOgyZCbU`), serif/antiqua там нет. Итоговое
> решение — **Sterile Enterprise *dark***: «форма» (один sans, monochrome
> icons, прямоугольные chips, empty state одной строкой, anti-list) из
> Codex'a + палитра dark из Gemini, выровненная под Market 360 home.
> Подробнее — `DESIGN.md` rev 2.

- Деливерабл — **2 страницы стилистического полишинга**, не ребилд. Логику не трогаем.
- Концепт-направление: **Sterile Enterprise (Dark)** — выровнено под Market 360 homepage.
- Tool сегодня: **shadcn + Cursor manual** в уже поднятом Next.js 15. `v0` — только для отдельных блоков (empty state, stat-row), не для страницы целиком.
- Главное движение «дороже»: типографика (один нейтральный sans), монохромные social icons, компактные empty states вместо placeholder-кружочков.
- Time-box ~2 часа: tokens → list → detail → 3 сценария данных (rich/sparse/empty) → before/after walkthrough.
- Заказчику показываем **один direction**, не три параллельных варианта.

## Tier 1 — оба согласны

- **Sterile Enterprise / Clinical Precision** как ведущий концепт; вдохновение — Linear, Stripe, Vercel Dashboard.
- Antiqua/serif → **один нейтральный sans-serif** (Geist / Inter), 3 уровня типографики.
- Social icons → **монохромные**, брендовый цвет только на hover.
- **Sparse-данные** = компактный empty state, а не пустые декоративные круги/test-tubes.
- **12-колоночная сетка** объединяет sidebar, заголовки, карточки, секции detail.
- **Chips** — строгие прямоугольники с малым радиусом, без «bubble» формы.
- **Tool**: shadcn-проект продолжаем, AI codegen — вспомогательно.
- **Anti**: не менять IA / фильтры / state, не строить полноценную DS, не смешивать cyan и magenta как равные акценты.

## Tier 2 — расходятся

| Вопрос | Gemini | Codex | Verdict |
|---|---|---|---|
| **Тема** | Dark (`#09090b` / Zinc 950, cyan accent) | Light (off-white bg, graphite text, restrained cyan) | **Codex.** Light-вариант ближе к Rozetka-стерильности и pharma-серьёзности; dark выглядит «sci-fi демо», что противоречит «как 2 года назад» |
| **Tool stack** | v0 (iterations) + Cursor (внедрение) | Cursor manual; v0 для отдельных блоков | **Codex.** v0 на целую страницу = риск несовместимости с уже сделанным prototype'ом, экономия времени мнимая |
| **Кол-во концептов** | 2 направления равноправно | 1 ведущий + demo-альтернатива в стол | **Codex.** Не показывать клиенту вилку — это провоцирует bikeshed-обсуждение вместо approvе polishing'a |
| **Time-box** | 120 мин, фокус на detail (60 мин) | 110 мин, по 30-35 мин list/detail + 15 мин на сценарии данных | **Codex.** Проверка rich/sparse/empty — ключевой фикс из брифа, must-have в плане |

## Tier 3 — что упустили оба

1. **Provenance / период данных.** Codex упомянул вскользь, оба не довели до конкретики: на detail-странице нужен timestamp «данные за <период>» рядом с KPI. Без него цифры «1, 1, 1, 1» выглядят как баг, а не как «мало активности за месяц».
2. **Before/after artefact.** Бриф = «показать сегодня Всеволоду». Никто не предложил оформить deliverable как **side-by-side скриншот** (current portal слева, polished справа) — это сильнее, чем live-демо одного состояния.
3. **Tabler → Lucide миграция.** В прототипе уже стоит Tabler, Gemini подтверждает Tabler, Codex молчит. **Не мигрируем сегодня** — это работа на стек, не на полишинг. Зафиксировать как явный non-goal.
4. **Number formatting.** Никто не сказал: тысячи через тонкий thin-space, проценты выровнять моноширинным цифровым вариантом (`font-variant-numeric: tabular-nums`). Это +20% к «дороже» бесплатно.
5. **Density caveat.** Deliverable — 2 страницы, не полная система. Tokens пишем **inline в этих 2 файлах**, не в `theme/`, чтобы не провоцировать regression в остальном портале.

## Финальные выборы

- **Концепт-направление:** Sterile Enterprise (light, off-white bg, graphite text, restrained cyan accent).
- **Tool:** shadcn + Cursor manual в существующем Next.js 15. v0 — точечно на empty state и stat-row.
- **План (90-110 мин):** 0:00–0:15 tokens & запреты → 0:15–0:45 list polish → 0:45–1:20 detail polish → 1:20–1:35 три сценария данных → 1:35–1:50 side-by-side before/after для Всеволода.
- **Anti-list, главное:** **не показывать несколько direction'ов клиенту** — один путь, иначе встреча уходит в выбор стиля вместо approval полишинга.

*Источники Gemini (без дат, дано как ориентиры): linear.app, vercel.com/dashboard, stripe.com, bloomberg.com/professional. Codex интернет не использовал.*

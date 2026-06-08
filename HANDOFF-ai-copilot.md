# HANDOFF — AI Copilot + Explore — 2026-06-08

> Focused handoff for the **AI Copilot drawer** + **Explore galaxy**. Read
> `HANDOFF.md` first (global entry point / dev + deploy rules), then this.
> Everything here is **shipped to live** (commit `598cb4f`).
> Try it: https://chife-mod.github.io/sf-pharma-360/dols/aayed/ → click the
> constellation FAB bottom-right. Local: `http://localhost:4322/dols/aayed/`.

---

## 1. Goal — what this is and why

Redesign the SF "AI козёл" copilot for sf-pharma-360. It's a **contextual
assistant** opened from any DOL page; the chat is scoped to that DOL.

**Design north star** (from the consilium, see §6): kill the original
two-surface split (left scope panel competing with the chat). Make it read as a
**pipeline** — *pick data → see result → ask deeper* — with the scaffolding
**recessive** so chat leads (the client worried it was "too much interface").

Still **mock — no LLM** yet (canned answers). Wiring a real model is the main
remaining backend step.

---

## 2. Where the code lives

| File | What |
|---|---|
| `components/v2/assistant-drawer.tsx` | The whole drawer (client). Opens on `window` event `sf-open-assistant`. |
| `components/v2/assistant-drawer.css` | Scoped styles. Drawer is wrapped in `<div className="v2-root" style={{display:"contents"}}>` so v2 tokens cascade without painting a bg. |
| `components/ai-assistant-constellation.tsx` | The FAB. Its `onClick` dispatches `sf-open-assistant`. |
| `app/layout.tsx` | Mounts `<AssistantDrawer/>` + `<AnimatedFavicon/>` + `metadata.icons` (favicon). |
| `data/assistant.ts` | ALL mock data + helpers (see §4). `GALAXY` lives inside the drawer component. |
| `components/animated-favicon.tsx` | Animated canvas favicon (masked conveyor) over the static `public/favicon.svg`. |

---

## 3. Current structure of the drawer

Right slide-in, **resizable** (default ~52%, min 560) + **expand-to-full**.
Layout = `[ history rail | main ]`.

- **History rail** (left, permanent, collapsible): New chat · search · Pinned ·
  Saved answers · Recent (rounded tiles; bg `--panel-2`, lighter than chat).
- **Header**: eyebrow "✦ AI Copilot" + **big DOL name**. expand · close.
  (No "+", no redundant channel — channel lives in the Context Card.)
- **Bottom tabs**: **Copilot ↔ Explore**.

### Copilot tab — the pipeline (top→bottom)
1. **Content** — dropdown (Author Posts + All Comments / posts only / comments only).
2. **Filters** — content-dependent **tags** (Questions/Topics/diseases/drugs).
   A few inline + **"+N more" → categorised picker** (group "Tags").
3. **Summary** — **auto**, REACTS to content+filters: big metrics
   (Messages · Positive · Filters on) + a sentence. Toggling a filter changes it
   (cause→effect sits right under the filters).
4. **Prompts** — two kinds, this is the client's pain #2 answer:
   - **Analyze** (🪄 teal) — 14 analysis prompts; 4 common inline +
     **"+more" → categorised picker**.
   - **Filtering prompts** (🔻 amber funnel) — Brands/GLP-1/Risk/Promotional/
     Collaborations; clicking **narrows scope** (Summary reacts). They live in
     the picker under "Filtering prompts".
   - **Suggested from your data** (✨ magenta) — dynamic signal nudges
     (spike, risk) rendered as **rows** (not pills).
   - Inline labels + the picker use the **same wording + icons** (Suggested /
     Analyze / Filtering prompts).
5. **Chat** — prompt → "Thinking…" → answer with **human numbered citations**
   `[1][2]` (hover = instant text card) + a **Sources** list. Composer at bottom.

### Explore tab — packed zoomable galaxy
CleanMyMac-style **circle packing** (`packCircles` in the component, deterministic).
- L0 = clusters (Topics/Questions/Diseases/Treatments/Brands) sized by volume,
  packed to fill the viewbox.
- Click a cluster → **zoom into** its packed children. "← All clusters" to exit.
- Click a child → it **flies into the chat** (switches to Copilot, runs a question).

---

## 4. Mock data (`data/assistant.ts`)

- `PROMPT_GROUPS` — 14 analysis prompts in 5 groups; `common: true` = shown inline.
- `THEMES` — 5 filtering prompts (funnel).
- `DYNAMIC_SUGGESTIONS` — 2 data-triggered nudges.
- `CONTENT_TYPES` + `TAGS_BY_CONTENT` — content type drives the tag set + counts.
- `SOURCES` — keyed by `id:NNN`; powers numbered citations + hover cards.
- `HISTORY_THREADS` — pinned/saved/recent.
- `answerFor(promptId, name)` — canned answer (generic fallback for new prompts).
- `scopeSummary(name, content, channel, filterLabels)` — the reactive Summary text.
- `GALAXY` (in `assistant-drawer.tsx`) — Explore clusters + children.
- All deterministic — **no `Date.now()`/`Math.random()`** (static-export safe).

---

## 5. What's DONE ✅ (all live)

- Drawer shell: resizable, expand-to-full, FAB-open, **body scroll-lock** (no
  double scrollbar), **dark thin scrollbars**, **z-index above the FAB**
  (100001 — was overlapping Send), **scroll-flicker fix** (no scrim
  backdrop-blur + `translateZ(0)` + `overscroll-behavior:contain`).
- Permanent collapsible **history rail** (tiles, lighter bg).
- **Pipeline** Content → Filters(content-dependent) → reactive **Summary**(metrics) → Prompts.
- **Analyze vs Filtering prompts** split (funnel), overflow **"+more → categorised picker"** (handles 7+), 3-part `(i)` tooltips, tricolor icons, inline/picker consistency, suggestion **rows**.
- **Human citations** (numbered + Sources + hover card) — no raw `id:`.
- Type scale on canon (auditor regex now covers `asd-` / `uikit-`).
- **Explore** packed zoom galaxy + fly-into-chat.
- **Favicon**: animated canvas + **static SVG baseline** (basePath-aware →
  shows in the tab local + prod).
- "+more" button: white dashed, 14px (matches chips).

---

## 6. What's NEXT 🔜 (start here)

1. **Explore → CleanMyMac "Space Lens" look** (user gave reference screenshots,
   in this session's transcript). Current = tight packed cluster. TARGET:
   **one dominant central circle + satellites around it + an icon/emoji inside
   each bubble + a smooth "fly-in" zoom transition**. This is the next visual
   upgrade the user wants.
2. **Copilot polish backlog:**
   - Copy-answer button.
   - Open a history thread → **restore its scope snapshot**.
   - Response-length toggle (Short/Detailed as a *format*, not separate prompts).
   - Citation click → scroll-to-source (needs a source/post view).
   - Deeper "Edit scope" editor (period picker etc.).
3. **Real LLM wiring** — replace `answerFor` mock with a model call (the deck is
   mock-only today). Streaming + real citations.
4. **Chat-first lean** (optional) — the user flagged "too much interface". Tabs +
   compaction helped; could raise the ask box / collapse scope by default.

---

## 7. Decisions already made (don't re-litigate)

- **Pain #2 ("отделить обычные промпты от фильтрующих")** = two kinds of
  **PROMPTS** (Analyze + Filtering), NOT two kinds of tags. (We tried funnel-on-
  tags and "Focus" — both reverted; the client framing is *prompts*.)
- **7+ prompts** UX = few inline + "+more" → searchable, **categorised** picker
  (chips, not rows). Same pattern for filters.
- **Bubbles** = a separate **Explore tab** (discovery), NOT a replacement for the
  working Copilot.
- **Favicon**: animated canvas loops, but **browsers throttle favicon
  animation** (Chrome freezes it on inactive tabs) — the static SVG is the
  reliable baseline. This is a platform limit, not a bug.

---

## 8. How to continue / gotchas

- Dev server: preview tool, **port 4322** (`.claude/launch.json`).
- Typecheck: `node_modules/.bin/tsc --noEmit`.
- Full build: `node_modules/.bin/next build` **directly** (not `pnpm build`),
  and **only when the dev server is stopped** (else it corrupts `.next` →
  `Cannot find module './vendor-chunks/...'`; fix: stop dev, `rm -rf .next`, restart).
- Deploy: commit + push `main` → GH Actions (~1 min). **Never stage**
  `.env.local` / `cookies.txt`.
- Preview quirks: programmatic `window.scrollTo` doesn't always emit scroll
  events; screenshots blank/shrink after navigation/scroll (use a TALL viewport
  + `scrollTo(0,0)` so the target is in view without scrolling); HMR can freeze
  the favicon loop — a **fresh reload** is the real test.
- Consilium synthesis (the agreed UX direction):
  `/Users/oleg/Dev/oz/consilium/sessions/2026-06-07-ai-agent-chat-drawer-ux/99-synthesis.md`
  (+ `02b-codex.md` for the full Codex reasoning).
- QA: `Consistency Verification/audit.js` — paste into the browser console /
  preview_eval, run `auditConsistency()`; `pass:true` = on the type scale.

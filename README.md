# sf-pharma-360

Pharma-vertical market-intelligence prototype for SemanticForce / Market 360.
Modernized successor to [pharma.market360.ai](https://pharma.market360.ai/) —
clean dark UI, Tabler icons, animated dashboards, built for the upcoming Big
Pharma demo.

**Live:** https://chife-mod.github.io/sf-pharma-360/

## Stack

Next.js 15 (App Router, static export) · TypeScript · Tailwind v4 ·
shadcn/ui · `@tabler/icons-react` · Framer Motion · Recharts ·
Geist Sans + Geist Mono. Deployed to GitHub Pages via
`peaceiris/actions-gh-pages`.

## Local dev

```bash
npm install
npm run dev
# → http://localhost:4310 (port set in workspace .claude/launch.json)
```

## Build

```bash
npm run build      # → /out static export
```

## Project context

See [CLAUDE.md](CLAUDE.md) for full project memory: source material,
design direction, decisions made, and the next-session pickup list.
Live page screenshots and Figma reference snapshots live in
[Screenshots/](Screenshots/).

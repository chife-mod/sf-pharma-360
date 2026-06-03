import Link from "next/link";

type Tile = {
  id: string;
  word1: string;
  word2: string;
  desc: string;
  count: string;
  badge?: { tone: "live" | "planned"; label: string };
  href?: string;
};

const TILES: Tile[] = [
  {
    id: "dols-list",
    word1: "DOLs",
    word2: "list",
    desc: "Digital opinion leaders directory — filter sidebar + influencer card grid. Active development surface.",
    count: "9 influencers",
    badge: { tone: "live", label: "Live" },
    href: "/dols",
  },
  {
    id: "dol-detail",
    word1: "DOL",
    word2: "detail",
    desc: "Single influencer profile — Audience & Eng Rate, Brands, Diseases, Medicaments, Hashtags, Posts Key Topics, commenter insights.",
    count: "Planned · rebuild in new aesthetic",
    badge: { tone: "planned", label: "Planned" },
  },
  {
    id: "sandbox",
    word1: "Design",
    word2: "sandbox",
    desc: "Token + recipe playground. Surfaces the system from DESIGN-SYSTEM.md so the next AI-tool output can be diffed against it.",
    count: "Planned · after first AI output",
    badge: { tone: "planned", label: "Planned" },
  },
  {
    id: "uikit",
    word1: "UI",
    word2: "kit",
    desc: "Live primitives gallery — card states (default / hover / selected), chip tones, KPI tiles, pagination, social icons, empty lines.",
    count: "Planned · after sandbox lands",
    badge: { tone: "planned", label: "Planned" },
  },
];

export default function Home() {
  return (
    <div className="landing">
      <header className="landing-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pharma-360-logo.svg" alt="SF Pharma 360" />
        <div className="landing-header__meta">
          Internal preview · not for distribution
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__label">
            <span className="landing-hero__dot" />
            <span>SF Group · Pharma vertical</span>
          </div>
          <h1 className="landing-hero__title">
            Pharma 360 — <span>preview</span>
          </h1>
          <p className="landing-hero__sub">
            Open a section to preview the design. Concept versions switch via
            the pill bottom-right. Live production lives at{" "}
            <a
              href="https://pharma.market360.ai/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              pharma.market360.ai
            </a>
            .
          </p>
        </section>

        <div className="landing-grid">
          {TILES.map((t) =>
            t.href ? (
              <Link key={t.id} href={t.href} className="landing-tile">
                <TileBody tile={t} />
              </Link>
            ) : (
              <div
                key={t.id}
                className="landing-tile"
                data-status="planned"
                aria-disabled="true"
              >
                <TileBody tile={t} />
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

function TileBody({ tile }: { tile: Tile }) {
  return (
    <>
      <div className="landing-tile__name">
        {tile.word1} <span>{tile.word2}</span>
      </div>
      <p className="landing-tile__desc">{tile.desc}</p>
      <div className="landing-tile__footer">
        <span>{tile.count}</span>
        {tile.badge ? (
          <span
            className="landing-tile__badge"
            data-tone={tile.badge.tone}
          >
            {tile.badge.label}
          </span>
        ) : (
          <span>{tile.href ? "→" : "·"}</span>
        )}
      </div>
    </>
  );
}

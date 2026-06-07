"use client";

/* /uikit — design-system catalog (shadcn-docs / Storybook style).
 *
 * One link the client gets: a single page that documents the Pharma 360
 * design system — (A) token tables/swatch grids and (B) the real
 * component primitives with every state.
 *
 * SOURCE OF TRUTH: this page renders the ACTUAL primitives from
 * components/v2/* with real mock data from data/dols.ts, wrapped in the
 * real .v2-root token scope (app/dols/v2.css imported below). Token
 * values in the tables are pulled verbatim from v2.css / globals.css.
 * Catalog chrome (header, nav, stages, swatches) lives in uikit.css.
 *
 * Files are read-only-imported; nothing in components/v2 or app/dols is
 * edited. Forced hover/selected/active states use static wrapper classes
 * (.uikit-force-hover, .on, .active) that mirror the real CSS.
 */

import "../dols/v2.css";
import "./uikit.css";

import { useState, useEffect, type CSSProperties } from "react";

import { AppBgV2 } from "@/components/v2/app-bg-v2";
import { InfluencerCard } from "@/components/v2/influencer-card";
import { KpiHero } from "@/components/v2/kpi-hero";
import { Toolbar } from "@/components/v2/toolbar";
import { FilterPanel, emptyFilters, type FilterState } from "@/components/v2/filter-panel";
import { Icons, channelMeta, Social, tierStar } from "@/components/v2/icons";
import { Sparkline } from "@/components/v2/sparkline";
import { AiLoader } from "@/components/ai-loader";
import { AiAssistantConstellation } from "@/components/ai-assistant-constellation";
import {
  DOLS,
  TIERS,
  SORTS,
  fmt,
  type Channel,
  type SortDir,
  type SortKey,
  type Tier,
} from "@/data/dols";

/* ──────────────────────────────────────────────────────────────
 * Token data — extracted verbatim from app/dols/v2.css (the live
 * .v2-root token block) + app/globals.css (the .dark brand block).
 * ────────────────────────────────────────────────────────────── */

type Swatch = { name: string; token: string; hex: string; role: string };

// Primary / structural — the brand cyan family + the live surface stack.
const SURFACE_SWATCHES: Swatch[] = [
  { name: "Background", token: "--v2-bg", hex: "#0A0B16", role: "Page canvas (de-blued navy)" },
  { name: "Panel", token: "--v2-panel", hex: "#10111B", role: "Base panel surface" },
  { name: "Panel 2", token: "--v2-panel-2", hex: "#161824", role: "Avatars, menus, raised fills" },
  { name: "Panel 3", token: "--v2-panel-3", hex: "#0D0E17", role: "Recessed panel" },
  { name: "Raise", token: "--v2-raise", hex: "#1A1C28", role: "Hover / elevated tiles" },
  { name: "Inset", token: "--v2-inset", hex: "#0B0C14", role: "Sunken wells" },
];

// Brand primary — the cyan/teal action family.
const PRIMARY_SWATCHES: Swatch[] = [
  { name: "Teal", token: "--v2-teal", hex: "#2DD4BF", role: "Primary action · Mid Tier · active states" },
  { name: "Teal bright", token: "--v2-teal-bright", hex: "#34E7CE", role: "Brighter teal accent" },
  { name: "Cyan", token: "--v2-cyan", hex: "#22D3EE", role: "Gradient partner · TikTok glyph" },
];

// Categorical accents — max 4 dominant per screen, plus the tier-ramp ends.
const ACCENT_SWATCHES: Swatch[] = [
  { name: "Violet", token: "--v2-violet", hex: "#A78BFA", role: "Tertiary · Type tags · gradient end" },
  { name: "Magenta", token: "--v2-magenta", hex: "#F25CB0", role: "Notifications · AI suggest · hot metrics" },
  { name: "Magenta soft", token: "--v2-magenta-soft", hex: "#F472B6", role: "Softer magenta tint" },
  { name: "Orange", token: "--v2-orange", hex: "#FB923C", role: "Micro tier · warm accent · warnings" },
  { name: "Amber", token: "--v2-amber", hex: "#F5B544", role: "Rising tier · mid-range engagement" },
  { name: "Rose", token: "--v2-rose", hex: "#FB7185", role: "Down deltas · low engagement" },
  { name: "Blue", token: "--v2-blue", hex: "#60A5FA", role: "Elite tier (cool end of ramp)" },
  { name: "Green", token: "--v2-green", hex: "#4ADE80", role: "Type / Group meta chips" },
];

// Text + line tokens (these are rgba/hex strings in v2.css).
const TEXT_SWATCHES: Swatch[] = [
  { name: "Text", token: "--v2-text", hex: "#EAEEF8", role: "Primary text" },
  { name: "Text dim", token: "--v2-text-dim", hex: "#93A0BC", role: "Secondary text · idle icons" },
  { name: "Text mute", token: "--v2-text-mute", hex: "#8993AD", role: "Labels (AA 5.5:1 on bg)" },
  { name: "Text faint", token: "--v2-text-faint", hex: "#7C869D", role: "Tallies / hints (AA 4.6:1)" },
  { name: "Line", token: "--v2-line", hex: "rgba(150,170,210,.10)", role: "Default 1px divider" },
  { name: "Line strong", token: "--v2-line-strong", hex: "rgba(160,180,220,.18)", role: "Emphasised border / hover" },
];

// 8-px spacing grid (strict). Banned: 20/28/36/44.
const SPACING = [
  { v: 2 }, { v: 4 }, { v: 8 }, { v: 12, half: true }, { v: 16 },
  { v: 24 }, { v: 32 }, { v: 40 }, { v: 48 }, { v: 56 }, { v: 64 },
];
const BANNED_SPACING = [20, 28, 36, 44];

// Type scale — round sizes only, floor 11px. Roles from DESIGN-SYSTEM.md.
// Canonical 7-step scale (locked 2026-06-07; same on /dols + /dols/[id]).
const TYPE_SCALE = [
  { px: 36, w: 700, role: "H1 / hero — DOL name, hero title" },
  { px: 28, w: 700, role: "Big numbers — KPI value, total audience" },
  { px: 22, w: 700, role: "Medium numbers · card name" },
  { px: 17, w: 600, role: "Sub-heading — section & block titles" },
  { px: 14, w: 400, role: "Body — bio, names, row values, buttons" },
  { px: 12, w: 400, role: "Secondary — handle, captions, deltas, counts" },
  { px: 11, w: 600, role: "Caps — eyebrows, KPI labels, tags" },
];

// Radii — from v2.css --v2-r-* scale.
const RADII = [
  { name: "xs", token: "--v2-r-xs", px: 6 },
  { name: "sm", token: "--v2-r-sm", px: 9 },
  { name: "md", token: "--v2-r-md", px: 13 },
  { name: "lg", token: "--v2-r-lg", px: 18 },
  { name: "xl", token: "--v2-r-xl", px: 22 },
  { name: "pill", token: "--v2-r-pill", px: 999 },
];

// Motion — easings + durations actually used (grepped from v2.css +
// ai-assistant.css). The standard ease drives every v2 transition.
const MOTION = [
  {
    name: "Standard ease",
    val: "cubic-bezier(0.16, 1, 0.3, 1)",
    use: "--v2-ease — every hover, accordion, layout transition",
  },
  {
    name: "Hover / color",
    val: "200ms · ease",
    use: "icon-buttons, nav items, chips, opt rows",
  },
  {
    name: "Card lift / layout",
    val: "300–350ms · var(--ease)",
    use: "card transform+border+shadow, filter-body grid-rows, hero fold",
  },
  {
    name: "Drawer slide",
    val: "320ms · var(--ease)",
    use: "≤1024 filter drawer translateX + backdrop fade",
  },
  {
    name: "AI-FAB pop",
    val: "550ms · cubic-bezier(0.2, 0.8, 0.2, 1)",
    use: "assistant tile entrance (the “chuk”)",
  },
  {
    name: "AI-FAB stroke-draw",
    val: "5.2s linear · 0.6s delay · both",
    use: "looping ring/dot draw — delay+both kills first-cycle load jank",
  },
];

/* sample DOLs for component stages */
const cardDol = DOLS.find((d) => d.id === "leila") ?? DOLS[0]; // Elite, all channels
const altDol = DOLS.find((d) => d.id === "akshay") ?? DOLS[1]; // Mid Tier

/* left-rail nav model — quick-link "tags" grouped like shadcn's sidebar */
const NAV_GROUPS = [
  {
    label: "Foundations",
    items: [
      { id: "color", label: "Color" },
      { id: "spacing", label: "Spacing" },
      { id: "type", label: "Type" },
      { id: "radius", label: "Radius & Motion" },
    ],
  },
  {
    label: "Components",
    items: [
      { id: "tags", label: "Tags & chips" },
      { id: "buttons", label: "Buttons" },
      { id: "icons", label: "Icons" },
      { id: "kpi", label: "KPI" },
      { id: "card", label: "Card" },
      { id: "pagination", label: "Pagination" },
      { id: "loader", label: "Loader" },
      { id: "ai", label: "AI assistant" },
    ],
  },
];
const NAV_IDS = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));

export default function UIKitPage() {
  const [active, setActive] = useState<string>("color");

  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (!vis.length) return;
        vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(vis[0].target.id);
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="v2-root">
      <AppBgV2 />
      <div className="uikit-shell">
        <header className="uikit-header">
          <span className="uikit-eyebrow">
            <span className="dot" />
            Pharma 360 · Design System
          </span>
          <h1 className="uikit-title">
            UI<span className="grad">Kit</span>
          </h1>
          <p className="uikit-sub">
            The Pharma 360 design system — tokens &amp; components. Every
            swatch, scale and primitive below is pulled live from the same
            code that drives the <code>/dols</code> surface.
          </p>
        </header>

        <div className="uikit-body">
          <aside className="uikit-rail" aria-label="Sections">
            <button
              type="button"
              className="uikit-rail-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑ Top
            </button>
            {NAV_GROUPS.map((g) => (
              <div key={g.label} className="uikit-rail-group">
                <span className="uikit-rail-grouplabel">{g.label}</span>
                <div className="uikit-rail-chips">
                  {g.items.map((it) => (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      className="uikit-rail-chip"
                      data-active={active === it.id ? "true" : undefined}
                    >
                      {it.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div className="uikit-content">
            <ColorSection />
            <SpacingSection />
            <TypeSection />
            <RadiusMotionSection />
            <ComponentsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ COLOR ============================ */
function SwatchGrid({ items }: { items: Swatch[] }) {
  return (
    <div className="uikit-swatches">
      {items.map((s) => (
        <div key={s.token} className="uikit-swatch">
          <div className="uikit-swatch-chip" style={{ background: s.hex }} />
          <div className="uikit-swatch-meta">
            <span className="uikit-swatch-name">{s.name}</span>
            <span className="uikit-swatch-token tabular">{s.hex}</span>
            <span className="uikit-swatch-token">{s.token}</span>
            <span className="uikit-swatch-role">{s.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorSection() {
  return (
    <section id="color" className="uikit-section">
      <div className="uikit-section-head">
        <span className="uikit-section-num">01</span>
        <h2 className="uikit-section-title">Color</h2>
        <p className="uikit-section-desc">
          Dark-first. Deep navy canvas, one cyan/teal primary family, and a
          small categorical accent set. Rule: at most four dominant accents
          per screen; one accent owns one entity (card / KPI).
        </p>
      </div>

      <div className="uikit-group">
        <div className="uikit-group-label">Surfaces &amp; background</div>
        <SwatchGrid items={SURFACE_SWATCHES} />
      </div>
      <div className="uikit-group">
        <div className="uikit-group-label">Primary — cyan / teal</div>
        <SwatchGrid items={PRIMARY_SWATCHES} />
      </div>
      <div className="uikit-group">
        <div className="uikit-group-label">Categorical accents</div>
        <SwatchGrid items={ACCENT_SWATCHES} />
      </div>
      <div className="uikit-group">
        <div className="uikit-group-label">Text &amp; lines</div>
        <SwatchGrid items={TEXT_SWATCHES} />
      </div>
    </section>
  );
}

/* ============================ SPACING ============================ */
function SpacingSection() {
  return (
    <section id="spacing" className="uikit-section">
      <div className="uikit-section-head">
        <span className="uikit-section-num">02</span>
        <h2 className="uikit-section-title">Spacing</h2>
        <p className="uikit-section-desc">
          Strict 8-px grid: 2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 56 / 64.
          12 is the one allowed half-step. 20 / 28 / 36 / 44 are banned.
        </p>
      </div>
      <div className="uikit-spacing">
        {SPACING.map((s) => (
          <div key={s.v} className="uikit-spacing-row">
            <span className="uikit-spacing-key tabular">
              {s.v}
              <span>px{s.half ? " · half-step" : ""}</span>
            </span>
            <div className="uikit-spacing-bar" style={{ width: s.v }} />
          </div>
        ))}
        {BANNED_SPACING.map((v) => (
          <div key={v} className="uikit-spacing-row banned">
            <span className="uikit-spacing-key tabular">
              {v}
              <span>px · banned</span>
            </span>
            <div className="uikit-spacing-bar" style={{ width: v }} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ TYPE ============================ */
function TypeSection() {
  return (
    <section id="type" className="uikit-section">
      <div className="uikit-section-head">
        <span className="uikit-section-num">03</span>
        <h2 className="uikit-section-title">Type</h2>
        <p className="uikit-section-desc">
          One typeface — Inter — across the whole product; hierarchy comes
          from weight and size, not pairing. Round sizes only, floor 11px.
          Numbers carry tabular-nums.
        </p>
      </div>

      <div className="uikit-type">
        {TYPE_SCALE.map((t) => (
          <div key={t.px} className="uikit-type-row">
            <div className="uikit-type-meta">
              <span className="uikit-type-px tabular">
                {t.px}px · {t.w}
              </span>
              <span className="uikit-type-role">{t.role}</span>
            </div>
            <div
              className="uikit-type-specimen"
              style={{ fontSize: t.px, fontWeight: t.w }}
            >
              Digital opinion leaders, decoded
            </div>
          </div>
        ))}
      </div>

      <div className="uikit-group">
        <div className="uikit-group-label">Weights in use</div>
        <div className="uikit-weights">
          {[
            { w: 400, name: "Regular" },
            { w: 500, name: "Medium" },
            { w: 600, name: "Semibold" },
            { w: 700, name: "Bold" },
          ].map((x) => (
            <div key={x.w} className="uikit-weight">
              <div className="uikit-weight-sample" style={{ fontWeight: x.w }}>
                Aa
              </div>
              <div className="uikit-weight-name">
                {x.name} · {x.w}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ RADIUS + MOTION ============================ */
function RadiusMotionSection() {
  return (
    <section id="radius" className="uikit-section">
      <div className="uikit-section-head">
        <span className="uikit-section-num">04</span>
        <h2 className="uikit-section-title">Radius &amp; Motion</h2>
        <p className="uikit-section-desc">
          Radii scale from 6px (chips) to fully round (pills, avatars). Motion
          is restrained: one standard easing, short durations, hover never
          brighter than active.
        </p>
      </div>

      <div className="uikit-group">
        <div className="uikit-group-label">Radius</div>
        <div className="uikit-radii">
          {RADII.map((r) => (
            <div key={r.name} className="uikit-radius">
              <div
                className="uikit-radius-box"
                style={{ borderRadius: `var(${r.token})` }}
              />
              <div className="uikit-radius-meta">
                <span className="uikit-radius-name">{r.name}</span>
                <span className="uikit-radius-val tabular">
                  {r.px === 999 ? "full" : r.px + "px"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="uikit-group">
        <div className="uikit-group-label">Motion — easings &amp; durations</div>
        <div className="uikit-motion">
          {MOTION.map((m) => (
            <div key={m.name} className="uikit-motion-row">
              <span className="uikit-motion-name">{m.name}</span>
              <span className="uikit-motion-val">
                {m.val}
                <span className="uikit-motion-use">{m.use}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ COMPONENTS ============================ */
function Stage({
  name,
  desc,
  children,
  wip,
  span2,
  full,
  stageClass,
  flag,
  id,
}: {
  name: string;
  desc: string;
  children: React.ReactNode;
  wip?: boolean;
  span2?: boolean;
  full?: boolean;
  stageClass?: string;
  flag?: string;
  id?: string;
}) {
  return (
    <div id={id} className={"uikit-card" + (span2 ? " span-2" : "") + (full ? " span-full" : "") + (wip ? " wip" : "")}>
      <div className="uikit-card-head">
        <div className="uikit-card-titles">
          <span className="uikit-card-name">{name}</span>
          <span className="uikit-card-desc">{desc}</span>
        </div>
        {flag ? <span className="uikit-card-flag">{flag}</span> : null}
      </div>
      <div className={"uikit-stage" + (stageClass ? " " + stageClass : "")}>
        {children}
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <section id="components" className="uikit-section">
      <div className="uikit-section-head">
        <span className="uikit-section-num">05</span>
        <h2 className="uikit-section-title">Components</h2>
        <p className="uikit-section-desc">
          The real primitives from <code>components/v2</code>, rendered with
          live mock data. Interaction states (hover / selected / active) are
          frozen statically so the whole set is visible at once.
        </p>
      </div>

      <div className="uikit-cards">
        <TagStage />
        <KpiTileStage />
        <FilterChipStage />
        <IconButtonStage />
        <ChannelSelectorStage />
        <SortControlStage />
        <SocialIconStage />
        <SparklineStage />
        <PaginationStage />
        <LoaderStage />
        <AiAssistantStage />
        <EmptyStateStage />
        <CardStage />
        <KpiHeroStage />
        <ToolbarStage />
        <SidebarStage />
      </div>
    </section>
  );
}

/* ---- Tag / chip ---- */
function TagStage() {
  const tierOrder: Tier[] = ["Micro", "Rising", "Mid Tier", "Macro", "Elite"];
  return (
    <Stage
      id="tags"
      name="Tag / chip"
      desc="Three roles — tier (size-ramp + graduated star), specialty (neutral sphere), type+group (green meta key/value). Pill, uppercase-ish, 11px."
      stageClass="align-start column"
    >
      <div className="uikit-variant-tag">Tier ramp — color + star graduate with audience size</div>
      <div className="tags">
        {tierOrder.map((t) => {
          const tier = TIERS[t];
          const Star = tierStar[tier.star];
          return (
            <span
              key={t}
              className="tag tier"
              style={{ "--tier-color": tier.color } as CSSProperties}
            >
              <Star className="tier-star" />
              {t}
            </span>
          );
        })}
      </div>
      <div className="uikit-variant-tag" style={{ marginTop: 8 }}>
        Specialty (neutral) · Type + Group (meta)
      </div>
      <div className="tags">
        <span className="tag specialty">Bariatric Surgeon</span>
        <span className="tag specialty">Endocrinologist</span>
        <span className="tag meta">
          <span className="k">Type</span>
          <span className="v">Public</span>
        </span>
        <span className="tag meta">
          <span className="k">Group</span>
          <span className="v">A</span>
        </span>
      </div>
    </Stage>
  );
}

/* ---- KPI tile ---- */
function KpiTileStage() {
  const tiles = [
    { label: "Total DOLs", value: "234", delta: "+12", accent: "var(--teal)", icon: Icons.users },
    { label: "Avg Engagement", value: "3.84%", delta: "+0.42%", accent: "var(--magenta)", icon: Icons.trendUp },
  ];
  return (
    <Stage
      id="kpi"
      name="KPI tile"
      desc="Accent-outlined stat tile: icon + delta up top, big tabular numeral pinned to the bottom, dual corner glows."
      stageClass="no-pad"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          padding: 24,
          width: "100%",
        }}
      >
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.label}
              className="kpi"
              style={{ "--kpi-accent": t.accent } as CSSProperties}
            >
              <span className="kpi-glow-l" />
              <span className="kpi-glow-r" />
              <div className="kpi-top">
                <span className="kpi-icon">
                  <Icon />
                </span>
                <span className="kpi-delta">{t.delta}</span>
              </div>
              <div className="kpi-foot">
                <div className="kpi-val">{t.value}</div>
                <div className="kpi-label">{t.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/* ---- Filter chip (channel chips: default / hover / active) ---- */
function FilterChipStage() {
  return (
    <Stage
      name="Filter chip"
      desc="Channel selector chip in the filter sidebar. Pill with leading glyph; default → hover → active (teal tint + glow)."
      stageClass="align-start column"
    >
      <div className="uikit-variant-tag">Default · Active (.on)</div>
      <div className="chip-grid" style={{ padding: 0 }}>
        <button className="fchip" type="button">
          <Social.instagram />
          Instagram
        </button>
        <button className="fchip on" type="button">
          <Social.x />X
        </button>
        <button className="fchip" type="button">
          <Social.youtube />
          YouTube
        </button>
        <button className="fchip on" type="button">
          <Social.linkedin />
          LinkedIn
        </button>
      </div>
    </Stage>
  );
}

/* ---- Icon-button standard (40×40 + 20px Tabler) ---- */
function IconButtonStage() {
  return (
    <Stage
      id="buttons"
      name="Icon button"
      desc="Project standard — 40×40 button + 20px Tabler glyph, inline-flex centred. Idle / hover (white/8 band) / with notification dot."
      stageClass="align-start"
    >
      <div className="uikit-variant">
        <button className="menu-btn" type="button" aria-label="More">
          <Icons.dots />
        </button>
        <span className="uikit-variant-tag">Idle</span>
      </div>
      <div className="uikit-variant">
        <button
          className="menu-btn"
          type="button"
          aria-label="More"
          style={{ background: "rgba(255,255,255,0.08)", color: "var(--text)" }}
        >
          <Icons.bell />
        </button>
        <span className="uikit-variant-tag">Hover</span>
      </div>
      <div className="uikit-variant">
        <button
          className="menu-btn"
          type="button"
          aria-label="Notifications"
          style={{ position: "relative", color: "var(--text)" }}
        >
          <Icons.bell />
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 3,
              top: 3,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--magenta)",
              boxShadow: "0 0 4px var(--magenta-glow)",
              outline: "1.5px solid var(--bg)",
            }}
          />
        </button>
        <span className="uikit-variant-tag">Dot</span>
      </div>
    </Stage>
  );
}

/* ---- Channel selector / tabs ---- */
function ChannelSelectorStage() {
  const [active, setActive] = useState<Channel>("instagram");
  const channels: Channel[] = ["facebook", "instagram", "x", "linkedin", "youtube", "tiktok", "threads"];
  return (
    <Stage
      name="Channel selector"
      desc="Row of social tabs (icon-button standard). Active tab gets the channel-color underline + glow; click to switch (live)."
      span2
      stageClass="column"
    >
      <div className="channels" style={{ margin: 0 }}>
        {channels.map((c) => {
          const Icon = channelMeta[c].icon;
          return (
            <button
              key={c}
              type="button"
              className={"ch-tab" + (c === active ? " active" : "")}
              style={{ "--ch-color": channelMeta[c].color } as CSSProperties}
              title={channelMeta[c].name}
              onClick={() => setActive(c)}
            >
              <Icon />
            </button>
          );
        })}
      </div>
    </Stage>
  );
}

/* ---- Sort control (toolbar split-menu) + Filters button ---- */
function SortControlStage() {
  const cur = SORTS[1];
  return (
    <Stage
      name="Toolbar buttons"
      desc="Filters toggle (with active-count badge), result count, and the split-menu sort (label opens key menu; trailing button flips direction)."
      span2
      stageClass="align-start"
    >
      <button className="toggle-filters is-open" type="button">
        <Icons.sliders />
        Filters
        <span className="tf-badge">3</span>
      </button>
      <div className="count-badge">
        <span className="count-num tabular">234</span>
        <span className="count-label">Influencers</span>
      </div>
      <div className="sort" style={{ marginLeft: "auto" }}>
        <button type="button" className="sort-trigger">
          <Icons.sort className="sort-ico" />
          <span className="sort-label">Sort</span>
          <span className="sort-value">{cur.label}</span>
          <Icons.chevron className="chev" />
        </button>
        <button type="button" className="sort-dir" aria-label="Flip direction">
          <Icons.sortDesc />
        </button>
      </div>
    </Stage>
  );
}

/* ---- Social icons ---- */
function SocialIconStage() {
  const channels: Channel[] = ["facebook", "instagram", "x", "linkedin", "youtube", "tiktok", "threads"];
  return (
    <Stage
      id="icons"
      name="Social icons"
      desc="Tabler brand glyphs, monochrome via currentColor. Channel brand colors live in channelMeta for active/underline accents."
      stageClass="align-start"
    >
      {channels.map((c) => {
        const Icon = channelMeta[c].icon;
        return (
          <div key={c} className="uikit-variant">
            <span style={{ color: channelMeta[c].color, display: "inline-flex" }}>
              <Icon size={24} />
            </span>
            <span className="uikit-variant-tag">{channelMeta[c].name}</span>
          </div>
        );
      })}
    </Stage>
  );
}

/* ---- Sparkline (data-viz primitive) ---- */
function SparklineStage() {
  return (
    <Stage
      name="Sparkline"
      desc="Inline area+line+endpoint micro-chart for metric trends. Color-tinted gradient fill; stable gradient id seed (SSR-safe)."
      stageClass="column"
    >
      <div style={{ width: "100%", maxWidth: 220 }}>
        <Sparkline data={cardDol.spark} color="var(--teal)" seed="uikit-a" />
      </div>
      <div style={{ width: "100%", maxWidth: 220 }}>
        <Sparkline data={altDol.engSpark} color="var(--magenta)" seed="uikit-b" />
      </div>
    </Stage>
  );
}

/* ---- Pagination ---- */
function PaginationStage() {
  return (
    <Stage
      id="pagination"
      name="Pagination"
      desc="Rounded number cells; active page carries the teal→cyan gradient + teal glow. (Pattern per DESIGN-SYSTEM.md §6.6.)"
      stageClass="no-pad"
      flag="pattern"
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 24,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {["1", "2", "3", "…", "12"].map((n, i) => {
          const active = i === 1;
          return (
            <span
              key={n + i}
              className="tabular"
              style={{
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                borderRadius: "var(--r-sm)",
                fontSize: 14,
                fontWeight: 600,
                color: active ? "var(--bg)" : "var(--text-dim)",
                background: active
                  ? "linear-gradient(135deg, var(--teal), var(--cyan))"
                  : "rgba(150,170,210,0.04)",
                border: active ? "none" : "1px solid var(--line)",
                boxShadow: active ? "0 0 14px -2px var(--teal-glow)" : "none",
              }}
            >
              {n}
            </span>
          );
        })}
      </div>
    </Stage>
  );
}

/* ---- Loader / spinner ---- */
function LoaderStage() {
  return (
    <Stage
      id="loader"
      name="Loader / spinner (active state)"
      desc="Looping 3-arc spinner (dots-pinwheel) — the active / loading indicator."
      stageClass="uikit-stage--loader"
    >
      <AiLoader size={26} />
    </Stage>
  );
}

/* ---- AI assistant (the FAB) ---- */
function AiAssistantStage() {
  return (
    <Stage
      id="ai"
      name="AI assistant"
      desc="The bottom-right assistant button — dots orbit, then morph into the sparkles icon."
      stageClass="uikit-stage--ai"
    >
      <span className="uikit-ai-fab">
        <AiAssistantConstellation />
      </span>
    </Stage>
  );
}

/* ---- Empty state ---- */
function EmptyStateStage() {
  return (
    <Stage
      name="Empty state"
      desc="No-results panel — dashed frame, glyph mark, title + helper line, clear-filters CTA."
      span2
      stageClass="no-pad"
    >
      <div className="empty" style={{ width: "100%" }}>
        <div className="empty-mark">
          <Icons.emptyGlass />
        </div>
        <h4>No influencers match</h4>
        <p>
          Try loosening a filter or clearing your search to widen the result
          set.
        </p>
        <button type="button">Clear all filters</button>
      </div>
    </Stage>
  );
}

/* ---- Influencer card (default + forced hover) ---- */
function CardStage() {
  return (
    <Stage
      id="card"
      name="Influencer card"
      desc="The main object — avatar+ring, identity, tier/specialty/meta tags, bio, live channel tabs, 4-metric strip with sparklines + deltas. Default and frozen-hover (lift + tier border + glow)."
      span2
      stageClass="align-start no-pad"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          padding: 24,
          width: "100%",
        }}
      >
        <div className="uikit-variant" style={{ alignItems: "stretch" }}>
          <div className="uikit-card-frame">
            <InfluencerCard d={cardDol} />
          </div>
          <span className="uikit-variant-tag" style={{ textAlign: "center" }}>
            Default
          </span>
        </div>
        <div
          className="uikit-variant uikit-force-hover"
          style={{ alignItems: "stretch" }}
        >
          <div className="uikit-card-frame">
            <InfluencerCard d={altDol} />
          </div>
          <span className="uikit-variant-tag" style={{ textAlign: "center" }}>
            Hover (frozen)
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* ---- KPI hero (full composite) ---- */
function KpiHeroStage() {
  return (
    <Stage
      name="KPI hero"
      desc="Page-top summary band — eyebrow + gradient headline + four KPI tiles, with a −/+ minimise toggle. Full live composite."
      full
      stageClass="no-pad uikit-stage--wide"
    >
      <KpiHero />
    </Stage>
  );
}

/* ---- Toolbar (full composite) ---- */
function ToolbarStage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("followers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  return (
    <Stage
      name="Toolbar"
      desc="Filters button + result count + search (live) + split-menu sort. The complete control strip from the DOLs page."
      full
      stageClass="no-pad uikit-stage--wide"
    >
      <Toolbar
        count={234}
        total={234}
        showFilters
        onToggleFilters={() => {}}
        activeCount={2}
        query={query}
        onQuery={setQuery}
        sort={sort}
        sortDir={sortDir}
        onSort={setSort}
        onFlipDir={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
      />
    </Stage>
  );
}

/* ---- Sidebar section (filter panel, live, with a preset selection) ---- */
function SidebarStage() {
  const [filters, setFilters] = useState<FilterState>(() => {
    const f = emptyFilters();
    f.tier = ["Elite", "Macro"];
    f.country = ["Saudi Arabia"];
    return f;
  });
  const toggle = (key: string, opt: string) =>
    setFilters((f) => {
      const cur = f[key] || [];
      return {
        ...f,
        [key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
      };
    });
  return (
    <Stage
      name="Sidebar section"
      desc="Filter panel — collapsible sections, checkbox option rows with live tallies, count badges, channel chip grid. Live (toggle options)."
      span2
      stageClass="no-pad uikit-stage--filters"
    >
      <FilterPanel
        filters={filters}
        onToggle={toggle}
        onClear={() => setFilters(emptyFilters())}
      />
    </Stage>
  );
}

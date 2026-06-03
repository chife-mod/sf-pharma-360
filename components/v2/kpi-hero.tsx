"use client";

import type { CSSProperties } from "react";
import { Icons } from "./icons";

/* Hero KPI bar — sits above the toolbar. Intro copy on the left, four
 * key KPIs on the right. Muted to match the rest of the surface: soft
 * surfaces, light corner glows (not neon), accent only on the icon /
 * delta / glow. Values are representative placeholders for the demo. */

type Kpi = {
  key: string;
  label: string;
  value: string;
  delta: string;
  icon: (typeof Icons)[keyof typeof Icons];
  accent: string;
};

const KPIS: Kpi[] = [
  { key: "dols", label: "Total DOLs", value: "234", delta: "+12", icon: Icons.users, accent: "var(--teal)" },
  { key: "eng", label: "Avg Engagement", value: "3.84%", delta: "+0.42%", icon: Icons.trendUp, accent: "var(--magenta)" },
  { key: "reach", label: "Reach (30d)", value: "12.4M", delta: "+1.8M", icon: Icons.eye, accent: "var(--amber)" },
  { key: "camp", label: "Active Campaigns", value: "18", delta: "+3", icon: Icons.sparkles, accent: "var(--violet)" },
];

export function KpiHero() {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <div className="hero-intro">
        <span className="hero-eyebrow">
          <span className="hero-dot" />
          Digital Opinion Leaders
        </span>
        {/* One continuous gradient runs across the whole h1; the plain
         * words are painted back to solid white via text-fill-color, so
         * "pharma voices," and "in real time." share a single diagonal
         * blue→magenta sweep (P at top → the period after "time"). */}
        <h1 className="hero-title">
          <span className="hero-plain">The pulse of </span>pharma voices,
          <br />
          <span className="hero-plain">decoded </span>in real time.
        </h1>
        <p className="hero-sub">
          234 vetted clinicians, researchers and patient advocates across 7
          channels. Filter, score and orchestrate outreach from a single
          intelligence layer.
        </p>
      </div>

      <div className="hero-kpis">
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.key}
              className="kpi"
              style={{ "--kpi-accent": k.accent } as CSSProperties}
            >
              {/* two ambient glows echoing the page background: teal from
               * the left, violet from the right — same hue as the bg on
               * that side, just a touch brighter. */}
              <span className="kpi-glow-l" />
              <span className="kpi-glow-r" />
              <div className="kpi-top">
                <span className="kpi-icon">
                  <Icon />
                </span>
                <span className="kpi-delta">{k.delta}</span>
              </div>
              <div className="kpi-foot">
                <div className="kpi-val">{k.value}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import "./sandbox.css";

import { AiAssistant } from "@/components/ai-assistant";
import { AiAssistantDots } from "@/components/ai-assistant-dots";
import { AiAssistantSparkles } from "@/components/ai-assistant-sparkles";
import { AiAssistantTri } from "@/components/ai-assistant-tri";
import { AiAssistantRingsDots } from "@/components/ai-assistant-ringsdots";
import { AiAssistantOrbit } from "@/components/ai-assistant-orbit";
import { AiAssistantConstellation } from "@/components/ai-assistant-constellation";

/**
 * Design Sandbox — /sandbox
 *
 * Inline gallery of every AI-assistant FAB motion variant, side by
 * side, so the motion can be compared without the buttons floating
 * in the bottom-right corner. Each component is `position: fixed`
 * (.ai-fab); we render fresh instances inside `.sandbox-stage` cells
 * and de-fix them purely via scoped overrides in sandbox.css — the
 * component files are imported read-only and never edited.
 *
 * Client component because the AiAssistant* parts are "use client"
 * (and so they animate correctly under static export).
 *
 * NB: the root layout (app/layout.tsx) also mounts one of each FAB
 * fixed in the corner on every route — that's the existing global
 * chrome, owned by another track. This page only adds the inline,
 * de-fixed copies for comparison.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Variant = {
  name: string;
  file: string;
  desc: string;
  render: () => React.ReactNode;
};

const VARIANTS: Variant[] = [
  {
    name: "Woven rings",
    file: "ai-assistant.tsx",
    desc: "Gradient outline rings, draw-from-centre.",
    render: () => <AiAssistant />,
  },
  {
    name: "Dots pinwheel",
    file: "ai-assistant-dots.tsx",
    desc: "Three dots spin out arcs.",
    render: () => <AiAssistantDots />,
  },
  {
    name: "Sparkles",
    file: "ai-assistant-sparkles.tsx",
    desc: "Two-star icon, gradient stroke.",
    render: () => <AiAssistantSparkles />,
  },
  {
    name: "Tri-circles",
    file: "ai-assistant-tri.tsx",
    desc: "Three solid filled circles.",
    render: () => <AiAssistantTri />,
  },
  {
    name: "Dotted rings",
    file: "ai-assistant-ringsdots.tsx",
    desc: "Rings rendered as beads.",
    render: () => <AiAssistantRingsDots />,
  },
  {
    name: "Orbit dots",
    file: "ai-assistant-orbit.tsx",
    desc: "Dots orbit faint tracks.",
    render: () => <AiAssistantOrbit />,
  },
];

export default function SandboxPage() {
  return (
    <div className="landing sandbox">
      <header className="landing-header">
        {/* basePath-prefixed: raw <img> isn't basePath-aware, so on GH
         * Pages (/sf-pharma-360) a bare "/..." src 404s.
         * eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/pharma-360-logo.svg`} alt="SF Pharma 360" />
        <div className="landing-header__meta">
          Internal preview · not for distribution
        </div>
      </header>

      <main className="sandbox-main">
        <section className="landing-hero">
          <div className="landing-hero__label">
            <span className="landing-hero__dot" />
            <span>SF Group · Pharma vertical · Sandbox</span>
          </div>
          <h1 className="landing-hero__title">
            Design <span>sandbox</span>
          </h1>
          <p className="landing-hero__sub">
            AI-assistant motion — every variant side by side for comparison.
          </p>
        </section>

        <div className="sandbox-grid">
          {/* The merge — first cell, live */}
          <div className="sandbox-card">
            <div className="sandbox-stage">
              <AiAssistantConstellation />
            </div>
            <div className="sandbox-meta">
              <span className="sandbox-meta__name">
                Constellation — orbit × sparkles
              </span>
              <span className="sandbox-meta__file">
                ai-assistant-constellation.tsx
              </span>
              <p className="sandbox-meta__desc">
                Dots orbit, peel off and arc to the centre, then geometrically
                morph into the sparkles icon (1 big + 2 small); hold, collapse,
                return.
              </p>
            </div>
          </div>

          {VARIANTS.map((v) => (
            <div className="sandbox-card" key={v.file}>
              <div className="sandbox-stage">{v.render()}</div>
              <div className="sandbox-meta">
                <span className="sandbox-meta__name">{v.name}</span>
                <span className="sandbox-meta__file">{v.file}</span>
                <p className="sandbox-meta__desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

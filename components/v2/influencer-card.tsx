"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Icons, channelMeta } from "./icons";
import { Sparkline } from "./sparkline";
import { TIERS, fmt, type Dol } from "@/data/dols";

/* InfluencerCard — verbatim port from the v2 source bundle
 * (project/app/card.jsx). Per-card tier color drives the
 * border gradient + glow + avatar ring via CSS var --tier-color.
 */
export function InfluencerCard({ d }: { d: Dol }) {
  const tier = TIERS[d.tier];
  const [active, setActive] = useState(d.primary);
  const chMeta = channelMeta[active];

  // per-channel metric variance (feels live)
  const idx = d.channels.indexOf(active);
  const mult = 1 + (idx - d.channels.indexOf(d.primary)) * 0.06;
  const m = d.metrics;
  const cf = Math.round(m.followers * mult);
  const cp = Math.max(1, Math.round(m.posts * (0.85 + idx * 0.05)));
  const cac = Math.max(0, Math.round(m.audienceComments * mult));
  const ccm = Math.max(0, Math.round(m.commenters * mult));
  const ceng = +(m.engagement * (1 + ((idx % 3) - 1) * 0.07)).toFixed(2);

  const engColor =
    ceng >= 6 ? "var(--teal)" : ceng >= 3 ? "var(--amber)" : "var(--rose)";

  return (
    <div className="card" style={{ "--tier-color": tier.color } as CSSProperties}>
      <div className="card-glow" />

      {/* top row */}
      <div className="card-top">
        <div className="id-cluster">
          <div className="avatar">
            <div className="avatar-ring" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.photo}
              alt={d.name}
              className="avatar-photo"
              width={60}
              height={60}
            />
          </div>
          <div className="beads">
            {d.channels.map((c) => {
              const Icon = channelMeta[c].icon;
              return (
                <div
                  key={c}
                  className={"bead" + (c === active ? " live" : "")}
                  title={channelMeta[c].name}
                  style={c === active ? { color: channelMeta[c].color } : undefined}
                  onClick={() => setActive(c)}
                >
                  <Icon />
                </div>
              );
            })}
          </div>
        </div>
        <button className="menu-btn" aria-label="More">
          <Icons.dots />
        </button>
      </div>

      {/* name */}
      <h3 className="card-name">{d.name}</h3>
      <div className="card-handle">{d.handle + "  ·  " + d.city + ", " + d.country}</div>

      {/* tags */}
      <div className="tags">
        <span className={"tag tier" + (tier.star ? "" : " outline")}>
          {tier.star && (
            <svg viewBox="0 0 24 24" fill="currentColor" width={11} height={11} aria-hidden>
              <path d="M12 2.5l2.9 6.26 6.85.6-5.18 4.52 1.55 6.7L12 17.3 5.88 21.1l1.55-6.7L2.25 9.36l6.85-.6L12 2.5z" />
            </svg>
          )}
          {d.tier}
        </span>
        <span className="tag">{d.specialty}</span>
        <span className="tag tag-kv">
          <span className="k">Type </span>
          <span className="v">{d.type}</span>
        </span>
        <span className="tag tag-kv">
          <span className="k">Group </span>
          <span className="v">{d.group}</span>
        </span>
      </div>

      {/* bio */}
      <p className="card-bio">{d.bio}</p>

      {/* channel selector */}
      <div className="channels">
        {d.channels.map((c) => {
          const Icon = channelMeta[c].icon;
          return (
            <button
              key={c}
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

      {/* metrics */}
      <div className="metrics">
        <Metric
          icon={Icons.users}
          label="Followers"
          value={fmt(cf)}
          spark={d.spark}
          color={chMeta.color}
          sparkSeed={`${d.id}-foll`}
        />
        <Metric icon={Icons.doc} label="Posts" value={fmt(cp)} delta={(d.seed % 9) - 3} />
        <Metric
          icon={Icons.comment}
          label="Comments"
          value={fmt(cac)}
          delta={(d.seed % 11) - 4}
        />
        <Metric
          icon={Icons.commenters}
          label="Commenters"
          value={fmt(ccm)}
          delta={(d.seed % 7) - 2}
        />
        <Metric
          icon={Icons.pulse}
          label="Engagement"
          value={ceng + "%"}
          accent
          color={engColor}
          spark={d.engSpark}
          sparkSeed={`${d.id}-eng`}
        />
      </div>
    </div>
  );
}

type IconCmp = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { size?: number | string; stroke?: number | string }
>;

function Metric({
  icon: IconCmp,
  label,
  value,
  accent,
  spark,
  color,
  delta,
  sparkSeed,
}: {
  icon: IconCmp;
  label: string;
  value: string;
  accent?: boolean;
  spark?: number[];
  color?: string;
  delta?: number;
  sparkSeed?: string;
}) {
  return (
    <div className="metric">
      <div className="metric-head">
        {IconCmp ? <IconCmp /> : null}
        <span className="metric-label">{label}</span>
      </div>
      <div
        className={"metric-val" + (accent ? " accent" : "")}
        style={accent ? ({ "--metric-accent": color } as CSSProperties) : undefined}
      >
        {value}
      </div>
      {spark && sparkSeed ? (
        <div className="metric-spark">
          <Sparkline data={spark} color={color ?? "var(--teal)"} seed={sparkSeed} />
        </div>
      ) : delta != null ? (
        <div className={"metric-delta " + (delta >= 0 ? "up" : "down")}>
          {delta >= 0 ? <Icons.arrowUp /> : <Icons.arrowDownRight />}
          <span>{Math.abs(delta) + "%"}</span>
        </div>
      ) : null}
    </div>
  );
}

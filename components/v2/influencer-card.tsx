"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Icons, channelMeta, tierStar } from "./icons";
import { Sparkline } from "./sparkline";
import { TIERS, fmt, type Dol } from "@/data/dols";

/* InfluencerCard — v2 card. The whole card is a stretched link to the
 * DOL detail page; interactive controls (favorite star, compare checkbox,
 * report button, channel tabs) sit above the link via z-index. */
export function InfluencerCard({
  d,
  isFav = false,
  onToggleFav,
  inCompare = false,
  onToggleCompare,
  onReport,
}: {
  d: Dol;
  isFav?: boolean;
  onToggleFav?: (id: string) => void;
  inCompare?: boolean;
  onToggleCompare?: (id: string) => void;
  onReport?: (id: string) => void;
}) {
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
  const ceng = +(m.engagement * (1 + ((idx % 3) - 1) * 0.07)).toFixed(2);

  const engColor =
    ceng >= 6 ? "var(--teal)" : ceng >= 3 ? "var(--amber)" : "var(--rose)";

  const TierStar = tierStar[tier.star];

  return (
    <div
      className={"card" + (inCompare ? " is-comparing" : "")}
      style={{ "--tier-color": tier.color } as CSSProperties}
    >
      {/* stretched link — whole card navigates to detail */}
      <Link href={`/dols/${d.id}`} className="card-link" aria-label={`Open ${d.name}`} />
      <div className="card-glow" />

      {/* hover/persistent actions (above the link) */}
      <div className="card-actions">
        <button
          type="button"
          className={"card-act card-check" + (inCompare ? " on" : "")}
          aria-pressed={inCompare}
          title="Select to compare"
          onClick={() => onToggleCompare?.(d.id)}
        >
          <Icons.check />
        </button>
        <button
          type="button"
          className="card-act card-report"
          title="Create report"
          onClick={() => onReport?.(d.id)}
        >
          <Icons.doc />
        </button>
        <button
          type="button"
          className={"card-fav" + (isFav ? " on" : "")}
          aria-pressed={isFav}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={() => onToggleFav?.(d.id)}
        >
          {isFav ? <Icons.starFull /> : <Icons.star />}
        </button>
      </div>

      {/* top row — avatar + name/handle */}
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
          <div className="id-text">
            <h3 className="card-name">{d.name}</h3>
            <div className="card-handle">
              {d.handle + "  ·  " + d.city + ", " + d.country}
            </div>
          </div>
        </div>
      </div>

      {/* tags */}
      <div className="tags">
        <span className="tag tier">
          <TierStar className="tier-star" />
          {d.tier}
        </span>
        <span className="tag specialty">{d.specialty}</span>
        <span className="tag meta">
          <span className="k">Type</span>
          <span className="v">{d.type}</span>
        </span>
        <span className="tag meta">
          <span className="k">Group</span>
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
          {delta >= 0 ? <Icons.arrowUp /> : <Icons.arrowDown />}
          <span>{Math.abs(delta) + "%"}</span>
        </div>
      ) : null}
    </div>
  );
}

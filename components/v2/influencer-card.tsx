"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons, channelMeta, tierStar } from "./icons";
import { Sparkline } from "./sparkline";
import { TIERS, fmt, type Dol } from "@/data/dols";

/* InfluencerCard — v2 card. The whole card is a stretched link to the DOL
 * detail page; interactive controls sit above it via z-index. Hover reveals
 * a Compare checkbox + a ⋮ kebab (favorites / report / dashboard / view).
 * Favorited cards show a persistent gold star badge. */
export function InfluencerCard({
  d,
  isFav = false,
  onToggleFav,
  inCompare = false,
  onToggleCompare,
  onReport,
  onDashboard,
}: {
  d: Dol;
  isFav?: boolean;
  onToggleFav?: (id: string) => void;
  inCompare?: boolean;
  onToggleCompare?: (id: string) => void;
  onReport?: (id: string) => void;
  onDashboard?: (id: string) => void;
}) {
  const tier = TIERS[d.tier];
  const router = useRouter();
  const [active, setActive] = useState(d.primary);
  const [menuOpen, setMenuOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);
  const chMeta = channelMeta[active];

  // close the kebab menu on any click outside it
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!kebabRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

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

  // helper: run an action without triggering the stretched link
  const act = (fn?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn?.();
  };

  return (
    <div
      className={"card" + (inCompare ? " is-comparing" : "") + (menuOpen ? " menu-open" : "")}
      style={{ "--tier-color": tier.color } as CSSProperties}
    >
      {/* stretched link — whole card navigates to detail */}
      <Link href={`/dols/${d.id}`} className="card-link" aria-label={`Open ${d.name}`} />
      <div className="card-glow" />

      {/* actions (above the link). Compare + kebab reveal on hover;
          the gold favorite badge is persistent when favorited. */}
      <div className="card-actions">
        <button
          type="button"
          className={"card-compare" + (inCompare ? " on" : "")}
          aria-pressed={inCompare}
          onClick={act(() => onToggleCompare?.(d.id))}
        >
          <span className="card-compare-box">{inCompare ? <Icons.check /> : null}</span>
          Compare
        </button>

        <div className="card-kebab-wrap" ref={kebabRef}>
          <button
            type="button"
            className={"card-kebab" + (menuOpen ? " open" : "")}
            aria-label="More actions"
            aria-expanded={menuOpen}
            onClick={act(() => setMenuOpen((o) => !o))}
          >
            <Icons.dots />
          </button>
          {menuOpen ? (
            <div className="card-menu" role="menu">
              <button type="button" className="card-menu-item" role="menuitem" onClick={act(() => { onToggleFav?.(d.id); setMenuOpen(false); })}>
                {isFav ? <Icons.starFull /> : <Icons.star />}
                {isFav ? "Remove from favorites" : "Add to favorites"}
              </button>
              <button type="button" className="card-menu-item" role="menuitem" onClick={act(() => { onReport?.(d.id); setMenuOpen(false); })}>
                <Icons.doc /> Create report
              </button>
              <button type="button" className="card-menu-item" role="menuitem" onClick={act(() => { onDashboard?.(d.id); setMenuOpen(false); })}>
                <Icons.trendUp /> Create dashboard
              </button>
              <button type="button" className="card-menu-item" role="menuitem" onClick={act(() => { setMenuOpen(false); router.push(`/dols/${d.id}`); })}>
                <Icons.eye /> View details
              </button>
            </div>
          ) : null}
        </div>

        {isFav ? (
          <button
            type="button"
            className="card-fav-badge"
            title="Remove from favorites"
            aria-label="Remove from favorites"
            onClick={act(() => onToggleFav?.(d.id))}
          >
            <Icons.starFull />
          </button>
        ) : null}
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
              onClick={act(() => setActive(c))}
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

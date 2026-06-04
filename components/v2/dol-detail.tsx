"use client";

import { useState } from "react";
import Link from "next/link";

import type { Dol } from "@/data/dols";
import { fmt, TIERS } from "@/data/dols";
import type { DolDetail, TopicChip } from "@/data/dol-detail";
import { channelMeta, Icons, tierStar } from "./icons";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* first iteration of the DOL detail / influencer profile page.
 * Rebuilt in the v2 dark system. Chrome (header, bg, .v2-shell) comes from
 * app/dols/layout.tsx. Real brand logos in the Audience snapshot are a planned
 * swap (currently brand-coloured glyphs). Disease/medication line illustrations
 * are placeholders until the Consilium set is generated. */
export function DolDetail({ dol, detail }: { dol: Dol; detail: DolDetail }) {
  const tier = TIERS[dol.tier];
  const Star = tierStar[tier.star];
  const [channel, setChannel] = useState<"all" | string>("all");

  return (
    <div className="dd">
      {/* back */}
      <Link href="/dols" className="dd-back">
        <Icons.chevron size={16} style={{ transform: "rotate(90deg)" }} /> All DOLs
      </Link>

      {/* ── profile + audience snapshot ── */}
      <section className="dd-top">
        <div className="dd-profile">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dd-avatar" src={dol.photo} alt={dol.name} width={88} height={88} />
          <div className="dd-profile-main">
            <div className="dd-namerow">
              <h1 className="dd-name">{dol.name}</h1>
              <span className="dd-handle">{dol.handle}</span>
            </div>
            <div className="dd-tags">
              <span className="dd-tag dd-tag--tier" style={{ color: tier.color }}>
                <Star size={13} /> {tier.label}
              </span>
              <span className="dd-tag">{dol.specialty}</span>
              <span className="dd-tag dd-tag--meta">Type <b>{dol.type}</b></span>
              <span className="dd-tag dd-tag--meta">Group <b>{dol.group}</b></span>
              <span className="dd-tag dd-tag--loc">{dol.city}, {dol.country}</span>
            </div>
            <p className="dd-bio">{dol.bio}</p>
            <div className="dd-cta">
              <button type="button" className="dd-btn dd-btn--primary">
                <Icons.doc size={16} /> Add to report
              </button>
              <button type="button" className="dd-btn">
                <Icons.star size={16} /> Watchlist
              </button>
              <button type="button" className="dd-btn">Export</button>
            </div>
          </div>
        </div>

        <aside className="dd-snapshot">
          <div className="dd-snapshot-head">
            <span className="dd-snapshot-title">Audience snapshot</span>
            <span className="dd-snapshot-sub">{fmt(detail.totals.followers)} total</span>
          </div>
          <ul className="dd-snapshot-list">
            {detail.audience.map((row) => {
              const meta = channelMeta[row.channel];
              const Glyph = meta.icon;
              return (
                <li key={row.channel} className="dd-snap-row">
                  <span className="dd-snap-ch">
                    <span className="dd-snap-ico" style={{ color: meta.color }}>
                      <Glyph size={16} />
                    </span>
                    {meta.name}
                  </span>
                  <span className="dd-snap-foll">{fmt(row.followers)}</span>
                  <span className="dd-snap-eng">{row.eng}%</span>
                  <span className={"dd-snap-delta" + (row.delta >= 0 ? " up" : " down")}>
                    {row.delta >= 0 ? <Icons.arrowUp size={12} /> : <Icons.arrowDown size={12} />}
                    {Math.abs(row.delta)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>
      </section>

      {/* ── toolbar: channel tabs (plates) + date range + search + ⋮ ── */}
      <div className="dd-toolbar">
        <div className="dd-tabs">
          <button
            type="button"
            className={"dd-tab" + (channel === "all" ? " is-active" : "")}
            onClick={() => setChannel("all")}
          >
            All
          </button>
          {dol.channels.map((ch) => {
            const meta = channelMeta[ch];
            const Glyph = meta.icon;
            return (
              <button
                key={ch}
                type="button"
                className={"dd-tab" + (channel === ch ? " is-active" : "")}
                onClick={() => setChannel(ch)}
                title={meta.name}
                style={channel === ch ? { color: meta.color } : undefined}
              >
                <Glyph size={16} />
              </button>
            );
          })}
        </div>
        <div className="dd-toolbar-right">
          <button type="button" className="dd-daterange">
            <Icons.chevron size={14} /> Jul 02, 2023 – Jul 02, 2024
          </button>
          <label className="dd-search">
            <Icons.search size={16} />
            <input placeholder="Search posts…" />
          </label>
          <button type="button" className="dd-icon-btn" aria-label="More"><Icons.dots size={18} /></button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="dd-kpis">
        <Kpi icon={<Icons.users size={18} />} tint="teal" value={fmt(detail.totals.followers)} label="Followers" />
        <Kpi icon={<Icons.doc size={18} />} tint="violet" value={fmt(detail.totals.posts)} label="Posts" />
        <Kpi icon={<Icons.comment size={18} />} tint="magenta" value={fmt(detail.totals.comments)} label="Comments" />
        <Kpi icon={<Icons.commenters size={18} />} tint="amber" value={fmt(detail.totals.commenters)} label="Commenters" />
        <Kpi icon={<Icons.trendUp size={18} />} tint="cyan" value={detail.totals.engagement + "%"} label="Engagement rate" />
      </div>

      {/* ── brands ── */}
      <Section num="01" title="Brands">
        <div className="dd-brands">
          <div className="dd-brands-count">
            <span className="dd-brands-n">{detail.brands.length}</span>
            <span className="dd-brands-lbl">Total brands</span>
          </div>
          <div className="dd-brand-chips">
            {detail.brands.map((b) => (
              <span key={b} className="dd-brand-chip">{b}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── expertise (diseases) + medications ── */}
      <div className="dd-two">
        <Section num="02" title="Discussed conditions">
          <div className="dd-topics">
            {detail.diseases.map((t) => <TopicTile key={t.id} t={t} />)}
          </div>
        </Section>
        <Section num="03" title="Medications">
          <div className="dd-topics">
            {detail.medications.map((t) => <TopicTile key={t.id} t={t} />)}
          </div>
        </Section>
      </div>

      {/* ── hashtags + key topics ── */}
      <div className="dd-two">
        <Section num="04" title="Top hashtags">
          <RankList items={detail.hashtags} prefix="#" />
        </Section>
        <Section num="05" title="Posts — key topics">
          <RankList items={detail.topics} />
        </Section>
      </div>

      {/* ── per-post metrics ── */}
      <Section num="06" title="Per-post averages">
        <div className="dd-perpost">
          {detail.perPost.map((m) => (
            <div key={m.key} className="dd-pp">
              <span className="dd-pp-label">{m.label}</span>
              <div className="dd-pp-row">
                <span className="dd-pp-value">{m.value}</span>
                <span className={"dd-pp-topic" + (m.up ? " up" : " down")}>
                  {m.topic} <em>topic avg</em>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── top commenters ── */}
      <Section num="07" title="Top commenters">
        <div className="dd-commenters">
          {detail.commenters.map((c) => (
            <div key={c.handle} className="dd-commenter">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.name} width={44} height={44} />
              <span className="dd-commenter-name">{c.name}</span>
              <span className="dd-commenter-handle">{c.handle}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Kpi({ icon, tint, value, label }: { icon: React.ReactNode; tint: string; value: string; label: string }) {
  return (
    <div className={"dd-kpi dd-kpi--" + tint}>
      <span className="dd-kpi-ico">{icon}</span>
      <span className="dd-kpi-value">{value}</span>
      <span className="dd-kpi-label">{label}</span>
    </div>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="dd-section">
      <div className="dd-section-head">
        <span className="dd-section-num">{num}</span>
        <h2 className="dd-section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* placeholder line-illustration tile (Consilium-generated art swaps in later) */
function TopicTile({ t }: { t: TopicChip }) {
  return (
    <div className={"dd-topic dd-tint--" + t.tint}>
      <span className="dd-topic-art" aria-hidden>
        <Icons.sparkles size={22} />
      </span>
      <span className="dd-topic-label">{t.label}</span>
      <span className="dd-topic-count">{t.count} mentions</span>
    </div>
  );
}

function RankList({ items, prefix = "" }: { items: { label: string; value: number }[]; prefix?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="dd-rank">
      {items.map((it) => (
        <li key={it.label} className="dd-rank-row">
          <span className="dd-rank-label">{prefix}{it.label}</span>
          <span className="dd-rank-bar"><span style={{ width: (it.value / max) * 100 + "%" }} /></span>
          <span className="dd-rank-val">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

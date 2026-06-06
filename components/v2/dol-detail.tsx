"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import {
  IconHeart, IconScale, IconDroplet, IconHeartbeat, IconActivity,
  IconFlame, IconMoonStars, IconStethoscope, IconPill,
} from "@tabler/icons-react";

import type { Dol, Channel } from "@/data/dols";
import { fmt, TIERS, BRAND_META } from "@/data/dols";
import type { DolDetail, TopicChip, TopicTint, RankItem } from "@/data/dol-detail";
import { mentionsFor, type Mention } from "@/data/dol-detail";
import { channelMeta, Icons, tierStar } from "./icons";
import { Sparkline } from "./sparkline";
import { SocialLogo, BrandMark } from "./brand-logos";
import { MentionsDrawer } from "./mentions-drawer";

const TINT_COLOR: Record<TopicTint, string> = {
  teal: "var(--teal-bright)",
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  magenta: "var(--magenta)",
  amber: "var(--amber)",
  blue: "var(--blue)",
};

type IconCmp = React.ComponentType<{ size?: number | string; stroke?: number | string }>;

/* relevant Tabler glyph per topic (no custom illustration round — keep the
 * existing icon system, just make each topic legible at a glance). */
const TOPIC_ICON: Record<string, IconCmp> = {
  obesity: IconScale,
  "type-2-diabetes": IconDroplet,
  hypertension: IconHeartbeat,
  "cardiovascular-disease": IconHeart,
  "metabolic-syndrome": IconActivity,
  "gerd-reflux": IconFlame,
  "sleep-apnea": IconMoonStars,
  nafld: IconStethoscope,
};
function topicIcon(t: TopicChip, isMed: boolean): IconCmp {
  if (isMed) return IconPill;
  return TOPIC_ICON[t.id] ?? Icons.sparkles;
}

export function DolDetail({ dol, detail }: { dol: Dol; detail: DolDetail }) {
  const tier = TIERS[dol.tier];
  const Star = tierStar[tier.star];
  const [channel, setChannel] = useState<Channel>(dol.primary);

  // mentions drawer
  const [drawer, setDrawer] = useState<{ open: boolean; title: string; subtitle?: string; accent: string; mentions: Mention[] }>({
    open: false, title: "", accent: "var(--teal)", mentions: [],
  });
  const openMentions = (label: string, accent: string, count?: number) =>
    setDrawer({
      open: true,
      title: label,
      subtitle: count != null
        ? `${count} mentions · ${dol.channels.length} channels`
        : `across ${dol.channels.length} channels`,
      accent,
      mentions: mentionsFor(dol, label, 7),
    });
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  // transient toast for the stub CTAs (report / watchlist / export)
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const channelTabs = (
    <div className="channels" style={{ margin: 0 }}>
      {dol.channels.map((ch) => {
        const Glyph = channelMeta[ch].icon;
        return (
          <button
            key={ch}
            type="button"
            className={"ch-tab" + (ch === channel ? " active" : "")}
            style={{ "--ch-color": channelMeta[ch].color } as CSSProperties}
            title={channelMeta[ch].name}
            onClick={() => setChannel(ch)}
          >
            <Glyph />
          </button>
        );
      })}
    </div>
  );

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
            {/* reuse the card .tag roles (tier / specialty / meta) */}
            <div className="tags" style={{ marginTop: 0, "--tier-color": tier.color } as CSSProperties}>
              <span className="tag tier"><Star className="tier-star" /> {tier.label}</span>
              <span className="tag specialty">{dol.specialty}</span>
              <span className="tag meta"><span className="k">Type</span><span className="v">{dol.type}</span></span>
              <span className="tag meta"><span className="k">Group</span><span className="v">{dol.group}</span></span>
              <span className="tag specialty">{dol.city}, {dol.country}</span>
            </div>
            <p className="dd-bio">{dol.bio}</p>
            <div className="dd-cta">
              <button type="button" className="dd-btn dd-btn--primary" onClick={() => setToast(`“${dol.name}” added to report — opens in Report Builder`)}>
                <Icons.doc size={16} /> Add to report
              </button>
              <button type="button" className="dd-btn" onClick={() => setToast(`“${dol.name}” added to watchlist`)}>
                <Icons.star size={16} /> Watchlist
              </button>
              <button type="button" className="dd-btn" onClick={() => setToast("Export started — CSV will download")}>
                Export
              </button>
            </div>
          </div>
        </div>

        <aside className="dd-snapshot">
          <div className="dd-snapshot-head">
            <span className="dd-snapshot-title">Audience snapshot</span>
            <span className="dd-snapshot-sub">{fmt(detail.totals.followers)} total</span>
          </div>
          {/* total-audience growth: sparkline replaces the old red/green pill */}
          <div className="dd-growth">
            <div className="dd-growth-meta">
              <span className="dd-growth-abs">+{fmt(detail.audienceGrowth.abs)}</span>
              <span className="dd-growth-pct up">
                <Icons.arrowUp size={12} />{detail.audienceGrowth.pct}%
              </span>
              <span className="dd-growth-cap">vs prev. period</span>
            </div>
            <div className="dd-growth-spark">
              <Sparkline data={detail.audienceTrend} color="var(--teal-bright)" seed={`aud-${dol.id}`} h={34} />
            </div>
          </div>
          <ul className="dd-snapshot-list">
            {detail.audience.map((row) => (
              <li key={row.channel} className="dd-snap-row">
                <span className="dd-snap-ch">
                  <SocialLogo channel={row.channel} size={20} />
                  {channelMeta[row.channel].name}
                </span>
                <span className="dd-snap-foll">{fmt(row.followers)}</span>
                <span className="dd-snap-eng">{row.eng}%</span>
                <span className={"dd-snap-delta" + (row.delta >= 0 ? " up" : " down")}>
                  {row.delta >= 0 ? <Icons.arrowUp size={12} /> : <Icons.arrowDown size={12} />}
                  {Math.abs(row.delta)}%
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* ── sticky bar ("прилипала") — 3 zones (cf. AAYED reference #3):
            LEFT identity · CENTER channel switcher · RIGHT tools ── */}
      <div className="dd-bar">
        <div className="dd-bar-id">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dd-bar-avatar" src={dol.photo} alt="" width={36} height={36} />
          <div className="dd-bar-idtext">
            <span className="dd-bar-name">{dol.name}</span>
            <span className="dd-bar-meta">{fmt(detail.totals.followers)} audience · {dol.channels.length} channels</span>
          </div>
        </div>
        {channelTabs}
        <div className="dd-bar-controls">
          <label className="search dd-bar-search">
            <Icons.search />
            <input placeholder="Search posts…" />
          </label>
          <button type="button" className="dd-daterange">
            <Icons.chevron size={14} /> Jun 06, 2025 – Jun 06, 2026
          </button>
          <button type="button" className="v2-icon-btn" aria-label="More"><Icons.dots size={18} /></button>
        </div>
      </div>

      {/* ── KPI strip (reuses .kpi) ── */}
      <div className="dd-kpis">
        <KpiTile accent="var(--teal)" icon={Icons.users} value={fmt(detail.totals.followers)} label="Followers" delta={`+${detail.audienceGrowth.pct}%`} />
        <KpiTile accent="var(--violet)" icon={Icons.doc} value={fmt(detail.totals.posts)} label="Posts" />
        <KpiTile accent="var(--magenta)" icon={Icons.comment} value={fmt(detail.totals.comments)} label="Comments" />
        <KpiTile accent="var(--amber)" icon={Icons.commenters} value={fmt(detail.totals.commenters)} label="Commenters" />
        <KpiTile accent="var(--cyan)" icon={Icons.trendUp} value={detail.totals.engagement + "%"} label="Engagement rate" />
      </div>

      {/* ── brands (real-ish logo chips, clickable) ── */}
      <Section num="01" title="Brands">
        <div className="dd-brands">
          <div className="dd-brands-count">
            <span className="dd-brands-n">{detail.brands.length}</span>
            <span className="dd-brands-lbl">Brands mentioned</span>
          </div>
          <div className="dd-brand-chips">
            {detail.brands.map((b) => (
              <button key={b} type="button" className="dd-brand-chip" onClick={() => openMentions(b, BRAND_META[b]?.color ?? "var(--teal)")}>
                <BrandMark name={b} size={22} />
                <span className="dd-brand-name">{b}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── discussed conditions + medications ── */}
      <div className="dd-two">
        <Section num="02" title="Discussed conditions">
          <div className="dd-topics">
            {detail.diseases.map((t) => (
              <TopicTile key={t.id} t={t} icon={topicIcon(t, false)} onOpen={openMentions} />
            ))}
          </div>
        </Section>
        <Section num="03" title="Medications">
          <div className="dd-topics">
            {detail.medications.map((t) => (
              <TopicTile key={t.id} t={t} icon={topicIcon(t, true)} onOpen={openMentions} />
            ))}
          </div>
        </Section>
      </div>

      {/* ── hashtags + key topics ── */}
      <div className="dd-two">
        <Section num="04" title="Top hashtags">
          <RankList items={detail.hashtags} prefix="#" onOpen={(l) => openMentions(l, "var(--cyan)")} />
        </Section>
        <Section num="05" title="Posts — key topics">
          <RankList items={detail.topics} onOpen={(l) => openMentions(l, "var(--violet)")} />
        </Section>
      </div>

      {/* ── audience reaction (dark zone: light-grey = what the DOL posts,
            dark-grey = how the audience reacts) ── */}
      <div className="dd-reaction">
        <div className="dd-reaction-head">
          <span className="dd-reaction-dot" />
          Audience reaction
        </div>

        <Section num="06" title="Per-post averages">
          <div className="dd-perpost">
            {detail.perPost.map((m) => {
              const Ico = m.key === "views" ? Icons.eye : m.key === "likes" ? IconHeart : Icons.comment;
              return (
                <div key={m.key} className="dd-pp">
                  <div className="metric">
                    <div className="metric-head"><Ico /><span className="metric-label">{m.label}</span></div>
                    <div className="metric-val">{m.value}</div>
                    <div className="metric-spark">
                      <Sparkline data={m.spark} color={m.up ? "var(--teal)" : "var(--rose)"} seed={`pp-${dol.id}-${m.key}`} />
                    </div>
                    <div className={"metric-delta " + (m.up ? "up" : "down")}>
                      {m.up ? <Icons.arrowUp /> : <Icons.arrowDown />}
                      <span>vs {m.topic} topic avg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

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

      <MentionsDrawer
        open={drawer.open}
        onClose={closeDrawer}
        title={drawer.title}
        subtitle={drawer.subtitle}
        accent={drawer.accent}
        mentions={drawer.mentions}
      />

      {toast ? <div className="v2-toast" role="status">{toast}</div> : null}
    </div>
  );
}

/* KPI tile — reuses the .kpi structure from v2.css (hero pattern). */
function KpiTile({ icon: Ico, accent, value, label, delta }: { icon: IconCmp; accent: string; value: string; label: string; delta?: string }) {
  return (
    <div className="kpi" style={{ "--kpi-accent": accent } as CSSProperties}>
      <span className="kpi-glow-l" />
      <span className="kpi-glow-r" />
      <div className="kpi-top">
        <span className="kpi-icon"><Ico /></span>
        {delta ? <span className="kpi-delta">{delta}</span> : null}
      </div>
      <div className="kpi-foot">
        <div className="kpi-val">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
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

/* topic tile — coloured icon + label + mention-trend sparkline + a
 * dotted-underlined count signalling it opens the mentions drawer. */
function TopicTile({ t, icon: Ico, onOpen }: { t: TopicChip; icon: IconCmp; onOpen: (l: string, a: string, c?: number) => void }) {
  const color = TINT_COLOR[t.tint];
  return (
    <button type="button" className={"dd-topic dd-tint--" + t.tint} onClick={() => onOpen(t.label, color, t.count)}>
      <span className="dd-topic-art"><Ico size={22} /></span>
      <span className="dd-topic-label">{t.label}</span>
      <span className="dd-topic-spark">
        <Sparkline data={t.trend} color={color} seed={`tp-${t.id}`} h={20} />
      </span>
      <span className="dd-topic-count">{t.count} mentions</span>
    </button>
  );
}

function RankList({ items, prefix = "", onOpen }: { items: RankItem[]; prefix?: string; onOpen: (l: string) => void }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="dd-rank">
      {items.map((it) => (
        <li key={it.label} className="dd-rank-row">
          <button type="button" className="dd-rank-label" onClick={() => onOpen(prefix + it.label)}>
            {prefix}{it.label}
          </button>
          <span className="dd-rank-bar"><span style={{ width: (it.value / max) * 100 + "%" }} /></span>
          <span className="dd-rank-val">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

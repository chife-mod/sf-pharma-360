"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import {
  IconHeart, IconScale, IconDroplet, IconHeartbeat, IconActivity,
  IconFlame, IconMoonStars, IconStethoscope, IconPill,
  IconSalad, IconBarbell, IconMoodSmile, IconBabyCarriage,
} from "@tabler/icons-react";

import type { Dol, Channel } from "@/data/dols";
import { fmt, TIERS } from "@/data/dols";
import type { DolDetail, TopicChip, TopicTint, RankItem, BrandStat } from "@/data/dol-detail";
import { mentionsFor, type Mention } from "@/data/dol-detail";
import { channelMeta, Icons, tierStar } from "./icons";
import { Sparkline } from "./sparkline";
import { SocialLogo, BrandLogoTile } from "./brand-logos";
import { MentionsDrawer } from "./mentions-drawer";

const TINT_COLOR: Record<TopicTint, string> = {
  teal: "var(--teal-bright)",
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  magenta: "var(--magenta)",
  amber: "var(--amber)",
  blue: "var(--blue)",
};

/* trend colour: teal when rising, red when the series is net-declining */
const sparkColor = (data: number[]) =>
  data[data.length - 1] >= data[0] ? "var(--teal-bright)" : "var(--rose)";

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
  // selected-channel row drives the KPI strip; `sec` drives EVERYTHING below
  // the switcher (diseases, medicaments, hashtags, topics, per-post, brands,
  // comment blocks) so switching network redraws the whole page, not just KPIs.
  const chRow = detail.audience.find((a) => a.channel === channel) ?? detail.audience[0];
  const sec = detail.byChannel[channel] ?? detail.byChannel[dol.primary];

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

  // "прилипала": the influencer name appears on the sticky bar ONLY after the
  // profile block has scrolled out of view — no duplicate name while it's up top.
  const profileRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = profileRef.current;
      if (el) setStuck(el.getBoundingClientRect().bottom < 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // sticky-bar ⋮ dropdown
  const [barMenuOpen, setBarMenuOpen] = useState(false);
  const barMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!barMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!barMenuRef.current?.contains(e.target as Node)) setBarMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [barMenuOpen]);

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
      {/* ── hero: 3 columns (profile · summary · by-network) with a label
          row — "All DOLs" over the profile, "Audience & engagement rate"
          over the two audience tiles, both on one baseline ── */}
      <section className="dd-hero">
        <Link href="/dols" className="dd-hero-back">
          <Icons.chevron size={15} style={{ transform: "rotate(90deg)" }} /> All DOLs
        </Link>
        <h2 className="dd-hero-audtitle">Audience &amp; engagement rate</h2>

        <div className="dd-profile" ref={profileRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dd-avatar" src={dol.photo} alt={dol.name} width={112} height={112} />
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
              <span className="tag meta"><span className="k">Gender</span><span className="v">{dol.gender}</span></span>
              <span className="tag specialty">{dol.city}, {dol.country}</span>
            </div>
            <p className="dd-bio">{dol.bio}</p>
            <div className="dd-cta">
              <button type="button" className="dd-btn dd-btn--primary" onClick={() => setToast(`“${dol.name}” added to report — opens in Report Builder`)}>
                <Icons.doc size={16} /> Create report
              </button>
              <button type="button" className="dd-btn" onClick={() => setToast(`Building dashboard for “${dol.name}”…`)}>
                <Icons.trendUp size={16} /> Create dashboard
              </button>
              <button type="button" className="dd-btn" onClick={() => setToast(`“${dol.name}” added to favorites`)}>
                <Icons.star size={16} /> Add to favorites
              </button>
            </div>
          </div>
        </div>

        <div className="dd-aud-card dd-aud-summary">
          <div className="dd-aud-shead">
            <span className="dd-aud-eyebrow">Summary</span>
            <span className="dd-aud-growth"><Icons.arrowUp size={13} /> {detail.audienceGrowth.pct}%</span>
          </div>
          <div className="dd-aud-total">{fmt(detail.totals.followers)}</div>
          <div className="dd-aud-sub">total audience · {dol.channels.length} channels</div>
          <div className="dd-aud-bigspark">
            <Sparkline data={detail.audienceTrend} color={sparkColor(detail.audienceTrend)} seed={`sum-${dol.id}`} h={84} />
          </div>
          <div className="dd-aud-engrow">
            <span className="dd-aud-engval">{detail.totals.engagement}%</span>
            <span className="dd-aud-englbl">Avg engagement rate</span>
          </div>
        </div>

        <div className="dd-aud-card dd-aud-network">
          <div className="dd-snapshot-head">
            <span className="dd-snapshot-title">By network</span>
          </div>
          {/* column headers so every number is labelled (cf. original) */}
          <div className="dd-snap-colhead">
            <span />
            <span className="dd-snap-hcol">Audience</span>
            <span className="dd-snap-hcol">Eng rate</span>
            <span className="dd-snap-hcol dd-snap-htrend">Trend</span>
          </div>
          {/* per channel: audience + engagement rate + trend sparkline
              (teal rising / red falling). The row links to that channel. */}
          <ul className="dd-snapshot-list">
            {detail.audience.map((row) => {
              const meta = channelMeta[row.channel];
              return (
                <li key={row.channel}>
                  <button
                    type="button"
                    className="dd-snap-row"
                    title={`Open ${meta.name}`}
                    onClick={() => setToast(`Opening ${meta.name} profile…`)}
                  >
                    <span className="dd-snap-ch">
                      <SocialLogo channel={row.channel} size={20} />
                      {meta.name}
                    </span>
                    <span className="dd-snap-foll">{fmt(row.followers)}</span>
                    <span className="dd-snap-eng">{row.eng}%</span>
                    <span className="dd-snap-spark">
                      <Sparkline data={row.trend} color={sparkColor(row.trend)} seed={`sn-${dol.id}-${row.channel}`} h={20} fill={false} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── sticky bar ("прилипала") — 3 zones (cf. AAYED reference #3):
            LEFT identity · CENTER channel switcher · RIGHT tools ── */}
      <div className={"dd-bar dd-bar-detail" + (stuck ? " is-stuck" : "")}>
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
          <div className="dd-bar-menuwrap" ref={barMenuRef}>
            <button type="button" className="v2-icon-btn" aria-label="More actions" aria-expanded={barMenuOpen} onClick={() => setBarMenuOpen((o) => !o)}>
              <Icons.dots size={18} />
            </button>
            {barMenuOpen ? (
              <div className="card-menu dd-bar-menu" role="menu">
                <button type="button" className="card-menu-item" onClick={() => { setBarMenuOpen(false); setToast(`“${dol.name}” added to report — opens in Report Builder`); }}>
                  <Icons.doc /> Create report
                </button>
                <button type="button" className="card-menu-item" onClick={() => { setBarMenuOpen(false); setToast(`Building dashboard for “${dol.name}”…`); }}>
                  <Icons.trendUp /> Create dashboard
                </button>
                <button type="button" className="card-menu-item" onClick={() => { setBarMenuOpen(false); setToast(`“${dol.name}” added to favorites`); }}>
                  <Icons.star /> Add to favorites
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── KPI strip (reuses .kpi) ── */}
      <div className="dd-kpis">
        <KpiTile accent="var(--teal)" icon={Icons.users} value={fmt(chRow.followers)} label="Followers" delta={`${chRow.delta >= 0 ? "+" : ""}${chRow.delta}%`} />
        <KpiTile accent="var(--violet)" icon={Icons.doc} value={fmt(chRow.posts)} label="Posts" />
        <KpiTile accent="var(--magenta)" icon={Icons.comment} value={fmt(chRow.comments)} label="Comments" />
        <KpiTile accent="var(--amber)" icon={Icons.commenters} value={fmt(chRow.commenters)} label="Commenters" />
        <KpiTile accent="var(--cyan)" icon={Icons.trendUp} value={chRow.eng + "%"} label="Engagement rate" />
      </div>

      {/* ── diseases + medicaments ── */}
      <div className="dd-two">
        <Section num="01" title="Diseases">
          <div className="dd-topics">
            {sec.diseases.map((t) => (
              <TopicTile key={t.id} t={t} icon={topicIcon(t, false)} onOpen={openMentions} />
            ))}
          </div>
        </Section>
        <Section num="02" title="Medicaments">
          <div className="dd-topics">
            {sec.medications.map((t) => (
              <TopicTile key={t.id} t={t} icon={topicIcon(t, true)} onOpen={openMentions} />
            ))}
          </div>
        </Section>
      </div>

      {/* ── hashtags + key topics ── */}
      <div className="dd-two">
        <Section num="03" title="Hashtags">
          <RankList items={sec.hashtags} prefix="#" onOpen={(l) => openMentions(l, "var(--cyan)")} />
        </Section>
        <Section num="04" title="Posts: Key topics">
          <RankList items={sec.topics} onOpen={(l) => openMentions(l, "var(--violet)")} />
        </Section>
      </div>

      {/* ── audience reaction (dark zone: light-grey = what the DOL posts,
            dark-grey = how the audience reacts) ── */}
      <div className="dd-reaction">
        <div className="dd-reaction-head">
          <span className="dd-reaction-dot" />
          Audience reaction
        </div>

        <Section num="05" title="Per-post averages">
          <div className="dd-perpost">
            {sec.perPost.map((m) => {
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

        <Section num="06" title="Average views per brand">
          <BrandViews stats={sec.brandStats} />
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

        <div className="dd-two">
          <Section num="08" title="Comments insights">
            <BarList items={sec.commentsInsights} />
          </Section>
          <Section num="09" title="Commenters interest profile">
            <BarList items={sec.commentersInterest} icons />
          </Section>
        </div>
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

const INTEREST_ICON: Record<string, IconCmp> = {
  "Health & Wellness": IconHeart,
  "Nutrition": IconSalad,
  "Fitness": IconBarbell,
  "Parenting": IconBabyCarriage,
  "Lifestyle": IconMoodSmile,
  "Beauty": Icons.sparkles,
};

/* static ranked bar list — for the audience-reaction blocks
 * (Comments insights / Commenters interest profile). Not clickable. */
function BarList({ items, icons }: { items: RankItem[]; icons?: boolean }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="dd-rank">
      {items.map((it) => {
        const Ico = icons ? INTEREST_ICON[it.label] ?? Icons.users : null;
        return (
          <li key={it.label} className="dd-rank-row">
            <span className="dd-bar-label">
              {Ico ? <Ico size={15} /> : null}
              {it.label}
            </span>
            <span className="dd-rank-bar"><span style={{ width: (it.value / max) * 100 + "%" }} /></span>
            <span className="dd-rank-val">{it.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* Average views per brand — Views / Likes / Comments switcher + a grid of
 * brand cards: real MinIO logo seated in a white tile, the metric value
 * big underneath, a thin relative bar for at-a-glance magnitude. Replaces
 * the old name·······bar·value row (huge empty gap from name to bar). */
function BrandViews({ stats }: { stats: BrandStat[] }) {
  const [metric, setMetric] = useState<"views" | "likes" | "comments">("views");
  const rows = [...stats].sort((a, b) => b[metric] - a[metric]);
  const max = Math.max(...rows.map((s) => s[metric]), 1);
  const label = { views: "avg. views", likes: "avg. likes", comments: "avg. comments" }[metric];
  return (
    <div className="dd-brandviews">
      <div className="dd-bv-tabs">
        {(["views", "likes", "comments"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={"dd-bv-tab" + (m === metric ? " active" : "")}
            onClick={() => setMetric(m)}
          >
            {m[0].toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <ul className="dd-bv-grid">
        {rows.map((s) => (
          <li key={s.brand} className="dd-bv-card">
            <BrandLogoTile name={s.brand} />
            <div className="dd-bv-val">{fmt(s[metric])}</div>
            <div className="dd-bv-cap">{label}</div>
            <span className="dd-bv-bar" aria-hidden>
              <span style={{ width: (s[metric] / max) * 100 + "%" }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

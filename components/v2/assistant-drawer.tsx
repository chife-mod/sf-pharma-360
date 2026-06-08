"use client";

/* AI Copilot drawer — iteration 4 (mock, no LLM).
 * Layout = [ history rail | chat ]. The body reads as a PIPELINE top→bottom:
 *   1. Content  — what data (dropdown)
 *   2. Filters  — narrow it (tags + themes; few shown + "＋" → categorised
 *                 picker for the many; this is the >5 overflow pattern)
 *   3. Summary  — auto overview that REACTS to content+filters (sits right
 *                 under the filters so the cause→effect is obvious)
 *   4. Prompts  — only actions (analysis); deeper questions
 * Opened by the constellation FAB ("sf-open-assistant"). */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import "./assistant-drawer.css";
import {
  IconX, IconArrowsDiagonal, IconArrowsDiagonalMinimize2, IconPlus, IconSearch,
  IconInfoCircle, IconSparkles, IconPinned, IconBookmark, IconArrowUp, IconMessage2,
  IconChevronDown, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconAdjustmentsHorizontal, IconFilter, IconWand,
} from "@tabler/icons-react";

import { DOLS, type Channel } from "@/data/dols";
import { SocialLogo } from "./brand-logos";
import {
  PROMPT_GROUPS, ALL_PROMPTS, DYNAMIC_SUGGESTIONS, HISTORY_THREADS, SOURCES,
  CONTENT_TYPES, TAGS_BY_CONTENT, THEMES, answerFor, scopeSummary, type PromptDef,
} from "@/data/assistant";
import { VersionSwitch, type DrawerVersionProps } from "./assistant-version-switch";

const PERIOD = "Jun 07, 2025 – Jun 07, 2026"; // fixed (no Date in static export)
const ANALYSIS = ALL_PROMPTS.filter((p) => p.kind === "analysis"); // actions (14)
const COMMON_PROMPTS = ANALYSIS.filter((p) => p.common); // inline (5); rest in picker

type Scope = { name: string; channelId: Channel | null; channelLabel: string };
type Msg = { key: number; prompt: string; text: string };
type Filt = { id: string; label: string; count: string; group: string };

function useScope(): Scope {
  const pathname = usePathname() || "";
  return useMemo(() => {
    const m = pathname.match(/\/dols\/([^/]+)/);
    const dol = m ? DOLS.find((d) => d.id === m[1]) : undefined;
    if (dol) return { name: dol.name, channelId: dol.primary, channelLabel: dol.primary[0].toUpperCase() + dol.primary.slice(1) };
    return { name: "All DOLs", channelId: null, channelLabel: "All channels" };
  }, [pathname]);
}

const PLATFORM_DOT: Record<string, string> = {
  X: "var(--text)", Instagram: "var(--magenta)", TikTok: "var(--cyan)",
  Snapchat: "var(--amber)", LinkedIn: "var(--blue)", Facebook: "var(--blue)",
};
const fmtViews = (n: number) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K" : String(n));
const parseCount = (s: string) => (/[km]/i.test(s) ? parseFloat(s) * (/m/i.test(s) ? 1e6 : 1e3) : parseFloat(s)) || 0;

function Ref({ n, id }: { n: number; id: string }) {
  const s = SOURCES[id];
  return (
    <span className="asd-ref-wrap">
      <button type="button" className="asd-ref" aria-label={`Source ${n}`}>{n}</button>
      {s ? (
        <span className="asd-ref-card" role="tooltip">
          <span className="asd-ref-top"><span className="asd-ref-author">{s.author}</span><span className="asd-ref-plat"><span className="asd-ref-dot" style={{ background: PLATFORM_DOT[s.platform] || "var(--text-dim)" }} />{s.platform}</span></span>
          <span className="asd-ref-role">{s.role} · {s.date}</span>
          <span className="asd-ref-snippet">{s.snippet}</span>
          <span className="asd-ref-foot">{s.lang} · {fmtViews(s.views)} views · <span className="asd-ref-translate">Translate</span></span>
        </span>
      ) : null}
    </span>
  );
}

function Reply({ text }: { text: string }) {
  const order: string[] = [];
  const tokens = text.split(/(\*\*[^*]+\*\*|\bid:\d+)/g).filter(Boolean);
  const nodes = tokens.map((tk, i) => {
    if (/^\*\*[^*]+\*\*$/.test(tk)) return <strong key={i}>{tk.slice(2, -2)}</strong>;
    if (/^id:\d+$/.test(tk)) {
      const id = tk.slice(3);
      let idx = order.indexOf(id);
      if (idx < 0) { order.push(id); idx = order.length - 1; }
      return <Ref key={i} n={idx + 1} id={id} />;
    }
    return <span key={i}>{tk}</span>;
  });
  return (
    <>
      <p className="asd-reply-text">{nodes}</p>
      {order.length ? (
        <div className="asd-sources">
          <div className="asd-sources-h">Sources · {order.length}</div>
          {order.map((id, i) => {
            const s = SOURCES[id];
            if (!s) return null;
            return (
              <button key={id} type="button" className="asd-source">
                <span className="asd-source-n">{i + 1}</span>
                <span className="asd-source-body"><span className="asd-source-line"><span className="asd-source-author">{s.author}</span><span className="asd-source-plat">{s.platform} · {s.date}</span></span><span className="asd-source-snippet">{s.snippet}</span></span>
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

function PromptInfo({ p }: { p: PromptDef }) {
  return (
    <div className="asd-tip" role="tooltip">
      <div className="asd-tip-row"><span className="asd-tip-k">What it does</span><span className="asd-tip-v">{p.desc}</span></div>
      <div className="asd-tip-row"><span className="asd-tip-k">Scope</span><span className="asd-tip-v">{p.scope}</span></div>
      <div className="asd-tip-row"><span className="asd-tip-k">Prompt</span><code className="asd-tip-code">{p.prompt}</code></div>
    </div>
  );
}

function Chip({ p, onRun, onInfo, infoOpen }: { p: PromptDef; onRun: (p: PromptDef) => void; onInfo: (id: string | null) => void; infoOpen: boolean }) {
  return (
    <span className="asd-chip">
      <button type="button" className="asd-chip-main" onClick={() => onRun(p)}>{p.label}</button>
      <button type="button" className="asd-chip-i" aria-label="Details" onClick={() => onInfo(infoOpen ? null : p.id)}><IconInfoCircle size={14} stroke={1.7} /></button>
      {infoOpen ? <PromptInfo p={p} /> : null}
    </span>
  );
}

/* Explore mode — a PACKED, zoomable galaxy of this DOL's data (CleanMyMac-style
 * circle packing). Level 0 = clusters (Topics, Questions, …) sized by volume,
 * packed to fill the space. Tap a cluster → zoom in: its children pack the space.
 * Tap a child → it flies into the chat as a question. Behind the "Explore" tab. */
type Cluster = { id: string; label: string; color: string; children: { label: string; n: number }[] };
const GALAXY: Cluster[] = [
  { id: "topics", label: "Topics", color: "var(--teal)", children: [
    { label: "Pre-op guidance", n: 39 }, { label: "Diet & nutrition", n: 35 }, { label: "Medication efficacy", n: 32 },
    { label: "Side effects", n: 31 }, { label: "Patient stories", n: 21 }, { label: "Surgery outcomes", n: 11 }, { label: "Clinical evidence", n: 7 } ] },
  { id: "questions", label: "Questions", color: "var(--magenta)", children: [
    { label: "Dosing", n: 18 }, { label: "Cost & access", n: 14 }, { label: "Long-term safety", n: 12 }, { label: "Eligibility", n: 9 } ] },
  { id: "diseases", label: "Diseases", color: "var(--violet)", children: [
    { label: "Obesity", n: 26 }, { label: "Hypertension", n: 16 }, { label: "Type-2 Diabetes", n: 13 }, { label: "GERD / reflux", n: 9 } ] },
  { id: "treatments", label: "Treatments", color: "var(--cyan)", children: [
    { label: "GLP-1", n: 31 }, { label: "Semaglutide", n: 18 }, { label: "Tirzepatide", n: 11 }, { label: "Metformin", n: 6 } ] },
  { id: "brands", label: "Brands", color: "var(--amber)", children: [
    { label: "Novo Nordisk", n: 22 }, { label: "Eli Lilly", n: 14 }, { label: "Pfizer", n: 7 } ] },
];

type Orb = { id: string; label: string; n: number; color: string; x: number; y: number; r: number };
/* deterministic circle-packing (no RNG): spiral-place around the origin with no
 * bounds, then normalize (scale + centre) to densely fill the 0..100 viewBox. */
function packCircles(items: { id: string; label: string; n: number; color: string }[]): Orb[] {
  const sorted = [...items].sort((a, b) => b.n - a.n);
  const maxN = sorted[0]?.n || 1;
  const placed: Orb[] = [];
  for (const it of sorted) {
    const r = 6 + 14 * Math.sqrt(it.n / maxN);
    if (!placed.length) { placed.push({ ...it, r, x: 0, y: 0 }); continue; }
    let spot: { x: number; y: number } | null = null;
    for (let a = 0; a < 600 && !spot; a += 0.2) {
      const rad = r * 0.4 + a * 0.55;
      const x = rad * Math.cos(a), y = rad * Math.sin(a);
      if (placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + r + 0.6)) spot = { x, y };
    }
    placed.push({ ...it, r, ...(spot || { x: 0, y: 0 }) });
  }
  // normalize the packed cluster to fill the viewBox (centred, padded)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of placed) { minX = Math.min(minX, p.x - p.r); maxX = Math.max(maxX, p.x + p.r); minY = Math.min(minY, p.y - p.r); maxY = Math.max(maxY, p.y + p.r); }
  const w = maxX - minX || 1, h = maxY - minY || 1, pad = 5;
  const scale = Math.min((100 - 2 * pad) / w, (100 - 2 * pad) / h);
  const ox = (100 - w * scale) / 2 - minX * scale, oy = (100 - h * scale) / 2 - minY * scale;
  return placed.map((p) => ({ ...p, x: p.x * scale + ox, y: p.y * scale + oy, r: p.r * scale }));
}

function ExploreBubbles({ name, onPick }: { name: string; onPick: (label: string) => void }) {
  const [zoom, setZoom] = useState<string | null>(null);
  const cluster = zoom ? GALAXY.find((g) => g.id === zoom) : null;
  const orbs = useMemo(() => {
    const items = cluster
      ? cluster.children.map((c) => ({ id: cluster.id + "-" + c.label, label: c.label, n: c.n, color: cluster.color }))
      : GALAXY.map((g) => ({ id: g.id, label: g.label, n: g.children.reduce((a, c) => a + c.n, 0), color: g.color }));
    return packCircles(items);
  }, [cluster]);

  return (
    <div className="asd-explore">
      <div className="asd-explore-head">
        {cluster ? <button type="button" className="asd-explore-back" onClick={() => setZoom(null)}>← All clusters</button> : null}
        <span className="asd-explore-title">{cluster ? cluster.label : `Explore ${name}'s world`}</span>
        <span className="asd-explore-sub">{cluster ? "Tap a bubble — it flies into the chat as a question." : "Tap a cluster to zoom in — packed like a galaxy of this DOL."}</span>
      </div>
      <svg className="asd-galaxy" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" key={zoom || "root"}>
        {orbs.map((b) => (
          <g key={b.id} className="asd-orb" onClick={() => (cluster ? onPick(`What's the story around ${b.label.toLowerCase()}?`) : setZoom(b.id))} style={{ ["--bub" as string]: b.color }}>
            <circle cx={b.x} cy={b.y} r={b.r} className="asd-orb-c" />
            {b.r > 10 ? <text x={b.x} y={b.y - (b.r > 15 ? 1.5 : 0)} textAnchor="middle" dominantBaseline="middle" className="asd-orb-label" style={{ fontSize: Math.max(2.4, b.r * 0.2) }}>{b.label}</text> : null}
            {b.r > 15 ? <text x={b.x} y={b.y + b.r * 0.34} textAnchor="middle" dominantBaseline="middle" className="asd-orb-n" style={{ fontSize: b.r * 0.15 }}>{b.n}</text> : null}
            <title>{b.label} · {b.n}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ThreadRow({ t }: { t: { title: string; scope: string; when: string } }) {
  return (
    <button type="button" className="asd-thread"><span className="asd-thread-title">{t.title}</span><span className="asd-thread-meta">{t.scope} · {t.when}</span></button>
  );
}

/* dynamic data-suggestion as a full-width row (not a wide pill that wraps ugly).
 * Same component used inline AND in the picker → identical look. */
function SuggestRow({ d, onPick }: { d: { id: string; label: string; signal: string }; onPick: (d: { id: string; label: string }) => void }) {
  return (
    <button type="button" className="asd-suggest" onClick={() => onPick(d)}>
      <IconSparkles size={14} stroke={1.8} />
      <span className="asd-suggest-label">{d.label}</span>
      <span className="asd-suggest-sig">{d.signal}</span>
    </button>
  );
}

/* shared section header — same wording + icon inline and in the picker */
function PromptSectionLabel({ kind, children }: { kind: "dyn" | "analyze" | "filter"; children: React.ReactNode }) {
  const Icon = kind === "dyn" ? IconSparkles : kind === "analyze" ? IconWand : IconFilter;
  const color = kind === "dyn" ? "var(--magenta)" : kind === "analyze" ? "var(--teal-bright)" : "var(--amber)";
  return (
    <div className="asd-prompts-label">
      <Icon size={13} stroke={1.9} style={{ color }} /> {children}
    </div>
  );
}

export function AssistantDrawerV1({ open, onClose, version, onVersion }: DrawerVersionProps) {
  const scope = useScope();
  const [expanded, setExpanded] = useState(false);
  const [width, setWidth] = useState(760);
  const sizedRef = useRef(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [tab, setTab] = useState<"chat" | "explore">("chat");
  const [content, setContent] = useState("posts_comments");
  const [contentOpen, setContentOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [promptPickerOpen, setPromptPickerOpen] = useState(false);
  const [promptQuery, setPromptQuery] = useState("");
  const [infoId, setInfoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const keyRef = useRef(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const thinkTimer = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const contentType = CONTENT_TYPES.find((c) => c.id === content)!;
  const tags = useMemo(() => (TAGS_BY_CONTENT[content] || []).filter((t) => t.kind !== "all"), [content]);
  const allFilters: Filt[] = useMemo(
    () => [...tags.map((t) => ({ id: t.id, label: t.label, count: t.count, group: "Tags" })), ...THEMES.map((t) => ({ id: t.id, label: t.label, count: t.count, group: "Themes" }))],
    [tags],
  );
  const filterById = useMemo(() => Object.fromEntries(allFilters.map((f) => [f.id, f])), [allFilters]);

  // host owns the FAB event + open state; size on first open
  useEffect(() => {
    if (open && !sizedRef.current) {
      setWidth(Math.round(Math.min(960, Math.max(700, window.innerWidth * 0.52))));
      sizedRef.current = true;
    }
  }, [open]);

  // tags depend on content → drop active tag filters that no longer exist (themes persist)
  useEffect(() => {
    const valid = new Set([...(TAGS_BY_CONTENT[content] || []).map((t) => t.id), ...THEMES.map((t) => t.id)]);
    setActiveFilters((a) => a.filter((id) => valid.has(id)));
  }, [content]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key !== "Escape") return; if (promptPickerOpen) setPromptPickerOpen(false); else if (pickerOpen) setPickerOpen(false); else if (contentOpen) setContentOpen(false); else onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pickerOpen, promptPickerOpen, contentOpen, onClose]);

  useEffect(() => {
    if (!contentOpen) return;
    const onDoc = (e: MouseEvent) => { if (!contentRef.current?.contains(e.target as Node)) setContentOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [contentOpen]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    if (expanded) return;
    e.preventDefault();
    const move = (ev: MouseEvent) => { setWidth(Math.round(Math.min(window.innerWidth * 0.95, Math.max(560, window.innerWidth - ev.clientX)))); sizedRef.current = true; };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); document.body.style.userSelect = ""; };
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [expanded]);

  const run = useCallback((p: { id: string; label: string }) => {
    setInfoId(null);
    const k = keyRef.current++;
    setMessages((m) => [...m, { key: k, prompt: p.label, text: "" }]);
    setThinking(true);
    window.clearTimeout(thinkTimer.current);
    thinkTimer.current = window.setTimeout(() => { setMessages((m) => m.map((msg) => (msg.key === k ? { ...msg, text: answerFor(p.id, scope.name) } : msg))); setThinking(false); }, 750);
  }, [scope.name]);

  const toggleFilter = (id: string) => setActiveFilters((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const newChat = () => { setMessages([]); setThinking(false); };

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" }); }, [messages, thinking]);

  // Filters step: show active first, fill to a few, "＋ N more" opens the picker
  const inlineFilters = useMemo(() => {
    const firstFew = tags.slice(0, 4);
    const activeBeyond = tags.filter((t) => activeFilters.includes(t.id) && !firstFew.some((q) => q.id === t.id));
    return [...firstFew, ...activeBeyond];
  }, [tags, activeFilters]);
  const moreCount = tags.length - inlineFilters.length;

  const activeLabels = activeFilters.map((id) => filterById[id]?.label).filter(Boolean) as string[];
  const focusCount = activeFilters.length
    ? Math.min(...activeFilters.map((id) => parseCount(filterById[id]?.count || "0")).filter((n) => n > 0))
    : parseCount(contentType.messages);
  const summaryText = scopeSummary(scope.name, contentType.label, scope.channelLabel, activeLabels);

  const pickerGroups = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    const groups = [{ group: "Tags", items: tags.map((t) => ({ id: t.id, label: t.label, count: t.count })) }];
    return groups.map((g) => ({ group: g.group, items: q ? g.items.filter((i) => i.label.toLowerCase().includes(q)) : g.items })).filter((g) => g.items.length);
  }, [tags, pickerQuery]);

  // prompt picker (overflow): categorised Suggested · Analyze · Filtering, searchable
  // picker mirrors the inline sections 1:1 — same wording + icons:
  // Suggested from your data · Analyze · Filtering prompts
  const pickerSections = useMemo(() => {
    const q = promptQuery.trim().toLowerCase();
    const m = (s: string) => !q || s.toLowerCase().includes(q);
    const out: { group: string; kind: "dyn" | "analyze" | "filter"; dyn?: typeof DYNAMIC_SUGGESTIONS; prompts?: PromptDef[]; themes?: typeof THEMES }[] = [];
    const sug = DYNAMIC_SUGGESTIONS.filter((d) => m(d.label));
    if (sug.length) out.push({ group: "Suggested from your data", kind: "dyn", dyn: sug });
    const an = ANALYSIS.filter((p) => m(p.label));
    if (an.length) out.push({ group: "Analyze", kind: "analyze", prompts: an });
    const th = THEMES.filter((t) => m(t.label));
    if (th.length) out.push({ group: "Filtering prompts", kind: "filter", themes: th });
    return out;
  }, [promptQuery]);
  const runFromPicker = (p: { id: string; label: string }) => { setPromptPickerOpen(false); run(p); };
  const INLINE_ANALYZE = 4;
  const morePrompts = ANALYSIS.length - INLINE_ANALYZE + THEMES.length;

  if (!open) return <div className="v2-root" style={{ display: "contents" }} />;

  const panelStyle: CSSProperties = expanded ? { width: "100%" } : { width: `min(${width}px, 95vw)` };

  return (
    <div className="v2-root" style={{ display: "contents" }}>
      <div className="asd-scrim" onClick={onClose} />
      <aside className="asd" style={panelStyle} role="dialog" aria-label="AI Copilot">
        {!expanded ? <div className="asd-resize" onMouseDown={onResizeStart} aria-hidden /> : null}

        <div className="asd-cols">
        {!railCollapsed ? (
          <div className="asd-rail">
            <div className="asd-rail-head">
              <button type="button" className="asd-rail-new" onClick={newChat}><IconPlus size={15} stroke={1.9} /> New chat</button>
              <button type="button" className="asd-iconbtn" title="Collapse history" onClick={() => setRailCollapsed(true)}><IconLayoutSidebarLeftCollapse size={18} stroke={1.7} /></button>
            </div>
            <label className="asd-rail-search"><IconSearch size={14} stroke={1.7} /><input placeholder="Search chats…" /></label>
            <div className="asd-rail-scroll">
              {HISTORY_THREADS.some((t) => t.pinned) ? (<><div className="asd-rail-label"><IconPinned size={12} stroke={1.8} /> Pinned</div>{HISTORY_THREADS.filter((t) => t.pinned).map((t) => <ThreadRow key={t.id} t={t} />)}</>) : null}
              {HISTORY_THREADS.some((t) => t.saved) ? (<><div className="asd-rail-label"><IconBookmark size={12} stroke={1.8} /> Saved answers</div>{HISTORY_THREADS.filter((t) => t.saved).map((t) => <ThreadRow key={t.id} t={t} />)}</>) : null}
              <div className="asd-rail-label"><IconMessage2 size={12} stroke={1.8} /> Recent</div>
              {HISTORY_THREADS.filter((t) => !t.pinned && !t.saved).map((t) => <ThreadRow key={t.id} t={t} />)}
            </div>
          </div>
        ) : null}

        <div className="asd-main">
          <header className="asd-head">
            {railCollapsed ? <button type="button" className="asd-iconbtn" title="Show history" onClick={() => setRailCollapsed(false)}><IconLayoutSidebarLeftExpand size={18} stroke={1.7} /></button> : null}
            <div className="asd-title">
              <span className="asd-title-eyebrow"><IconSparkles size={11} stroke={2} /> AI Copilot</span>
              <span className="asd-title-name">{scope.name}</span>
            </div>
            <div className="asd-head-r">
              <button type="button" className="asd-iconbtn" aria-label={expanded ? "Collapse" : "Expand"} onClick={() => setExpanded((e) => !e)}>{expanded ? <IconArrowsDiagonalMinimize2 size={18} stroke={1.7} /> : <IconArrowsDiagonal size={18} stroke={1.7} />}</button>
              <button type="button" className="asd-iconbtn" aria-label="Close" onClick={onClose}><IconX size={18} stroke={1.7} /></button>
            </div>
          </header>

          {tab === "chat" ? (
          <>
          <div className="asd-body" ref={bodyRef}>
            {/* scope card: 1) Content  2) Filters */}
            <section className="asd-ctx">
              <div className="asd-scope-row">
                {scope.channelId ? <SocialLogo channel={scope.channelId} size={15} /> : null}
                <span>{scope.channelLabel}</span><span className="asd-scope-dot">·</span><span>{PERIOD}</span>
              </div>

              <div className="asd-step">
                <span className="asd-step-k">1 · Content</span>
                <div className="asd-ctx-dd" ref={contentRef}>
                  <button type="button" className="asd-ctx-ddbtn" onClick={() => setContentOpen((o) => !o)}>{contentType.label}<IconChevronDown size={15} stroke={1.8} /></button>
                  {contentOpen ? (
                    <div className="asd-ctx-ddmenu">
                      {CONTENT_TYPES.map((c) => (<button key={c.id} type="button" className={"asd-ctx-ddopt" + (c.id === content ? " is-active" : "")} onClick={() => { setContent(c.id); setContentOpen(false); }}>{c.label}<span className="asd-ctx-ddvol">{c.messages}</span></button>))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="asd-step">
                <span className="asd-step-k">2 · Filters <span className="asd-ctx-knote">— narrow the data</span></span>
                <div className="asd-ctx-tags">
                  {inlineFilters.map((f) => (
                    <button key={f.id} type="button" className={"asd-tagchip" + (activeFilters.includes(f.id) ? " is-active" : "")} onClick={() => toggleFilter(f.id)}>{f.label}<span className="asd-tagchip-n">{f.count}</span></button>
                  ))}
                  <button type="button" className="asd-filter-more" onClick={() => setPickerOpen(true)}>
                    <IconAdjustmentsHorizontal size={14} stroke={1.8} /> {moreCount > 0 ? `+${moreCount} more` : "All filters"}
                  </button>
                </div>
              </div>
            </section>

            {/* 3) Summary — auto, reacts to content + filters */}
            <section className="asd-summary">
              <div className="asd-summary-head">
                <span className="asd-summary-k">3 · Summary</span>
                <span className="asd-summary-auto">auto · updates with filters</span>
              </div>
              <div className="asd-summary-metrics">
                <div className="asd-sm-metric"><span className="asd-sm-val">{fmtViews(focusCount)}</span><span className="asd-sm-lbl">Messages</span></div>
                <div className="asd-sm-metric"><span className="asd-sm-val">74%</span><span className="asd-sm-lbl">Positive</span></div>
                <div className="asd-sm-metric"><span className="asd-sm-val">{activeFilters.length || "—"}</span><span className="asd-sm-lbl">Filters on</span></div>
              </div>
              <p className="asd-summary-text">{summaryText}</p>
            </section>

            {/* 4) Prompts — actions only */}
            <section className="asd-prompts">
              <span className="asd-step-k">4 · Prompts</span>
              <PromptSectionLabel kind="dyn">Suggested from your data</PromptSectionLabel>
              <div className="asd-suggests">
                {DYNAMIC_SUGGESTIONS.map((d) => <SuggestRow key={d.id} d={d} onPick={run} />)}
              </div>
              <PromptSectionLabel kind="analyze">Analyze</PromptSectionLabel>
              <div className="asd-chips">
                {COMMON_PROMPTS.slice(0, INLINE_ANALYZE).map((p) => <Chip key={p.id} p={p} onRun={run} onInfo={setInfoId} infoOpen={infoId === p.id} />)}
                <button type="button" className="asd-filter-more" onClick={() => setPromptPickerOpen(true)}>
                  <IconSearch size={14} stroke={1.8} /> +{morePrompts} more · Analyze · Filtering
                </button>
              </div>
            </section>

            <section className="asd-chat">
              {messages.map((m) => (
                <div key={m.key} className="asd-turn">
                  <div className="asd-user"><span className="asd-user-av">RE</span><span className="asd-user-q">{m.prompt}</span></div>
                  {m.text ? <div className="asd-reply"><span className="asd-reply-ctx">Messages in context: 100%</span><Reply text={m.text} /></div> : null}
                </div>
              ))}
              {thinking ? <div className="asd-thinking"><span className="asd-think-dot" /><span className="asd-think-dot" /><span className="asd-think-dot" /> Thinking…</div> : null}
            </section>
          </div>

          <div className="asd-composer">
            <input className="asd-input" placeholder="Ask your question…" />
            <button type="button" className="asd-send" aria-label="Send"><IconArrowUp size={16} stroke={2} /></button>
          </div>
          </>
          ) : (
            <ExploreBubbles name={scope.name} onPick={(label) => { setTab("chat"); run({ id: "explore", label }); }} />
          )}

          {/* bottom tabs: Copilot (structured chat) ↔ Explore (bubble discovery) */}
          <div className="asd-tabs">
            <button type="button" className={"asd-tab" + (tab === "chat" ? " is-active" : "")} onClick={() => setTab("chat")}><IconMessage2 size={16} stroke={1.7} /> Copilot</button>
            <button type="button" className={"asd-tab" + (tab === "explore" ? " is-active" : "")} onClick={() => setTab("explore")}><IconSparkles size={16} stroke={1.8} /> Explore</button>
          </div>

          {/* Filters picker — categorised (>5 overflow). Shows what to do with many. */}
          {pickerOpen ? (
            <>
              <div className="asd-pick-scrim" onClick={() => setPickerOpen(false)} />
              <div className="asd-pick" role="dialog" aria-label="Filters">
                <label className="asd-pick-search"><IconSearch size={16} stroke={1.7} /><input autoFocus value={pickerQuery} onChange={(e) => setPickerQuery(e.target.value)} placeholder="Search filters…" /></label>
                <div className="asd-pick-list">
                  {pickerGroups.map((g) => (
                    <div key={g.group} className="asd-pick-group">
                      <div className="asd-pick-glabel">{g.group}</div>
                      <div className="asd-chips">
                        {g.items.map((it) => (
                          <button key={it.id} type="button" className={"asd-tagchip" + (activeFilters.includes(it.id) ? " is-active" : "")} onClick={() => toggleFilter(it.id)}>{it.label}<span className="asd-tagchip-n">{it.count}</span></button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!pickerGroups.length ? <div className="asd-prompts-empty">No filters match “{pickerQuery}”.</div> : null}
                </div>
                <div className="asd-pick-foot">
                  <button type="button" className="asd-pick-clear" onClick={() => setActiveFilters([])}>Clear all</button>
                  <button type="button" className="asd-pick-done" onClick={() => setPickerOpen(false)}>Done · {activeFilters.length} active</button>
                </div>
              </div>
            </>
          ) : null}

          {/* Prompt library — categorised + searchable (the 7+ PROMPTS overflow).
              Click a prompt → it runs. Shows how many prompts scale gracefully. */}
          {promptPickerOpen ? (
            <>
              <div className="asd-pick-scrim" onClick={() => setPromptPickerOpen(false)} />
              <div className="asd-pick" role="dialog" aria-label="Prompt library">
                <label className="asd-pick-search"><IconSearch size={16} stroke={1.7} /><input autoFocus value={promptQuery} onChange={(e) => setPromptQuery(e.target.value)} placeholder="Search prompts…" /></label>
                <div className="asd-pick-list">
                  {pickerSections.map((s) => (
                    <div key={s.group} className="asd-pick-group">
                      <PromptSectionLabel kind={s.kind}>{s.group}</PromptSectionLabel>
                      {s.kind === "dyn" ? (
                        <div className="asd-suggests">
                          {s.dyn!.map((d) => <SuggestRow key={d.id} d={d} onPick={runFromPicker} />)}
                        </div>
                      ) : (
                        <div className="asd-chips">
                          {s.kind === "analyze" && s.prompts!.map((p) => <Chip key={p.id} p={p} onRun={runFromPicker} onInfo={setInfoId} infoOpen={infoId === p.id} />)}
                          {s.kind === "filter" && s.themes!.map((t) => (
                            <button key={t.id} type="button" className={"asd-tagchip asd-tagchip--filtering" + (activeFilters.includes(t.id) ? " is-active" : "")} onClick={() => { toggleFilter(t.id); setPromptPickerOpen(false); }}><IconFilter size={12} stroke={1.9} />{t.label}<span className="asd-tagchip-n">{t.count}</span></button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {!pickerSections.length ? <div className="asd-prompts-empty">No prompts match “{promptQuery}”.</div> : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
        </div>
        <div className="asd-foot"><VersionSwitch version={version} onVersion={onVersion} /></div>
      </aside>
    </div>
  );
}

"use client";

/* AI Copilot drawer — v2 (Vsevolod's restored construction).
 * He's the ideologist of the LEFT scope panel and didn't want it gone, so v2
 * brings it back — compact, flush to the chat — and only reorders + relocates:
 *
 *   LEFT  scope (compact):  Period → Content → Filters: Tags → Sources & Volume
 *                           (Sources & Volume sits at the BASE because it's the
 *                            RESULT — it reacts to Content + Tags).
 *   CENTER chat:            Prompts (top) → chat title → conversation → composer.
 *   RIGHT history:          the New-chat / Pinned / Saved / Recent rail he liked,
 *                           moved over from the left.
 *
 * Chat atoms (chips, tags, citations, pickers, composer, dropdown) are REUSED
 * from assistant-drawer.css so v1 and v2 read identically where they overlap.
 * Opened by the same constellation FAB; the host owns open/version. Mock, no LLM. */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import "./assistant-drawer.css"; // shared atoms (.asd-chip / .asd-tagchip / .asd-pick / .asd-reply / …)
import "./assistant-drawer-v2.css"; // v2 shell (.asd2-*)
import {
  IconX, IconArrowsDiagonal, IconArrowsDiagonalMinimize2, IconPlus, IconSearch,
  IconInfoCircle, IconSparkles, IconPinned, IconBookmark, IconArrowUp, IconMessage2,
  IconChevronDown, IconLayoutSidebarRightCollapse, IconLayoutSidebarRightExpand,
  IconAdjustmentsHorizontal, IconFilter, IconWand, IconCalendar, IconRefresh,
} from "@tabler/icons-react";

import { DOLS, type Channel } from "@/data/dols";
import {
  ALL_PROMPTS, DYNAMIC_SUGGESTIONS, HISTORY_THREADS, SOURCES,
  CONTENT_TYPES, TAGS_BY_CONTENT, THEMES, answerFor, type PromptDef,
} from "@/data/assistant";
import { VersionSwitch, type DrawerVersionProps } from "./assistant-version-switch";

const PERIOD = "Jun 07, 2025 – Jun 07, 2026"; // fixed (no Date in static export)
const ANALYSIS = ALL_PROMPTS.filter((p) => p.kind === "analysis");
const COMMON_PROMPTS = ANALYSIS.filter((p) => p.common);
const INLINE_ANALYZE = 4;

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

function SuggestRow({ d, onPick }: { d: { id: string; label: string; signal: string }; onPick: (d: { id: string; label: string }) => void }) {
  return (
    <button type="button" className="asd-suggest" onClick={() => onPick(d)}>
      <IconSparkles size={14} stroke={1.8} />
      <span className="asd-suggest-label">{d.label}</span>
      <span className="asd-suggest-sig">{d.signal}</span>
    </button>
  );
}

function PromptSectionLabel({ kind, children }: { kind: "dyn" | "analyze" | "filter"; children: React.ReactNode }) {
  const Icon = kind === "dyn" ? IconSparkles : kind === "analyze" ? IconWand : IconFilter;
  const color = kind === "dyn" ? "var(--magenta)" : kind === "analyze" ? "var(--teal-bright)" : "var(--amber)";
  return (
    <div className="asd-prompts-label">
      <Icon size={13} stroke={1.9} style={{ color }} /> {children}
    </div>
  );
}

function ThreadRow({ t }: { t: { title: string; scope: string; when: string } }) {
  return (
    <button type="button" className="asd2-thread"><span className="asd2-thread-title">{t.title}</span><span className="asd2-thread-meta">{t.scope} · {t.when}</span></button>
  );
}

export function AssistantDrawerV2({ open, onClose, version, onVersion }: DrawerVersionProps) {
  const scope = useScope();
  const [expanded, setExpanded] = useState(false);
  const [width, setWidth] = useState(1040);
  const sizedRef = useRef(false);
  const [histCollapsed, setHistCollapsed] = useState(false);
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

  // first open → size to ~62% (3 columns need a touch more room than v1)
  useEffect(() => {
    if (open && !sizedRef.current) {
      setWidth(Math.round(Math.min(1180, Math.max(960, window.innerWidth * 0.62))));
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
    const move = (ev: MouseEvent) => { setWidth(Math.round(Math.min(window.innerWidth * 0.96, Math.max(760, window.innerWidth - ev.clientX)))); sizedRef.current = true; };
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

  // Filters: show active first, fill to a few, "＋ N more" opens the picker
  const inlineFilters = useMemo(() => {
    const firstFew = tags.slice(0, 4);
    const activeBeyond = tags.filter((t) => activeFilters.includes(t.id) && !firstFew.some((q) => q.id === t.id));
    return [...firstFew, ...activeBeyond];
  }, [tags, activeFilters]);
  const moreCount = tags.length - inlineFilters.length;

  const focusCount = activeFilters.length
    ? Math.min(...activeFilters.map((id) => parseCount(filterById[id]?.count || "0")).filter((n) => n > 0))
    : parseCount(contentType.messages);
  const sourcesCount = scope.channelId ? 1 : DOLS.length;

  const pickerGroups = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    const groups = [{ group: "Tags", items: tags.map((t) => ({ id: t.id, label: t.label, count: t.count })) }];
    return groups.map((g) => ({ group: g.group, items: q ? g.items.filter((i) => i.label.toLowerCase().includes(q)) : g.items })).filter((g) => g.items.length);
  }, [tags, pickerQuery]);

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
  const morePrompts = ANALYSIS.length - INLINE_ANALYZE + THEMES.length;

  const threadTitle = messages.length ? messages[0].prompt : "New chat";

  if (!open) return <div className="v2-root" style={{ display: "contents" }} />;

  const panelStyle: CSSProperties = expanded ? { width: "100%" } : { width: `min(${width}px, 96vw)` };

  return (
    <div className="v2-root" style={{ display: "contents" }}>
      <div className="asd2-scrim" onClick={onClose} />
      <aside className="asd2" style={panelStyle} role="dialog" aria-label="AI Copilot">
        {!expanded ? <div className="asd2-resize" onMouseDown={onResizeStart} aria-hidden /> : null}

        <div className="asd2-cols">
          {/* ---------- LEFT — compact scope panel ---------- */}
          <div className="asd2-scope">
            <div className="asd2-scope-scroll">
              <div className="asd2-sec">
                <span className="asd2-sec-k">Period</span>
                <div className="asd2-period"><IconCalendar size={15} stroke={1.7} />{PERIOD}</div>
              </div>

              <div className="asd2-sec">
                <span className="asd2-sec-k">Filters: Content</span>
                <div className="asd-ctx-dd" ref={contentRef}>
                  <button type="button" className="asd-ctx-ddbtn" onClick={() => setContentOpen((o) => !o)}>{contentType.label}<IconChevronDown size={15} stroke={1.8} /></button>
                  {contentOpen ? (
                    <div className="asd-ctx-ddmenu">
                      {CONTENT_TYPES.map((c) => (<button key={c.id} type="button" className={"asd-ctx-ddopt" + (c.id === content ? " is-active" : "")} onClick={() => { setContent(c.id); setContentOpen(false); }}>{c.label}<span className="asd-ctx-ddvol">{c.messages}</span></button>))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="asd2-sec">
                <span className="asd2-sec-k">Filters: Tags <span className="asd2-sec-n">{tags.length}</span></span>
                <div className="asd-ctx-tags">
                  {inlineFilters.map((f) => (
                    <button key={f.id} type="button" className={"asd-tagchip" + (activeFilters.includes(f.id) ? " is-active" : "")} onClick={() => toggleFilter(f.id)}>{f.label}<span className="asd-tagchip-n">{f.count}</span></button>
                  ))}
                  <button type="button" className="asd-filter-more" onClick={() => setPickerOpen(true)}>
                    <IconAdjustmentsHorizontal size={14} stroke={1.8} /> {moreCount > 0 ? `+${moreCount} more` : "All filters"}
                  </button>
                </div>
              </div>
            </div>

            {/* Sources & Volume — pinned base, reacts to content + tags */}
            <div className="asd2-sv">
              <div className="asd2-sv-head">
                <span className="asd2-sv-k">Sources &amp; Volume</span>
                <span className="asd2-sv-react"><IconRefresh size={12} stroke={1.8} /> reacts</span>
              </div>
              <div className="asd2-sv-row">
                <div className="asd2-sv-stat"><span className="asd2-sv-val">{sourcesCount}</span><span className="asd2-sv-lbl">{sourcesCount === 1 ? "Source" : "Sources"}</span></div>
                <div className="asd2-sv-div" />
                <div className="asd2-sv-stat"><span className="asd2-sv-val">{fmtViews(focusCount)}</span><span className="asd2-sv-lbl">{activeFilters.length ? "Messages" : "All Messages"}</span></div>
              </div>
            </div>
          </div>

          {/* ---------- CENTER — chat ---------- */}
          <div className="asd2-main">
            <header className="asd2-head">
              <div className="asd2-title">
                <span className="asd2-eyebrow"><IconSparkles size={11} stroke={2} /> AI Copilot</span>
                <span className="asd2-name">{scope.name}</span>
              </div>
              <div className="asd2-head-r">
                {histCollapsed ? <button type="button" className="asd-iconbtn" title="Show history" onClick={() => setHistCollapsed(false)}><IconLayoutSidebarRightExpand size={18} stroke={1.7} /></button> : null}
                <button type="button" className="asd-iconbtn" aria-label={expanded ? "Collapse" : "Expand"} onClick={() => setExpanded((e) => !e)}>{expanded ? <IconArrowsDiagonalMinimize2 size={18} stroke={1.7} /> : <IconArrowsDiagonal size={18} stroke={1.7} />}</button>
                <button type="button" className="asd-iconbtn" aria-label="Close" onClick={onClose}><IconX size={18} stroke={1.7} /></button>
              </div>
            </header>

            <div className="asd2-body" ref={bodyRef}>
              {/* prompts on TOP */}
              <section className="asd2-prompts">
                <p className="asd2-prompts-sub">Analyze topics, conversations, and risks across all your data.</p>
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

              <div className="asd2-divider" />

              {/* chat title + conversation */}
              <div className="asd2-chattitle">
                <span className="asd2-chattitle-name">{threadTitle}</span>
                <span className="asd2-chattitle-meta">{messages.length ? `${messages.length} message${messages.length > 1 ? "s" : ""}` : "Not started"}</span>
              </div>

              <section className="asd2-chat">
                {!messages.length && !thinking ? (
                  <div className="asd2-empty">Pick a prompt above, tap a tag on the left, or ask anything about {scope.name}&apos;s data.</div>
                ) : null}
                {messages.map((m) => (
                  <div key={m.key} className="asd-turn">
                    <div className="asd-user"><span className="asd-user-av">RE</span><span className="asd-user-q">{m.prompt}</span></div>
                    {m.text ? <div className="asd-reply"><span className="asd-reply-ctx">Messages in context: 100%</span><Reply text={m.text} /></div> : null}
                  </div>
                ))}
                {thinking ? <div className="asd-thinking"><span className="asd-think-dot" /><span className="asd-think-dot" /><span className="asd-think-dot" /> Thinking…</div> : null}
              </section>
            </div>

            <div className="asd2-composer">
              <input className="asd-input" placeholder="Ask your question…" />
              <button type="button" className="asd-send" aria-label="Send"><IconArrowUp size={16} stroke={2} /></button>
            </div>
          </div>

          {/* ---------- RIGHT — history (moved here) ---------- */}
          {!histCollapsed ? (
            <div className="asd2-hist">
              <div className="asd2-hist-head">
                <button type="button" className="asd2-hist-new" onClick={newChat}><IconPlus size={15} stroke={1.9} /> New chat</button>
                <button type="button" className="asd-iconbtn" title="Collapse history" onClick={() => setHistCollapsed(true)}><IconLayoutSidebarRightCollapse size={18} stroke={1.7} /></button>
              </div>
              <label className="asd2-hist-search"><IconSearch size={14} stroke={1.7} /><input placeholder="Search chats…" /></label>
              <div className="asd2-hist-scroll">
                {HISTORY_THREADS.some((t) => t.pinned) ? (<><div className="asd2-hist-label"><IconPinned size={12} stroke={1.8} /> Pinned</div>{HISTORY_THREADS.filter((t) => t.pinned).map((t) => <ThreadRow key={t.id} t={t} />)}</>) : null}
                {HISTORY_THREADS.some((t) => t.saved) ? (<><div className="asd2-hist-label"><IconBookmark size={12} stroke={1.8} /> Saved answers</div>{HISTORY_THREADS.filter((t) => t.saved).map((t) => <ThreadRow key={t.id} t={t} />)}</>) : null}
                <div className="asd2-hist-label"><IconMessage2 size={12} stroke={1.8} /> Recent</div>
                {HISTORY_THREADS.filter((t) => !t.pinned && !t.saved).map((t) => <ThreadRow key={t.id} t={t} />)}
              </div>
            </div>
          ) : null}
        </div>

        {/* version switch — full-width footer, shared with v1 */}
        <div className="asd2-foot"><VersionSwitch version={version} onVersion={onVersion} /></div>

        {/* Filters picker — categorised (>5 overflow), reuses v1 atoms */}
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

        {/* Prompt library — categorised + searchable, reuses v1 atoms */}
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
      </aside>
    </div>
  );
}

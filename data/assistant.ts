/* AI Copilot — mock data for the assistant drawer (no LLM).
 * Deterministic; no Date.now()/Math.random() (static-export safe). */

export type PromptKind = "analysis" | "filter";

export type PromptDef = {
  id: string;
  label: string;
  kind: PromptKind; // analysis = generates an answer · filter = narrows scope
  group: string;
  /** surfaced inline (the rest live only in the "＋ more" picker) */
  common?: boolean;
  /** 3-part tooltip */
  desc: string; // what it does
  scope: string; // what data/scope it applies
  prompt: string; // the literal prompt sent to the model (transparency)
};

/* ANALYSIS prompts (actions). 14 across 5 groups → this is the "7+ prompts"
 * case: a few common ones show inline, "＋ N more" opens a searchable, grouped
 * picker. Theme/scope filters live separately in THEMES (they're not prompts).
 * `common: true` = surfaced inline; the rest live only in the picker. */
export const PROMPT_GROUPS: { group: string; prompts: PromptDef[] }[] = [
  {
    group: "Summaries",
    prompts: [
      { id: "short-summary", label: "Short Summary", kind: "analysis", group: "Summaries", common: true, desc: "A tight 4–5 sentence overview of what this DOL talks about.", scope: "Current scope.", prompt: "Summarize this author's content in 4–5 sentences with citations." },
      { id: "detailed-summary", label: "Detailed Summary", kind: "analysis", group: "Summaries", common: true, desc: "A fuller breakdown by theme, audience and tone.", scope: "Current scope.", prompt: "Give a detailed, sectioned summary by theme, audience and tone, cited." },
      { id: "exec-brief", label: "Executive Brief", kind: "analysis", group: "Summaries", desc: "Three bullets a brand manager can paste into a deck.", scope: "Current scope.", prompt: "Write a 3-bullet executive brief for a brand manager, cited." },
    ],
  },
  {
    group: "Performance",
    prompts: [
      { id: "top-content", label: "Top-Performing Content", kind: "analysis", group: "Performance", common: true, desc: "Ranks the posts that drove the most reach and engagement.", scope: "Current scope, by engagement.", prompt: "List the top-performing posts and why they worked, cited." },
      { id: "cadence", label: "Posting Cadence & Timing", kind: "analysis", group: "Performance", desc: "How often and when they post vs when engagement lands.", scope: "Author posts in scope.", prompt: "Analyze posting cadence and best-performing timing, cited." },
      { id: "formats", label: "Format Breakdown", kind: "analysis", group: "Performance", desc: "Which formats (video, carousel, text) perform best.", scope: "Author posts in scope.", prompt: "Break performance down by content format, cited." },
    ],
  },
  {
    group: "Audience",
    prompts: [
      { id: "engagement-sentiment", label: "Audience Engagement & Sentiment", kind: "analysis", group: "Audience", common: true, desc: "How the audience reacts — sentiment split and what moves it.", scope: "Comments in scope.", prompt: "Analyze audience sentiment and its drivers, cited." },
      { id: "audience-profile", label: "Audience Profile", kind: "analysis", group: "Audience", desc: "Who's in the audience — roles, interests, questions.", scope: "Commenters in scope.", prompt: "Profile the audience by role, interest and recurring questions, cited." },
      { id: "top-commenters", label: "Top Commenters", kind: "analysis", group: "Audience", desc: "The most active and influential voices in the comments.", scope: "Comments in scope.", prompt: "Identify the top commenters and what they push, cited." },
    ],
  },
  {
    group: "Topics & Drivers",
    prompts: [
      { id: "topics-drivers", label: "Key Topics & Engagement Drivers", kind: "analysis", group: "Topics & Drivers", common: true, desc: "The themes that recur and which ones drive engagement.", scope: "Current scope.", prompt: "Surface key topics ranked by engagement contribution, cited." },
      { id: "trending", label: "Trending Topics", kind: "analysis", group: "Topics & Drivers", desc: "What's rising vs fading across the period.", scope: "Current scope over time.", prompt: "Show rising and fading topics across the period, cited." },
      { id: "hashtags", label: "Hashtag Analysis", kind: "analysis", group: "Topics & Drivers", desc: "Which hashtags carry reach and which underperform.", scope: "Author posts in scope.", prompt: "Analyze hashtag use and performance, cited." },
    ],
  },
  {
    group: "Risk & Compliance",
    prompts: [
      { id: "risk-scan", label: "Risk & Disclosure Scan", kind: "analysis", group: "Risk & Compliance", desc: "Adverse-event, off-label and disclosure-gap signals.", scope: "Posts + comments in scope.", prompt: "Scan for pharma-relevant risk and disclosure signals, cited." },
      { id: "offlabel", label: "Off-label Mentions", kind: "analysis", group: "Risk & Compliance", desc: "Where off-label or self-dosing comes up.", scope: "Comments in scope.", prompt: "Find off-label and self-dosing mentions, cited." },
    ],
  },
];

export const ALL_PROMPTS: PromptDef[] = PROMPT_GROUPS.flatMap((g) => g.prompts);

/* Content filter (top of scope) — and the TAGS that depend on it. Picking a
 * different content type changes the available tags + their counts + volume. */
export type ContentType = { id: string; label: string; messages: string };
export const CONTENT_TYPES: ContentType[] = [
  { id: "posts_comments", label: "Author Posts + All Comments", messages: "1.2K" },
  { id: "posts", label: "Author Posts only", messages: "207" },
  { id: "comments", label: "All Comments only", messages: "993" },
];

/* Thematic filters (the old "filtering prompts" — they narrow data, so they're
 * filters, shown in the Filters step alongside content tags). */
export type Theme = { id: string; label: string; count: string };
export const THEMES: Theme[] = [
  { id: "th-brands", label: "Brands & treatments", count: "48" },
  { id: "th-glp1", label: "GLP-1", count: "31" },
  { id: "th-risk", label: "Risk & disclosure", count: "12" },
  { id: "th-promo", label: "Promotional", count: "7" },
  { id: "th-collab", label: "Collaborations", count: "9" },
];

/* Auto "Summary" of the scoped data — reacts to content + active filters so the
 * cause→effect is obvious (change a filter above → this line changes). Mock. */
export function scopeSummary(name: string, contentLabel: string, channel: string, filterLabels: string[]): string {
  if (!filterLabels.length)
    return `${name}'s ${contentLabel.toLowerCase()} on ${channel} center on obesity, GLP-1 therapy and bariatric surgery — patient-story posts drive the most engagement.`;
  const f = filterLabels.join(" + ");
  return `Narrowed to ${f}: the ${channel} conversation skews toward ${filterLabels[0].toLowerCase()}, with audience questions and side-effect concerns leading. Pick a prompt below to go deeper.`;
}

export type TagKind = "all" | "questions" | "topics" | "disease" | "drug";
export type TagDef = { id: string; label: string; count: string; kind: TagKind };
export const TAGS_BY_CONTENT: Record<string, TagDef[]> = {
  posts_comments: [
    { id: "all", label: "All Messages", count: "1.2K", kind: "all" },
    { id: "questions", label: "Questions", count: "4", kind: "questions" },
    { id: "topics", label: "Topics", count: "235", kind: "topics" },
    { id: "diabetes", label: "Diabetes Mellitus", count: "4", kind: "disease" },
    { id: "obesity", label: "Obesity", count: "4", kind: "disease" },
    { id: "glp1", label: "GLP-1", count: "4", kind: "drug" },
    { id: "semaglutide", label: "Semaglutide", count: "3", kind: "drug" },
  ],
  posts: [
    { id: "all", label: "All Messages", count: "207", kind: "all" },
    { id: "topics", label: "Topics", count: "58", kind: "topics" },
    { id: "obesity", label: "Obesity", count: "31", kind: "disease" },
    { id: "glp1", label: "GLP-1", count: "22", kind: "drug" },
    { id: "semaglutide", label: "Semaglutide", count: "18", kind: "drug" },
  ],
  comments: [
    { id: "all", label: "All Messages", count: "993", kind: "all" },
    { id: "questions", label: "Questions", count: "120", kind: "questions" },
    { id: "topics", label: "Topics", count: "177", kind: "topics" },
    { id: "obesity", label: "Obesity", count: "41", kind: "disease" },
    { id: "sentiment", label: "Sentiment", count: "86", kind: "topics" },
  ],
};

/* Dynamic, data-triggered suggestions ("spike, Jun 2024" class). Generated
 * from detected signals; shown in a highlighted "Suggested from your data" row. */
export type DynamicSuggestion = { id: string; label: string; prompt: string; signal: string };
export const DYNAMIC_SUGGESTIONS: DynamicSuggestion[] = [
  {
    id: "dyn-spike", label: "Spike in semaglutide mentions · Jun 2024",
    signal: "+212% vs prior month",
    prompt: "Semaglutide mentions spiked ~3× in Jun 2024. What drove it? Cite posts.",
  },
  {
    id: "dyn-risk", label: "Off-label dosing questions rising in comments",
    signal: "new risk signal",
    prompt: "Off-label dosing questions rose this period. Summarize and cite the comments.",
  },
];

/* Canned answers keyed by prompt id; `id:NNN` tokens render as citation chips.
 * `{name}` is replaced with the in-scope DOL name at render time. */
export const MOCK_ANSWERS: Record<string, string> = {
  "short-summary":
    "{name}'s content centers on obesity treatment, bariatric surgery, GLP-1 therapy and long-term weight management. Recurring themes include pre-op guidance, medication efficacy and post-op recovery id:151257683168 id:151257686080. Patient transformation stories drive the strongest engagement, and a steady thread of myth-busting addresses semaglutide side-effect fears id:151257662230 id:151257691281. Tone is clinical but accessible, aimed at both peers and patients id:151257665737.",
  "detailed-summary":
    "Across the current scope, {name} publishes in three modes. **Education** — explainer posts on GLP-1 mechanism, dosing and reflux, which earn high saves id:151257683168. **Cases** — anonymized patient journeys (the strongest reach) id:151257662230 id:151257666027. **Commentary** — takes on new guidelines and trial read-outs id:151257691281. Audience skews clinician + informed-patient; sentiment is largely positive, with concern clustering around side effects id:151257665737.",
  "top-content":
    "Top posts by engagement in scope: (1) a 330 kg patient transformation id:151257662230, (2) a semaglutide side-effect myth-buster id:151257691281, (3) a pre-op checklist carousel id:151257686080. Visual, story-led formats outperform text explainers ~2.4× on this channel.",
  "engagement-sentiment":
    "Sentiment is ~74% positive, 18% neutral, 8% negative in scope. Positive drivers: hope from transformations and clear dosing guidance id:151257683168. Negative clusters around nausea and cost id:151257666027 id:151257665737.",
  "topics-drivers":
    "Key topics: obesity, GLP-1 agonists, bariatric surgery, reflux, nutrition. Engagement is driven disproportionately by GLP-1 and patient-story posts id:151257691281 id:151257662230, while general nutrition underperforms.",
  "dyn-spike":
    "Semaglutide mentions rose ~212% in Jun 2024, led by a viral side-effect myth-buster and a dosing explainer id:151257691281 id:151257683168. The spike is engagement-led (comments 3.1×), not just reach — audience questions, not the author, carried it id:151257666027.",
  "dyn-risk":
    "Off-label and self-dosing questions appear in a rising share of comments this period id:151257666027 id:151257665737. None are author-stated; all are audience questions — worth a disclosure-tagged response review id:151257686080.",
};

export function answerFor(promptId: string, name: string): string {
  const t =
    MOCK_ANSWERS[promptId] ??
    `Here's an analysis of {name}'s content for that request, across the current scope id:151257683168 id:151257662230. (Mock response — wire to the model in a later phase.)`;
  return t.replace(/\{name\}/g, name);
}

/* Sources behind the `id:NNN` citations — so a reference renders as a clean
 * numbered chip with a readable, instant (text-only) preview + a Sources list,
 * instead of a raw id you have to hover and wait for images to load. */
export type Source = {
  author: string;
  role: string;
  platform: string;
  date: string;
  snippet: string;
  lang: string;
  views: number;
};
export const SOURCES: Record<string, Source> = {
  "151257683168": { author: "Dr. Aayed Alqahtani", role: "Bariatric surgeon", platform: "X", date: "Nov 07, 2025", snippet: "How GLP-1 therapy actually works — and who it's for. A 2-minute explainer.", lang: "Arabic", views: 41200 },
  "151257686080": { author: "Dr. Aayed Alqahtani", role: "Bariatric surgeon", platform: "Instagram", date: "Oct 28, 2025", snippet: "Pre-op checklist before bariatric surgery — save this carousel.", lang: "Arabic", views: 28700 },
  "151257680390": { author: "Dr. Aayed Alqahtani", role: "Bariatric surgeon", platform: "TikTok", date: "Oct 19, 2025", snippet: "Reflux after sleeve gastrectomy: what's normal and what's not.", lang: "Arabic", views: 33500 },
  "151257662230": { author: "Dr. Aayed Alqahtani", role: "Bariatric surgeon", platform: "TikTok", date: "Sep 30, 2025", snippet: "Thamer's journey — from 330 kg to a new life after surgery.", lang: "Arabic", views: 612000 },
  "151257666027": { author: "elsaadi jamal", role: "Internal medicine specialist", platform: "X", date: "Nov 07, 2025", snippet: "Nausea on semaglutide — does it pass? Asking for the dose ramp.", lang: "Arabic", views: 9400 },
  "151257691281": { author: "Dr. Aayed Alqahtani", role: "Bariatric surgeon", platform: "X", date: "Jun 18, 2024", snippet: "Myth-busting semaglutide side effects — the trials vs the rumours.", lang: "Arabic", views: 188000 },
  "151257665737": { author: "Noura A.", role: "Audience", platform: "Instagram", date: "Oct 12, 2025", snippet: "Is it safe long-term? And what about the cost here?", lang: "Arabic", views: 5100 },
  "151257674398": { author: "Dr. Aayed Alqahtani", role: "Bariatric surgeon", platform: "Snapchat", date: "Sep 02, 2025", snippet: "Live from the Montreal lecture on childhood obesity.", lang: "Arabic", views: 22100 },
};

/* Mock history — each thread carries its own scope snapshot. */
export type HistoryThread = {
  id: string;
  title: string;
  scope: string;
  when: string;
  pinned?: boolean;
  saved?: boolean;
};
export const HISTORY_THREADS: HistoryThread[] = [
  { id: "h1", title: "Risk themes · HCP comments", scope: "Last 30 days · all channels", when: "2d ago", pinned: true },
  { id: "h2", title: "Top semaglutide posts · Q2", scope: "Apr–Jun · TikTok", when: "5d ago", saved: true },
  { id: "h3", title: "GLP-1 sentiment shift", scope: "Last 90 days · all", when: "1w ago" },
  { id: "h4", title: "Engagement drivers · April", scope: "Apr · Instagram", when: "3w ago" },
];

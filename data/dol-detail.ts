/* Pharma 360 — DOL DETAIL mock data (first iteration).
 * Plausible, fictional. Derived deterministically from each DOL so every
 * profile page differs a little. Values are illustrative (synthetic). */

import { DOLS, type Channel, type Dol } from "./dols";

export type AudienceRow = { channel: Channel; followers: number; eng: number; delta: number };
export type TopicChip = { id: string; label: string; count: number; tint: TopicTint };
export type RankItem = { label: string; value: number };
export type PerPost = { key: string; label: string; value: string; topic: string; up: boolean };
export type Commenter = { name: string; handle: string; img: string };

export type TopicTint = "teal" | "cyan" | "violet" | "magenta" | "amber" | "blue";

export type DolDetail = {
  audience: AudienceRow[];
  totals: { followers: number; posts: number; comments: number; commenters: number; engagement: number };
  brands: string[];
  diseases: TopicChip[];
  medications: TopicChip[];
  hashtags: RankItem[];
  topics: RankItem[];
  perPost: PerPost[];
  commenters: Commenter[];
};

const TINTS: TopicTint[] = ["teal", "cyan", "violet", "magenta", "amber", "blue"];

/* canonical topic sets for a bariatric / obesity-medicine KOL */
const DISEASES = [
  "Obesity",
  "Type-2 Diabetes",
  "Hypertension",
  "Cardiovascular disease",
  "Metabolic syndrome",
  "GERD / reflux",
  "Sleep apnea",
  "NAFLD",
];
const MEDICATIONS = ["GLP-1 agonists", "Semaglutide", "Tirzepatide", "Insulin", "Metformin", "SGLT-2"];
const HASHTAGS = [
  "obesity", "bariatricsurgery", "weightloss", "glp1", "semaglutide", "metabolichealth",
  "diabetes", "ozempic", "nutrition", "gastricsleeve",
];
const TOPICS = [
  "Surgery outcomes", "Medication efficacy", "Diet & nutrition", "Patient stories",
  "Side effects", "Clinical evidence", "Pre-op guidance", "Post-op recovery",
];

const COMMENTER_FIRST = ["Maya", "Omar", "Lina", "Yusuf", "Hana", "Karim", "Noor", "Sami", "Rana", "Tariq"];

/* deterministic pseudo-random from a seed */
function rng(seed: number) {
  let s = seed % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildDetail(dol: Dol): DolDetail {
  const r = rng(dol.seed * 7 + 13);

  // audience by channel — share the DOL follower count across its channels
  const base = Math.max(dol.metrics.followers, 14000);
  const totalFollowers = Math.round(base * (3 + r() * 9)); // richer than the list number
  const weights = dol.channels.map(() => 0.3 + r());
  const wsum = weights.reduce((a, b) => a + b, 0);
  const audience: AudienceRow[] = dol.channels.map((channel, i) => ({
    channel,
    followers: Math.round((weights[i] / wsum) * totalFollowers),
    eng: +(1 + r() * 7).toFixed(2),
    delta: +((r() - 0.4) * 18).toFixed(1),
  }));

  const posts = 120 + Math.round(r() * 900);
  const comments = 200 + Math.round(r() * 4000);
  const commentersN = Math.round(comments * (0.55 + r() * 0.3));

  const pick = <T,>(arr: T[], n: number) => arr.slice(0, n);

  const diseases: TopicChip[] = pick(DISEASES, 6).map((label, i) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label,
    count: 6 + Math.round(r() * 60),
    tint: TINTS[i % TINTS.length],
  }));
  const medications: TopicChip[] = pick(MEDICATIONS, 5).map((label, i) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label,
    count: 4 + Math.round(r() * 40),
    tint: TINTS[(i + 2) % TINTS.length],
  }));

  const hashtags: RankItem[] = pick(HASHTAGS, 8)
    .map((label) => ({ label, value: 4 + Math.round(r() * 90) }))
    .sort((a, b) => b.value - a.value);
  const topics: RankItem[] = pick(TOPICS, 7)
    .map((label) => ({ label, value: 2 + Math.round(r() * 40) }))
    .sort((a, b) => b.value - a.value);

  const views = 18000 + Math.round(r() * 60000);
  const likes = 600 + Math.round(r() * 2200);
  const cpp = 20 + Math.round(r() * 70);
  const perPost: PerPost[] = [
    { key: "views", label: "Avg. views / post", value: fmtK(views), topic: fmtK(Math.round(views * 1.1)), up: true },
    { key: "likes", label: "Avg. likes / post", value: fmtK(likes), topic: fmtK(Math.round(likes * 1.05)), up: true },
    { key: "comments", label: "Avg. comments / post", value: String(cpp), topic: String(cpp + 1), up: r() > 0.4 },
  ];

  const commenters: Commenter[] = Array.from({ length: 8 }).map((_, i) => {
    const first = COMMENTER_FIRST[(dol.seed + i) % COMMENTER_FIRST.length];
    const img = 1 + ((dol.seed * 3 + i * 7) % 70);
    return { name: first, handle: "@" + first.toLowerCase() + (10 + i), img: `https://i.pravatar.cc/96?img=${img}` };
  });

  return {
    audience: audience.sort((a, b) => b.followers - a.followers),
    totals: {
      followers: totalFollowers,
      posts,
      comments,
      commenters: commentersN,
      engagement: +(audience.reduce((a, b) => a + b.eng, 0) / audience.length).toFixed(2),
    },
    brands: ["Novo Nordisk", "Eli Lilly"].slice(0, 1 + (dol.seed % 2)),
    diseases,
    medications,
    hashtags,
    topics,
    perPost,
    commenters,
  };
}

function fmtK(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export const DETAIL_BY_ID: Record<string, DolDetail> = Object.fromEntries(
  DOLS.map((d) => [d.id, buildDetail(d)])
);

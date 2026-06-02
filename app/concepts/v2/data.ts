/* v2 — Pharma OS DOL dataset (plausible, fictional)
 * Domain: bariatric / obesity-surgery KOLs across MENA + intl.
 * Ported verbatim from the v2 source bundle (project/app/data.jsx).
 */

export type Channel =
  | "facebook" | "instagram" | "x" | "linkedin" | "youtube" | "tiktok" | "threads";

export type Tier = "Elite" | "Macro" | "Mid Tier" | "Rising" | "Micro";

export type Bucket = "Nano" | "Micro audience" | "Mid" | "Macro" | "Mega";

export type Dol = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  tier: Tier;
  specialty: string;
  type: "Public" | "Private" | "Mixed";
  group: "A" | "B" | "C" | "D";
  gender: "Male" | "Female";
  country: string;
  city: string;
  bio: string;
  channels: Channel[];
  primary: Channel;
  metrics: {
    followers: number;
    posts: number;
    audienceComments: number;
    commenters: number;
    engagement: number;
  };
  seed: number;
  spark: number[];
  engSpark: number[];
  bucket: Bucket;
};

export const TIERS: Record<Tier, { color: string; star: boolean; label: string }> = {
  Elite:       { color: "var(--teal)",    star: true,  label: "Elite" },
  Macro:       { color: "var(--violet)",  star: true,  label: "Macro" },
  "Mid Tier":  { color: "var(--cyan)",    star: true,  label: "Mid Tier" },
  Rising:      { color: "var(--magenta)", star: false, label: "Rising" },
  Micro:       { color: "var(--orange)",  star: false, label: "Micro" },
};

function spark(seed: number, n = 12, vol = 0.4): number[] {
  const out: number[] = [];
  let v = 0.5;
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    v = Math.max(0.08, Math.min(0.96, v + (r - 0.48) * vol));
    out.push(v);
  }
  return out;
}

type DolSeed = Omit<Dol, "spark" | "engSpark" | "bucket">;

const RAW: DolSeed[] = [
  {
    id: "aayed", name: "Aayed Alqahtani", handle: "@dr.aayed", initials: "AA",
    tier: "Mid Tier", specialty: "Bariatric Surgeon", type: "Mixed", group: "A",
    gender: "Male", country: "Saudi Arabia", city: "Riyadh",
    bio: "Specialist in laparoscopic and obesity surgery. Leads the metabolic surgery program at King Saud University.",
    channels: ["facebook", "instagram", "x", "linkedin", "youtube", "tiktok", "threads"],
    primary: "facebook",
    metrics: { followers: 2400, posts: 193, audienceComments: 4, commenters: 4, engagement: 0.01 },
    seed: 31,
  },
  {
    id: "abdullah", name: "Abdullah Al-Barrak", handle: "@dr.albarrak", initials: "AB",
    tier: "Micro", specialty: "Bariatric Surgeon", type: "Public", group: "C",
    gender: "Male", country: "Saudi Arabia", city: "Jeddah",
    bio: "Consultant in obesity surgery and advanced laparoscopic surgery. Procedures include sleeve gastrectomy and endoscopic interventions.",
    channels: ["instagram", "x", "tiktok", "threads"],
    primary: "instagram",
    metrics: { followers: 11600, posts: 8, audienceComments: 1, commenters: 1, engagement: 2.83 },
    seed: 57,
  },
  {
    id: "noura", name: "Noura Al-Fadhli", handle: "@dr.noura.endo", initials: "NF",
    tier: "Elite", specialty: "Endocrinologist", type: "Public", group: "A",
    gender: "Female", country: "Kuwait", city: "Kuwait City",
    bio: "Endocrinologist and metabolic-health educator. Translates GLP-1 research into plain-language guidance for patients.",
    channels: ["instagram", "x", "linkedin", "youtube", "tiktok", "threads"],
    primary: "instagram",
    metrics: { followers: 482000, posts: 1240, audienceComments: 38200, commenters: 21400, engagement: 6.41 },
    seed: 12,
  },
  {
    id: "tariq", name: "Tariq Mansour", handle: "@tariq.metabolic", initials: "TM",
    tier: "Macro", specialty: "Bariatric Surgeon", type: "Mixed", group: "B",
    gender: "Male", country: "UAE", city: "Dubai",
    bio: "Director of the metabolic and bariatric institute. Performs robotic gastric bypass and revisional surgery; frequent conference speaker.",
    channels: ["instagram", "x", "linkedin", "youtube", "tiktok"],
    primary: "youtube",
    metrics: { followers: 156000, posts: 612, audienceComments: 9800, commenters: 6120, engagement: 4.92 },
    seed: 88,
  },
  {
    id: "huda", name: "Huda El-Sayed", handle: "@dr.huda.nutrition", initials: "HE",
    tier: "Rising", specialty: "Clinical Dietitian", type: "Public", group: "B",
    gender: "Female", country: "Egypt", city: "Cairo",
    bio: "Clinical dietitian focused on post-operative nutrition and long-term weight management. Builds practical meal frameworks.",
    channels: ["instagram", "tiktok", "youtube", "threads"],
    primary: "tiktok",
    metrics: { followers: 68400, posts: 845, audienceComments: 5210, commenters: 3940, engagement: 8.15 },
    seed: 44,
  },
  {
    id: "yousef", name: "Yousef Al-Harbi", handle: "@dr.yousef.surg", initials: "YH",
    tier: "Mid Tier", specialty: "General Surgeon", type: "Private", group: "C",
    gender: "Male", country: "Saudi Arabia", city: "Dammam",
    bio: "General and bariatric surgeon. Shares case discussions and surgical technique with a peer clinical audience.",
    channels: ["x", "linkedin", "youtube"],
    primary: "linkedin",
    metrics: { followers: 24700, posts: 318, audienceComments: 1420, commenters: 980, engagement: 3.27 },
    seed: 65,
  },
  {
    id: "leila", name: "Leila Karimi", handle: "@leila.weighed", initials: "LK",
    tier: "Elite", specialty: "Patient Advocate", type: "Public", group: "A",
    gender: "Female", country: "UAE", city: "Abu Dhabi",
    bio: "Bariatric patient advocate and community builder. Documents the surgical journey and rallies a highly engaged support network.",
    channels: ["instagram", "tiktok", "youtube", "threads", "facebook"],
    primary: "instagram",
    metrics: { followers: 921000, posts: 2110, audienceComments: 74300, commenters: 41200, engagement: 9.03 },
    seed: 7,
  },
  {
    id: "omar", name: "Omar Benali", handle: "@dr.benali.obesity", initials: "OB",
    tier: "Macro", specialty: "Endocrinologist", type: "Mixed", group: "B",
    gender: "Male", country: "Morocco", city: "Casablanca",
    bio: "Endocrinologist and obesity-medicine physician. Publishes on pharmacotherapy and shares evidence reviews in French and Arabic.",
    channels: ["x", "linkedin", "youtube", "facebook"],
    primary: "x",
    metrics: { followers: 138500, posts: 980, audienceComments: 7240, commenters: 4880, engagement: 4.16 },
    seed: 99,
  },
  {
    id: "sara", name: "Sara Al-Mutairi", handle: "@sara.health.qa", initials: "SM",
    tier: "Rising", specialty: "Health Journalist", type: "Public", group: "D",
    gender: "Female", country: "Qatar", city: "Doha",
    bio: "Health journalist covering metabolic medicine and pharma access in the Gulf. Bridges clinical findings to a general readership.",
    channels: ["x", "instagram", "linkedin", "threads"],
    primary: "x",
    metrics: { followers: 53200, posts: 1430, audienceComments: 3120, commenters: 2260, engagement: 5.74 },
    seed: 23,
  },
];

function bucketFor(followers: number): Bucket {
  if (followers < 1000) return "Nano";
  if (followers < 10_000) return "Micro audience";
  if (followers < 100_000) return "Mid";
  if (followers < 1_000_000) return "Macro";
  return "Mega";
}

export const DOLS: Dol[] = RAW.map((d) => ({
  ...d,
  spark: spark(d.seed, 12, 0.42),
  engSpark: spark(d.seed + 5, 12, 0.5),
  bucket: bucketFor(d.metrics.followers),
}));

export type FilterDef =
  | { key: "channels"; label: string; type: "chips"; options: Channel[] }
  | { key: keyof Dol; label: string; type: "check"; options: string[] };

export const FILTER_DEFS: FilterDef[] = [
  { key: "bucket",   label: "Audience Size", type: "check",
    options: ["Nano", "Micro audience", "Mid", "Macro", "Mega"] },
  { key: "country",  label: "Country", type: "check",
    options: ["Saudi Arabia", "UAE", "Kuwait", "Qatar", "Egypt", "Morocco"] },
  { key: "city",     label: "City", type: "check",
    options: ["Riyadh", "Jeddah", "Dammam", "Dubai", "Abu Dhabi", "Kuwait City", "Cairo", "Casablanca", "Doha"] },
  { key: "group",    label: "Group", type: "check", options: ["A", "B", "C", "D"] },
  { key: "tier",     label: "Tier", type: "check",
    options: ["Elite", "Macro", "Mid Tier", "Rising", "Micro"] },
  { key: "type",     label: "Type", type: "check", options: ["Public", "Private", "Mixed"] },
  { key: "gender",   label: "Gender", type: "check", options: ["Male", "Female"] },
  { key: "channels", label: "Channel", type: "chips",
    options: ["facebook", "instagram", "x", "linkedin", "youtube", "tiktok", "threads"] },
];

export const SORTS = [
  { key: "name",       label: "Influencer Name" },
  { key: "followers",  label: "Followers" },
  { key: "engagement", label: "Engagement Rate" },
  { key: "posts",      label: "Posts" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export const BUCKET_LABEL: Record<Bucket, string> = {
  "Nano":            "Nano · <1K",
  "Micro audience":  "Micro · 1K–10K",
  "Mid":             "Mid · 10K–100K",
  "Macro":           "Macro · 100K–1M",
  "Mega":            "Mega · >1M",
};

export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
  return String(n);
}

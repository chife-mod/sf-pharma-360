// Mock data shaped to mirror what the live pharma.market360.ai serves.
// Three representative cards on purpose:
//   - rich  — dense data, design should sing
//   - sparse — 1-2 mentions per axis, where the original portal falls apart
//   - empty — barely any signal, tests the "one-line empty state" rule

export type SocialChannel =
  | "facebook" | "instagram" | "x" | "linkedin" | "youtube" | "tiktok" | "threads";

export type AudienceTier = "Mega" | "Macro" | "Mid Tier" | "Micro" | "Nano";

export type DolKind =
  | "Bariatric Surgeon" | "Endocrinologist" | "Cardiologist" | "Clinical Dietitian"
  | "Family Physician" | "Diabetes Dietitian" | "Health & Nutrition Coach"
  | "Physician DOL" | "NHS Doctor" | "Medical Association" | "Obesity Physician";

export interface DolSignal {
  followers: number | null;
  posts: number | null;
  audienceComments: number | null;
  commenters: number | null;
  engagementRate: number | null; // 0..1
}

export interface DolDetail {
  audience: { channel: SocialChannel; followers: number; engagementRate: number }[];
  agg: {
    followers: number;
    posts: number;
    comments: number;
    commenters: number;
    engagementRate: number;
  };
  brands: { name: string; mentions: number }[];
  diseases: { name: string; posts: number }[];
  medicaments: { name: string; posts: number }[];
  hashtags: { tag: string; count: number }[];
  keyTopics: { topic: string; count: number }[];
  perPost: {
    avgViews: { perPost: number; perTopic: number; topic: string; deltaPct: number };
    avgLikes: { perPost: number; perTopic: number; topic: string; deltaPct: number };
    avgComments: { perPost: number; perTopic: number; topic: string; deltaPct: number };
  };
  topCommenters: { handle: string; count: number }[];
  commentInsights: { label: string; count: number }[];
  commenterInterests: { label: string; count: number }[];
  period: { from: string; to: string; updated: string };
}

export interface Dol {
  id: string;
  slug: string;
  name: string;
  photo?: string;
  tier: AudienceTier;
  kind: DolKind;
  audienceType: "Mixed" | "Public" | "Specialist";
  group: "A" | "B" | "C";
  country: string;
  city: string;
  gender: "Male" | "Female" | "Other";
  bio: string;
  channels: SocialChannel[]; // available
  primary: SocialChannel;    // selected by default
  signal: DolSignal;         // list-card metrics
  detail: DolDetail;
}

const today = "2026-05-29";

export const DOLS: Dol[] = [
  // ──────────────────────────────────────────────────────────────────────
  // RICH — dense data, like Andrea Filipponi on the live portal
  {
    id: "16afb2bcf2fa1e",
    slug: "andrea-filipponi",
    name: "Andrea Filipponi",
    tier: "Mid Tier",
    kind: "Clinical Dietitian",
    audienceType: "Public",
    group: "A",
    country: "Italy",
    city: "Riccione",
    gender: "Male",
    bio: "Italian biologist nutritionist and personal trainer based in Riccione. Specialised in “smart” weight-loss, bloating relief and body recomposition; creates flexible, non-restrictive protocols for high-performing adults.",
    channels: ["facebook", "instagram", "x", "linkedin", "youtube", "tiktok", "threads"],
    primary: "instagram",
    signal: {
      followers: 175_000,
      posts: 278,
      audienceComments: 791,
      commenters: 635,
      engagementRate: 0.0015,
    },
    detail: {
      audience: [
        { channel: "tiktok", followers: 140_600, engagementRate: 0.005 },
        { channel: "x", followers: 39_000, engagementRate: 0.0003 },
        { channel: "instagram", followers: 19_900, engagementRate: 0.0009 },
        { channel: "youtube", followers: 7_900, engagementRate: 0.0012 },
        { channel: "linkedin", followers: 6_300, engagementRate: 0.0019 },
        { channel: "facebook", followers: 2_400, engagementRate: 0.0001 },
        { channel: "threads", followers: 1_200, engagementRate: 0 },
      ],
      agg: {
        followers: 175_000,
        posts: 278,
        comments: 791,
        commenters: 635,
        engagementRate: 0.0015,
      },
      brands: [
        { name: "Wegovy", mentions: 7 },
        { name: "Ozempic", mentions: 5 },
        { name: "Mounjaro", mentions: 4 },
        { name: "Saxenda", mentions: 2 },
        { name: "Nestlé Health", mentions: 1 },
      ],
      diseases: [
        { name: "Obesity", posts: 38 },
        { name: "Diabetes Mellitus", posts: 21 },
        { name: "Hypertension", posts: 9 },
        { name: "Metabolic Syndrome", posts: 7 },
        { name: "Cardiovascular Disease", posts: 4 },
        { name: "Cancer", posts: 2 },
      ],
      medicaments: [
        { name: "Semaglutide", posts: 12 },
        { name: "GLP-1", posts: 11 },
        { name: "Tirzepatide", posts: 6 },
        { name: "Liraglutide", posts: 3 },
        { name: "Metformin", posts: 2 },
      ],
      hashtags: [
        { tag: "#nutrition", count: 189 },
        { tag: "#weightloss", count: 167 },
        { tag: "#GLP1", count: 116 },
        { tag: "#fitness", count: 115 },
        { tag: "#diabetes", count: 101 },
        { tag: "#metabolichealth", count: 70 },
        { tag: "#obesity", count: 69 },
        { tag: "#protein", count: 48 },
        { tag: "#wegovy", count: 44 },
        { tag: "#ozempic", count: 37 },
      ],
      keyTopics: [
        { topic: "Obesity", count: 200 },
        { topic: "Diabetes", count: 144 },
        { topic: "Metabolic Syndrome", count: 86 },
        { topic: "Nutrition", count: 63 },
        { topic: "Fitness", count: 42 },
        { topic: "Insulin Resistance", count: 22 },
        { topic: "Cardio Risk", count: 14 },
        { topic: "Hormones", count: 11 },
      ],
      perPost: {
        avgViews: { perPost: 43_700, perTopic: 48_900, topic: "Obesity", deltaPct: 12 },
        avgLikes: { perPost: 1_200, perTopic: 1_240, topic: "Obesity", deltaPct: 4 },
        avgComments: { perPost: 51, perTopic: 52, topic: "Obesity", deltaPct: 2 },
      },
      topCommenters: [
        { handle: "dr_mauro", count: 13 },
        { handle: "ThamerAljou", count: 11 },
        { handle: "mss_clinic", count: 11 },
        { handle: "rozalrozal", count: 10 },
        { handle: "(.‿.)>", count: 9 },
        { handle: "user697033", count: 9 },
        { handle: "p.colombo", count: 7 },
        { handle: "n.bianchi", count: 6 },
      ],
      commentInsights: [
        { label: "Questions", count: 92 },
        { label: "Personal experiences", count: 41 },
        { label: "Recommendations", count: 22 },
        { label: "Concerns", count: 17 },
      ],
      commenterInterests: [
        { label: "Fashion", count: 23 },
        { label: "Beauty", count: 19 },
        { label: "Finance", count: 14 },
        { label: "Lifestyle", count: 12 },
        { label: "Sports", count: 8 },
      ],
      period: { from: "2025-05-31", to: "2026-05-31", updated: today },
    },
  },
  // ──────────────────────────────────────────────────────────────────────
  // SPARSE — only a couple of mentions per axis. The portal's biggest pain.
  {
    id: "ad1aa8c6d2f013",
    slug: "alina-rupin",
    name: "Alina Rupin",
    tier: "Nano",
    kind: "Clinical Dietitian",
    audienceType: "Mixed",
    group: "C",
    country: "Romania",
    city: "Bucharest",
    gender: "Female",
    bio: "Specialist in dietary management and weight loss.",
    channels: ["facebook", "instagram", "linkedin", "youtube"],
    primary: "facebook",
    signal: {
      followers: 563,
      posts: 6,
      audienceComments: 0,
      commenters: 0,
      engagementRate: 0.0018,
    },
    detail: {
      audience: [
        { channel: "facebook", followers: 410, engagementRate: 0.002 },
        { channel: "instagram", followers: 120, engagementRate: 0.0014 },
        { channel: "linkedin", followers: 24, engagementRate: 0.0009 },
        { channel: "youtube", followers: 9, engagementRate: 0 },
      ],
      agg: {
        followers: 563,
        posts: 6,
        comments: 0,
        commenters: 0,
        engagementRate: 0.0018,
      },
      brands: [{ name: "Mounjaro", mentions: 1 }],
      diseases: [
        { name: "Obesity", posts: 1 },
        { name: "Diabetes Mellitus", posts: 1 },
      ],
      medicaments: [{ name: "Semaglutide", posts: 1 }],
      hashtags: [
        { tag: "#nutrition", count: 3 },
        { tag: "#diet", count: 2 },
        { tag: "#weightloss", count: 2 },
      ],
      keyTopics: [
        { topic: "Nutrition", count: 3 },
        { topic: "Obesity", count: 1 },
      ],
      perPost: {
        avgViews: { perPost: 38, perTopic: 41, topic: "Nutrition", deltaPct: 8 },
        avgLikes: { perPost: 2, perTopic: 2, topic: "Nutrition", deltaPct: 0 },
        avgComments: { perPost: 0, perTopic: 0, topic: "Nutrition", deltaPct: 0 },
      },
      topCommenters: [],
      commentInsights: [],
      commenterInterests: [],
      period: { from: "2025-05-31", to: "2026-05-31", updated: today },
    },
  },
  // ──────────────────────────────────────────────────────────────────────
  // EMPTY — barely any signal at all. Tests the "compact empty state" rule.
  {
    id: "9f02b71cee71a4",
    slug: "akshay-jain",
    name: "Akshay Jain",
    tier: "Nano",
    kind: "Endocrinologist",
    audienceType: "Specialist",
    group: "C",
    country: "Canada",
    city: "Surrey, BC",
    gender: "Male",
    bio: "Surrey-based endocrinologist; first Canadian physician described as triple board-certified by the American Boards in Endocrinology, Diabetes & Metabolism, Internal Medicine, and Obesity Medicine.",
    channels: ["instagram", "x", "youtube"],
    primary: "instagram",
    signal: {
      followers: null,
      posts: null,
      audienceComments: null,
      commenters: null,
      engagementRate: null,
    },
    detail: {
      audience: [
        { channel: "instagram", followers: 0, engagementRate: 0 },
        { channel: "x", followers: 0, engagementRate: 0 },
        { channel: "youtube", followers: 0, engagementRate: 0 },
      ],
      agg: {
        followers: 0,
        posts: 0,
        comments: 0,
        commenters: 0,
        engagementRate: 0,
      },
      brands: [],
      diseases: [],
      medicaments: [],
      hashtags: [],
      keyTopics: [],
      perPost: {
        avgViews: { perPost: 0, perTopic: 0, topic: "—", deltaPct: 0 },
        avgLikes: { perPost: 0, perTopic: 0, topic: "—", deltaPct: 0 },
        avgComments: { perPost: 0, perTopic: 0, topic: "—", deltaPct: 0 },
      },
      topCommenters: [],
      commentInsights: [],
      commenterInterests: [],
      period: { from: "2025-05-31", to: "2026-05-31", updated: today },
    },
  },
];

export function findDol(slug: string): Dol | undefined {
  return DOLS.find((d) => d.slug === slug || d.id === slug);
}

/** Pretty-print a number with a thin-space thousands separator. */
export function fmtN(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  if (n >= 10_000) return (n / 1_000).toFixed(0) + "K";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("fr-FR").replace(/ /g, " ");
}

export function fmtPct(p: number | null | undefined): string {
  if (p == null || isNaN(p)) return "—";
  return (p * 100).toFixed(p < 0.001 ? 2 : 2) + "%";
}

import { fmtN, fmtPct } from "@/data/dols";

interface Props {
  agg: {
    followers: number;
    posts: number;
    comments: number;
    commenters: number;
    engagementRate: number;
  };
  period: { from: string; to: string; updated: string };
}

const ITEMS = [
  { key: "followers", label: "Followers" },
  { key: "posts", label: "Posts" },
  { key: "comments", label: "Comments" },
  { key: "commenters", label: "Commenters" },
  { key: "engagementRate", label: "Engagement Rate" },
] as const;

export function KpiStrip({ agg, period }: Props) {
  return (
    <section className="rounded-lg border border-border bg-surface">
      <div className="grid grid-cols-5 divide-x divide-border">
        {ITEMS.map(({ key, label }) => {
          const v =
            key === "engagementRate"
              ? fmtPct(agg.engagementRate)
              : fmtN(agg[key as keyof typeof agg] as number);
          return (
            <div key={key} className="flex flex-col gap-2 px-5 py-5">
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-faint">
                {label}
              </span>
              <span className="tabular text-[32px] font-semibold leading-none text-text-primary">
                {v}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border px-5 py-2.5 text-[11px] text-text-faint">
        <span className="tabular">
          Period {period.from} → {period.to} · updated {period.updated}
        </span>
      </div>
    </section>
  );
}

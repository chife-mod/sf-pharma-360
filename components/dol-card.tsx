import Link from "next/link";

import { Chip } from "@/components/chip";
import { EmptyLine } from "@/components/empty-line";
import { SocialIcon } from "@/components/social-icon";
import { fmtN, fmtPct, type Dol } from "@/data/dols";

const KPI = [
  { key: "followers", label: "Followers" },
  { key: "posts", label: "Posts" },
  { key: "audienceComments", label: "Aud. comments" },
  { key: "commenters", label: "Commenters" },
  { key: "engagementRate", label: "ER" },
] as const;

export function DolCard({ dol }: { dol: Dol }) {
  const initials = dol.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const hasSignal = dol.signal.followers != null && dol.signal.followers > 0;

  return (
    <Link
      href={`/dols/${dol.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-surface transition hover:border-border-strong"
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-surface-elevated text-[12px] font-semibold text-text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-text-muted">
              {dol.channels.map((c) => (
                <SocialIcon key={c} channel={c} active={c === dol.primary} size={14} />
              ))}
            </div>
            <h3 className="mt-2 truncate text-[15px] font-semibold leading-snug tracking-[-0.01em] text-text-primary">
              {dol.name}
            </h3>
            <div className="mt-1 text-[12px] text-text-faint">
              {dol.city}, {dol.country}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Chip tone="cat-1">{dol.tier}</Chip>
          <Chip tone="default">{dol.kind}</Chip>
          <Chip tone="cat-2">{dol.audienceType}</Chip>
          <Chip>Gr.{dol.group}</Chip>
        </div>

        {dol.bio ? (
          <p className="line-clamp-2 text-[13px] leading-snug text-text-muted">{dol.bio}</p>
        ) : (
          <EmptyLine>No biography on file</EmptyLine>
        )}
      </div>

      <div className="grid grid-cols-5 gap-px border-t border-border bg-border">
        {KPI.map(({ key, label }) => {
          const raw = dol.signal[key];
          const value =
            key === "engagementRate"
              ? fmtPct(raw as number | null)
              : fmtN(raw as number | null);
          return (
            <div key={key} className="flex flex-col gap-1 bg-surface-elevated px-3 py-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-text-faint">
                {label}
              </span>
              <span className="tabular text-[15px] font-semibold leading-none text-text-primary">
                {hasSignal ? value : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}

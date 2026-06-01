import { IconAdjustmentsHorizontal, IconChevronDown } from "@tabler/icons-react";

const FILTERS = [
  "Audience size",
  "Country",
  "City",
  "Group",
  "Type",
  "Gender",
  "Channel",
];

export function FilterBar({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.01em] text-text-primary">
            DOLs
          </h1>
          <span className="tabular text-[13px] text-text-muted">
            {count.toLocaleString("fr-FR").replace(/ /g, " ")} tracked
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-text-muted">
          <span>Sort by</span>
          <button className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2 py-1 text-text-primary">
            Influencer name
            <IconChevronDown size={12} stroke={1.6} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="inline-flex h-7 items-center gap-1.5 rounded border border-border bg-surface px-2.5 text-[12px] font-medium text-text-primary hover:border-border-strong">
          <IconAdjustmentsHorizontal size={13} stroke={1.6} />
          Filters
        </button>
        {FILTERS.map((f) => (
          <button
            key={f}
            className="inline-flex h-7 items-center gap-1 rounded border border-border bg-transparent px-2.5 text-[12px] font-medium text-text-muted hover:border-border-strong hover:text-text-primary"
          >
            {f}
            <IconChevronDown size={11} stroke={1.6} />
          </button>
        ))}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  "cat-1": "bg-cat-1/70",
  "cat-2": "bg-cat-2/70",
  "cat-3": "bg-cat-3/70",
  "cat-4": "bg-cat-4/70",
};

export function BarList({
  data,
  tone = "cat-1",
  limit = 10,
}: {
  data: { label: string; value: number }[];
  tone?: keyof typeof TONE;
  limit?: number;
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const rows = data.slice(0, limit);
  return (
    <ul className="flex flex-col">
      {rows.map((row, i) => (
        <li
          key={row.label + i}
          className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border py-2 last:border-b-0"
        >
          <div className="flex flex-col gap-1.5">
            <span className="truncate text-[12px] text-text-primary">{row.label}</span>
            <span className="h-[3px] w-full overflow-hidden rounded-sm bg-border">
              <span
                className={cn("block h-full rounded-sm", TONE[tone])}
                style={{ width: `${(row.value / max) * 100}%` }}
              />
            </span>
          </div>
          <span className="tabular text-[12px] font-medium text-text-muted">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

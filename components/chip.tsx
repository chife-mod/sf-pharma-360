import { cn } from "@/lib/utils";

type Tone = "default" | "cat-1" | "cat-2" | "cat-3" | "cat-4";

const TONE: Record<Tone, string> = {
  default: "border-border-strong text-text-muted",
  "cat-1": "border-cat-1/30 text-cat-1",
  "cat-2": "border-cat-2/30 text-cat-2",
  "cat-3": "border-cat-3/30 text-cat-3",
  "cat-4": "border-cat-4/30 text-cat-4",
};

export function Chip({
  children,
  tone = "default",
  active = false,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded px-2 text-[12px] font-medium leading-none",
        "border bg-transparent",
        active && "border-transparent bg-surface-elevated text-text-primary",
        !active && TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

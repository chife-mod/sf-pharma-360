import { cn } from "@/lib/utils";

export function Section({
  title,
  hint,
  action,
  children,
  className,
}: {
  title: string;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[15px] font-medium uppercase tracking-[0.08em] text-text-primary">
            {title}
          </h2>
          {hint && <span className="text-[12px] text-text-faint">{hint}</span>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

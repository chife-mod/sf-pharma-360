import { DolCard } from "@/components/dol-card";
import { FilterBar } from "@/components/filter-bar";
import { KpiHero } from "@/components/kpi-hero";
import { SiteHeader } from "@/components/site-header";
import { DOLS } from "@/data/dols";

export default function DolsPage() {
  return (
    <>
      <SiteHeader />
      <KpiHero />
      <main className="mx-auto max-w-[1650px] px-6 py-10">
        <FilterBar count={234} />
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {DOLS.map((dol) => (
            <DolCard key={dol.id} dol={dol} />
          ))}
        </div>

        <nav
          aria-label="Pagination"
          className="mt-10 flex items-center justify-center gap-1 text-[13px]"
        >
          <button className="rounded px-2 py-1 text-text-faint hover:text-text-primary">«</button>
          <button className="rounded px-2 py-1 text-text-muted hover:text-text-primary">‹</button>
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <button
              key={p}
              className={
                "tabular size-7 rounded text-[13px] " +
                (p === 1
                  ? "bg-surface-elevated text-text-primary"
                  : "text-text-muted hover:bg-surface hover:text-text-primary")
              }
            >
              {p}
            </button>
          ))}
          <button className="rounded px-2 py-1 text-text-muted hover:text-text-primary">›</button>
          <button className="rounded px-2 py-1 text-text-faint hover:text-text-primary">»</button>
        </nav>
      </main>
    </>
  );
}

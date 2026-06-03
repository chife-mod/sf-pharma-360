"use client";

import { useMemo, useState } from "react";
import { Icons, channelMeta } from "./icons";
import { InfluencerCard } from "./influencer-card";
import { FilterPanel, emptyFilters, type FilterState } from "./filter-panel";
import { KpiHero } from "./kpi-hero";
import { Toolbar } from "./toolbar";
import {
  BUCKET_LABEL,
  DOLS,
  FILTER_DEFS,
  type Channel,
  type Dol,
  type SortKey,
} from "@/data/dols";

/* Verbatim port of App() from the v2 source bundle
 * (project/app/main.jsx). State: filters, query, sort,
 * showFilters. Renders Toolbar → FilterPanel + Grid, with
 * active-chips row above the grid when filters are set.
 */
export function Dashboard() {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const toggle = (key: string, opt: string) =>
    setFilters((f) => {
      const cur = f[key] || [];
      return {
        ...f,
        [key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
      };
    });

  const clearAll = () => {
    setFilters(emptyFilters());
    setQuery("");
  };

  const results = useMemo<Dol[]>(() => {
    let list = DOLS.filter((d) => {
      for (const def of FILTER_DEFS) {
        const sel = filters[def.key as string];
        if (!sel || !sel.length) continue;
        if (def.key === "channels") {
          if (!sel.some((s) => d.channels.includes(s as Channel))) return false;
        } else if (
          !sel.includes(
            (d as unknown as Record<string, string>)[def.key as string],
          )
        ) {
          return false;
        }
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !(
            d.name.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q) ||
            d.handle.toLowerCase().includes(q) ||
            d.country.toLowerCase().includes(q)
          )
        ) {
          return false;
        }
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "followers") return b.metrics.followers - a.metrics.followers;
      if (sort === "engagement") return b.metrics.engagement - a.metrics.engagement;
      if (sort === "posts") return b.metrics.posts - a.metrics.posts;
      return 0;
    });
    return list;
  }, [filters, query, sort]);

  // active filter chips
  const chips: { key: string; opt: string; label: string }[] = [];
  FILTER_DEFS.forEach((def) =>
    (filters[def.key as string] || []).forEach((opt) =>
      chips.push({
        key: def.key as string,
        opt,
        label:
          def.key === "channels"
            ? channelMeta[opt as Channel].name
            : def.key === "bucket"
            ? BUCKET_LABEL[opt as keyof typeof BUCKET_LABEL] || opt
            : opt,
      }),
    ),
  );

  return (
    <>
      <KpiHero />
      <Toolbar
        count={results.length}
        total={DOLS.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={setSort}
      />
      <div className={"layout" + (showFilters ? "" : " no-filters")}>
        <FilterPanel filters={filters} onToggle={toggle} onClear={clearAll} />
        <div className="dashboard-main">
          {chips.length ? (
            <div className="active-chips">
              {chips.map((ch) => (
                <div key={ch.key + ch.opt} className="achip">
                  <span>{ch.label}</span>
                  <span className="ax" onClick={() => toggle(ch.key, ch.opt)}>
                    <Icons.close />
                  </span>
                </div>
              ))}
              <button
                className="filter-clear"
                style={{ marginLeft: 4 }}
                onClick={clearAll}
              >
                Reset
              </button>
            </div>
          ) : null}
          <div className="grid">
            {results.length ? (
              results.map((d) => <InfluencerCard key={d.id} d={d} />)
            ) : (
              <div className="empty">
                <div className="empty-mark">
                  <Icons.emptyGlass />
                </div>
                <h4>No influencers match</h4>
                <p>
                  Try loosening a filter or clearing your search to widen the result set.
                </p>
                <button onClick={clearAll}>Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Icons, channelMeta } from "./icons";
import { InfluencerCard } from "./influencer-card";
import { CompareModal } from "./compare-modal";
import { FilterPanel, emptyFilters, type FilterState } from "./filter-panel";
import { KpiHero } from "./kpi-hero";
import { Toolbar } from "./toolbar";
import {
  BUCKET_LABEL,
  DOLS,
  FILTER_DEFS,
  SORTS,
  type Channel,
  type Dol,
  type SortDir,
  type SortKey,
} from "@/data/dols";

const FAV_KEY = "sf-pharma-360:favorites";
const COMPARE_MAX = 4;

export function Dashboard() {
  const [showFilters, setShowFilters] = useState(true); // desktop inline
  const [drawerOpen, setDrawerOpen] = useState(false); // ≤1024 drawer
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // favorites (persisted) + favorites-only filter
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favOnly, setFavOnly] = useState(false);
  // compare selection + modal
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  // transient toast (stub actions: report / export)
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => setToast(msg);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  // close the compare modal if the selection drops below 2
  useEffect(() => {
    if (compare.length < 2) setCompareOpen(false);
  }, [compare.length]);

  // hydrate favorites from localStorage (client only → no SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFav = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });

  const toggleCompare = (id: string) => {
    if (!compare.includes(id) && compare.length >= COMPARE_MAX) {
      showToast(`Compare up to ${COMPARE_MAX} DOLs at a time`);
      return;
    }
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };
  const clearCompare = () => setCompare([]);

  // picking a key resets to that key's sensible default direction
  const onSort = (key: SortKey) => {
    setSort(key);
    setSortDir((SORTS.find((s) => s.key === key)?.defaultDir as SortDir) ?? "asc");
  };
  const flipDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  const activeCount =
    Object.values(filters).reduce((a, v) => a + v.length, 0) + (favOnly ? 1 : 0);

  const onFilterButton = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1025px)").matches) {
      setShowFilters((s) => !s);
    } else {
      setDrawerOpen((o) => !o);
    }
  };

  // Esc closes the drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [drawerOpen]);

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
    setFavOnly(false);
  };

  const results = useMemo<Dol[]>(() => {
    let list = DOLS.filter((d) => {
      if (favOnly && !favorites.has(d.id)) return false;
      for (const def of FILTER_DEFS) {
        const sel = filters[def.key as string];
        if (!sel || !sel.length) continue;
        if (def.key === "channels") {
          if (!sel.some((s) => d.channels.includes(s as Channel))) return false;
        } else if (def.key === "brands") {
          if (!sel.some((s) => d.brands.includes(s))) return false;
        } else if (
          !sel.includes((d as unknown as Record<string, string>)[def.key as string])
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
      let cmp = 0;
      if (sort === "name") cmp = a.name.localeCompare(b.name);
      else if (sort === "followers") cmp = a.metrics.followers - b.metrics.followers;
      else if (sort === "engagement") cmp = a.metrics.engagement - b.metrics.engagement;
      else if (sort === "posts") cmp = a.metrics.posts - b.metrics.posts;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filters, query, sort, sortDir, favOnly, favorites]);

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
        onToggleFilters={onFilterButton}
        activeCount={activeCount}
        query={query}
        onQuery={setQuery}
        sort={sort}
        sortDir={sortDir}
        onSort={onSort}
        onFlipDir={flipDir}
      />
      <div
        className={
          "layout" +
          (showFilters ? "" : " no-filters") +
          (drawerOpen ? " drawer-open" : "")
        }
      >
        <div className="filters-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden />
        <FilterPanel
          filters={filters}
          onToggle={toggle}
          onClear={clearAll}
          onClose={() => setDrawerOpen(false)}
          resultCount={results.length}
          favOnly={favOnly}
          onToggleFavOnly={() => setFavOnly((v) => !v)}
          favCount={favorites.size}
        />
        <div className="dashboard-main">
          {chips.length || favOnly ? (
            <div className="active-chips">
              {favOnly ? (
                <div className="achip achip--fav">
                  <Icons.starFull />
                  <span>My Favorites</span>
                  <span className="ax" onClick={() => setFavOnly(false)}>
                    <Icons.close />
                  </span>
                </div>
              ) : null}
              {chips.map((ch) => (
                <div key={ch.key + ch.opt} className="achip">
                  <span>{ch.label}</span>
                  <span className="ax" onClick={() => toggle(ch.key, ch.opt)}>
                    <Icons.close />
                  </span>
                </div>
              ))}
              <button className="filter-clear" style={{ marginLeft: 4 }} onClick={clearAll}>
                Reset
              </button>
            </div>
          ) : null}
          <div className="grid">
            {results.length ? (
              results.map((d) => (
                <InfluencerCard
                  key={d.id}
                  d={d}
                  isFav={favorites.has(d.id)}
                  onToggleFav={toggleFav}
                  inCompare={compare.includes(d.id)}
                  onToggleCompare={toggleCompare}
                  onReport={(id) => {
                    const dol = DOLS.find((x) => x.id === id);
                    showToast(`“${dol?.name}” added to report — opens in Report Builder`);
                  }}
                />
              ))
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

      {/* compare selection bar — appears once 1+ cards are ticked */}
      {compare.length > 0 ? (
        <div className="compare-bar" role="region" aria-label="Compare selection">
          <span className="compare-count">
            <b>{compare.length}</b> selected{compare.length >= COMPARE_MAX ? " (max)" : ""}
          </span>
          <button
            type="button"
            className="compare-go"
            disabled={compare.length < 2}
            onClick={() => setCompareOpen(true)}
          >
            <Icons.trendUp /> Compare
          </button>
          <button type="button" className="compare-clear" onClick={clearCompare}>
            Clear
          </button>
        </div>
      ) : null}

      {compareOpen && compare.length >= 2 ? (
        <CompareModal
          dols={DOLS.filter((d) => compare.includes(d.id))}
          onClose={() => setCompareOpen(false)}
          onRemove={toggleCompare}
          onCreateReport={() => {
            const n = compare.length;
            setCompareOpen(false);
            showToast(`Report queued for ${n} DOL${n === 1 ? "" : "s"} — opens in Report Builder`);
          }}
        />
      ) : null}

      {toast ? (
        <div className="v2-toast" role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}

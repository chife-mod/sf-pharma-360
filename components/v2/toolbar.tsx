"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "./icons";
import { SORTS, type SortDir, type SortKey } from "@/data/dols";

type Props = {
  count: number;
  total: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeCount: number;
  query: string;
  onQuery: (v: string) => void;
  sort: SortKey;
  sortDir: SortDir;
  onSort: (s: SortKey) => void;
  onFlipDir: () => void;
};

export function Toolbar({
  count,
  total,
  showFilters,
  onToggleFilters,
  activeCount,
  query,
  onQuery,
  sort,
  sortDir,
  onSort,
  onFlipDir,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (ev: MouseEvent) => {
      if (ref.current && !ref.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cur = SORTS.find((s) => s.key === sort) ?? SORTS[0];

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button
          className={"toggle-filters" + (showFilters ? " is-open" : "")}
          onClick={onToggleFilters}
          aria-label="Filters"
        >
          <Icons.sliders />
          Filters
          {activeCount > 0 ? (
            <span className="tf-badge">{activeCount}</span>
          ) : null}
        </button>
        <div className="count-badge">
          <span className="count-num">{count}</span>
          <span className="count-label">
            {count === total ? "Influencers" : "of " + total + " influencers"}
          </span>
        </div>
      </div>
      <div className="toolbar-right">
        <label className="search">
          <Icons.search />
          <input
            type="text"
            placeholder="Search influencers…"
            value={query}
            onChange={(ev) => onQuery(ev.target.value)}
          />
        </label>
        {/* split-menu sort: label opens the key menu, the trailing icon
         * flips the direction (per the sort-UX research). */}
        <div className={"sort" + (open ? " open" : "")} ref={ref}>
          <button
            type="button"
            className="sort-trigger"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Icons.sort className="sort-ico" />
            <span className="sort-label">Sort</span>
            <span className="sort-value">{cur.label}</span>
            <Icons.chevron className="chev" />
          </button>
          <button
            type="button"
            className="sort-dir"
            onClick={onFlipDir}
            aria-label={
              sortDir === "asc"
                ? "Ascending — flip to descending"
                : "Descending — flip to ascending"
            }
            title="Flip sort direction"
          >
            {sortDir === "asc" ? <Icons.sortAsc /> : <Icons.sortDesc />}
          </button>
          {open ? (
            <div className="sort-menu">
              {SORTS.map((s) => {
                const isActive = s.key === sort;
                const dir = isActive ? sortDir : s.defaultDir;
                const phrase = dir === "asc" ? s.asc : s.desc;
                return (
                  <button
                    key={s.key}
                    type="button"
                    className={"sort-opt" + (isActive ? " sel" : "")}
                    onClick={() => {
                      onSort(s.key);
                      setOpen(false);
                    }}
                  >
                    <span className="sort-opt-label">{s.label}</span>
                    <span className="sort-opt-dir">{phrase}</span>
                    {isActive ? <Icons.check /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

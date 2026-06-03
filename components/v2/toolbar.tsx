"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "./icons";
import { SORTS, type SortKey } from "@/data/dols";

type Props = {
  count: number;
  total: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeCount: number;
  query: string;
  onQuery: (v: string) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
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
  onSort,
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
        <div
          className={"sort" + (open ? " open" : "")}
          ref={ref}
          onClick={() => setOpen((o) => !o)}
        >
          <Icons.sort style={{ width: 15, height: 15, color: "var(--text-dim)" }} />
          <span className="sort-label">Sort</span>
          <span className="sort-value">{cur.label}</span>
          <Icons.chevron className="chev" />
          {open ? (
            <div className="sort-menu" onClick={(ev) => ev.stopPropagation()}>
              {SORTS.map((s) => (
                <div
                  key={s.key}
                  className={"sort-opt" + (s.key === sort ? " sel" : "")}
                  onClick={() => {
                    onSort(s.key);
                    setOpen(false);
                  }}
                >
                  <span>{s.label}</span>
                  {s.key === sort ? <Icons.check /> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

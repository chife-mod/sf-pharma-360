"use client";

import { useState } from "react";
import { Icons, channelMeta } from "./icons";
import {
  BUCKET_LABEL,
  DOLS,
  FILTER_DEFS,
  type Channel,
  type Dol,
  type FilterDef,
} from "@/data/dols";

export type FilterState = Record<string, string[]>;

export function emptyFilters(): FilterState {
  return FILTER_DEFS.reduce<FilterState>((a, d) => {
    a[d.key as string] = [];
    return a;
  }, {});
}

type FilterPanelProps = {
  filters: FilterState;
  onToggle: (key: string, opt: string) => void;
  onClear: () => void;
  /* drawer mode (≤1024): close handler + live result count for the
   * sticky "Show N" apply button. Both no-ops / hidden on desktop. */
  onClose?: () => void;
  resultCount?: number;
  /* favorites-only toggle (client-side selection, not a Dol field).
   * Optional so the UIKit catalog can render the panel without it. */
  favOnly?: boolean;
  onToggleFavOnly?: () => void;
  favCount?: number;
};

export function FilterPanel({
  filters,
  onToggle,
  onClear,
  onClose,
  resultCount,
  favOnly = false,
  onToggleFavOnly,
  favCount = 0,
}: FilterPanelProps) {
  const total = Object.values(filters).reduce((a, v) => a + v.length, 0);
  return (
    <aside className="filters">
      <div className="filter-head">
        <h3>Filters</h3>
        <button className="filter-clear" disabled={!total && !favOnly} onClick={onClear}>
          {total || favOnly ? "Clear all" : "No filters"}
        </button>
        {/* drawer-only close (X) — hidden on desktop via CSS */}
        <button
          className="filter-close"
          aria-label="Close filters"
          onClick={onClose}
        >
          <Icons.close />
        </button>
      </div>

      <div className="filter-sections">
        {/* My Favorites — quick toggle (client-side selection) */}
        <button
          type="button"
          className={"filter-fav" + (favOnly ? " on" : "")}
          aria-pressed={favOnly}
          onClick={() => onToggleFavOnly?.()}
        >
          <span className="filter-fav-ico">
            {favOnly ? <Icons.starFull /> : <Icons.star />}
          </span>
          <span className="filter-fav-label">My Favorites</span>
          <span className="filter-fav-count">{favCount}</span>
        </button>

        {FILTER_DEFS.map((def, i) => (
          <FilterSection
            key={def.key as string}
            def={def}
            sel={filters[def.key as string] || []}
            onToggle={onToggle}
            openByDefault={i === 0}
          />
        ))}
      </div>

      {/* drawer-only sticky apply — hidden on desktop via CSS */}
      <div className="filter-apply">
        <button className="filter-apply-btn" onClick={onClose}>
          Show {resultCount ?? 0} result{resultCount === 1 ? "" : "s"}
        </button>
      </div>
    </aside>
  );
}

function FilterSection({
  def,
  sel,
  onToggle,
  openByDefault,
}: {
  def: FilterDef;
  sel: string[];
  onToggle: (key: string, opt: string) => void;
  openByDefault?: boolean;
}) {
  const [open, setOpen] = useState(!!openByDefault);
  const count = sel.length;

  const tally = (opt: string): number =>
    DOLS.filter((d: Dol) =>
      def.key === "channels"
        ? d.channels.includes(opt as Channel)
        : def.key === "brands"
        ? d.brands.includes(opt)
        : (d as unknown as Record<string, unknown>)[def.key as string] === opt
    ).length;

  return (
    <div className={"filter-section" + (open ? " open" : "")}>
      <button
        className="filter-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ft-label">{def.label}</span>
        <span className="ft-right">
          {count ? <span className="filter-count">{count}</span> : null}
          <span className="filter-plus" />
        </span>
      </button>
      <div className="filter-body">
        <div className="filter-body-inner">
          {def.type === "chips" ? (
            <div className="chip-grid">
              {def.options.map((opt) => {
                const meta = channelMeta[opt];
                const Icon = meta.icon;
                return (
                  <button
                    key={opt}
                    className={"fchip" + (sel.includes(opt) ? " on" : "")}
                    onClick={() => onToggle(def.key as string, opt)}
                  >
                    <Icon />
                    {meta.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="filter-options">
              {def.options.map((opt) => {
                const on = sel.includes(opt);
                const t = tally(opt);
                return (
                  <div
                    key={opt}
                    className={"opt" + (on ? " on" : "")}
                    onClick={() => onToggle(def.key as string, opt)}
                  >
                    <div className="opt-box">
                      <Icons.check />
                    </div>
                    <span className="opt-label">
                      {def.key === "bucket"
                        ? BUCKET_LABEL[opt as keyof typeof BUCKET_LABEL] || opt
                        : opt}
                    </span>
                    <span className="opt-tally">{t}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

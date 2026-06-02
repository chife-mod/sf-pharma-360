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
} from "@/app/concepts/v3/data";

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
};

export function FilterPanel({ filters, onToggle, onClear }: FilterPanelProps) {
  const total = Object.values(filters).reduce((a, v) => a + v.length, 0);
  return (
    <aside className="filters">
      <div className="filter-head">
        <h3>Filters</h3>
        <button
          className="filter-clear"
          disabled={!total}
          onClick={onClear}
        >
          {total ? "Clear all" : "No filters"}
        </button>
      </div>
      {FILTER_DEFS.map((def, i) => (
        <FilterSection
          key={def.key as string}
          def={def}
          sel={filters[def.key as string] || []}
          onToggle={onToggle}
          openByDefault={i === 0}
        />
      ))}
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

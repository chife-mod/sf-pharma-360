"use client";

import { Fragment, useEffect, type CSSProperties } from "react";
import { fmt, TIERS, BUCKET_LABEL, type Dol } from "@/data/dols";
import { Icons, channelMeta } from "./icons";
import { BrandMark } from "./brand-logos";

/* Side-by-side comparison of the DOLs picked via the card checkboxes.
 * Numeric rows highlight the leader. CSS lives in app/dols/v2.css (.cmp-*). */

const NUM_ROWS: { key: string; label: string; get: (d: Dol) => number; fmt: (v: number) => string }[] = [
  { key: "followers", label: "Followers", get: (d) => d.metrics.followers, fmt },
  { key: "engagement", label: "Engagement", get: (d) => d.metrics.engagement, fmt: (v) => v + "%" },
  { key: "posts", label: "Posts", get: (d) => d.metrics.posts, fmt },
  { key: "comments", label: "Comments", get: (d) => d.metrics.audienceComments, fmt },
  { key: "commenters", label: "Commenters", get: (d) => d.metrics.commenters, fmt },
];

export function CompareModal({
  dols,
  onClose,
  onRemove,
  onCreateReport,
}: {
  dols: Dol[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCreateReport?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const n = dols.length;

  return (
    <div className="cmp-root" role="dialog" aria-modal="true" aria-label="Compare DOLs">
      <div className="cmp-backdrop" onClick={onClose} />
      <div className="cmp-modal">
        <header className="cmp-headbar">
          <div className="cmp-headmain">
            <span className="cmp-eyebrow">Compare</span>
            <h3 className="cmp-title">{n} DOLs side by side</h3>
          </div>
          <button type="button" className="v2-icon-btn" onClick={onClose} aria-label="Close">
            <Icons.close size={18} />
          </button>
        </header>

        <div className="cmp-scroll">
          <div
            className="cmp-grid"
            style={{ gridTemplateColumns: `150px repeat(${n}, minmax(160px, 1fr))` }}
          >
            {/* header row */}
            <div className="cmp-rowlabel cmp-rowlabel--head" />
            {dols.map((d) => {
              const tier = TIERS[d.tier];
              return (
                <div key={d.id} className="cmp-colhead">
                  <button
                    type="button"
                    className="cmp-remove"
                    onClick={() => onRemove(d.id)}
                    aria-label={`Remove ${d.name}`}
                  >
                    <Icons.close size={13} />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="cmp-avatar" src={d.photo} alt={d.name} width={48} height={48} />
                  <span className="cmp-name">{d.name}</span>
                  <span className="cmp-tier" style={{ "--c": tier.color } as CSSProperties}>{d.tier}</span>
                </div>
              );
            })}

            {/* numeric rows — leader highlighted */}
            {NUM_ROWS.map((row) => {
              const vals = dols.map(row.get);
              const best = Math.max(...vals);
              return (
                <Fragment key={row.key}>
                  <div className="cmp-rowlabel">{row.label}</div>
                  {dols.map((d, i) => (
                    <div
                      key={d.id}
                      className={"cmp-cell cmp-num" + (vals[i] === best && best > 0 ? " best" : "")}
                    >
                      {row.fmt(vals[i])}
                    </div>
                  ))}
                </Fragment>
              );
            })}

            {/* audience tier */}
            <div className="cmp-rowlabel">Audience</div>
            {dols.map((d) => (
              <div key={d.id} className="cmp-cell cmp-muted">{BUCKET_LABEL[d.bucket]}</div>
            ))}

            {/* channels */}
            <div className="cmp-rowlabel">Channels</div>
            {dols.map((d) => (
              <div key={d.id} className="cmp-cell cmp-channels">
                {d.channels.map((c) => {
                  const I = channelMeta[c].icon;
                  return (
                    <span key={c} className="cmp-ch" style={{ color: channelMeta[c].color }} title={channelMeta[c].name}>
                      <I size={16} />
                    </span>
                  );
                })}
              </div>
            ))}

            {/* brands */}
            <div className="cmp-rowlabel">Top brands</div>
            {dols.map((d) => (
              <div key={d.id} className="cmp-cell cmp-brands">
                {d.brands.slice(0, 4).map((b) => (
                  <span key={b} title={b}><BrandMark name={b} size={18} /></span>
                ))}
                {d.brands.length > 4 ? <span className="cmp-more">+{d.brands.length - 4}</span> : null}
              </div>
            ))}

            {/* location */}
            <div className="cmp-rowlabel">Location</div>
            {dols.map((d) => (
              <div key={d.id} className="cmp-cell cmp-muted">{d.city}, {d.country}</div>
            ))}
          </div>
        </div>

        <footer className="cmp-foot">
          <button type="button" className="cmp-btn" onClick={onClose}>Close</button>
          <button type="button" className="cmp-btn cmp-btn--primary" onClick={() => onCreateReport?.()}>
            <Icons.doc size={15} /> Create report
          </button>
        </footer>
      </div>
    </div>
  );
}

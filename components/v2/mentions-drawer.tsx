"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { IconHeart } from "@tabler/icons-react";

import type { Mention } from "@/data/dol-detail";
import { fmt } from "@/data/dols";
import { Icons } from "./icons";
import { SocialLogo } from "./brand-logos";

/* Right slide-in panel listing the posts/comments behind a topic, brand
 * or hashtag. Replaces the old modal popup — scrolls cleanly and keeps the
 * page context visible behind it. CSS lives in app/dols/[id]/detail.css. */
export function MentionsDrawer({
  open,
  onClose,
  title,
  subtitle,
  accent = "var(--teal)",
  mentions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  accent?: string;
  mentions: Mention[];
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div className={"dd-drawer-root" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="dd-drawer-backdrop" onClick={onClose} />
      <aside
        className="dd-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Mentions of ${title}`}
        style={{ "--accent": accent } as CSSProperties}
      >
        <header className="dd-drawer-head">
          <div className="dd-drawer-headmain">
            <span className="dd-drawer-eyebrow">Mentions</span>
            <h3 className="dd-drawer-title">{title}</h3>
            {subtitle ? <span className="dd-drawer-sub">{subtitle}</span> : null}
          </div>
          <button type="button" className="v2-icon-btn" onClick={onClose} aria-label="Close">
            <Icons.close size={18} />
          </button>
        </header>

        <div className="dd-drawer-body">
          {mentions.map((m, i) => (
            <article key={`${m.author}-${m.date}-${i}`} className="dd-mention">
              <span className="dd-mention-ch">
                <SocialLogo channel={m.channel} size={26} />
              </span>
              <div className="dd-mention-main">
                <div className="dd-mention-top">
                  <span className="dd-mention-author">{m.author}</span>
                  <span className="dd-mention-date">{m.date}</span>
                </div>
                <p className="dd-mention-text">{m.text}</p>
                <div className="dd-mention-stats">
                  <span className="dd-mention-stat">
                    <IconHeart size={13} /> {fmt(m.likes)}
                  </span>
                  <span className="dd-mention-stat">
                    <Icons.comment size={13} /> {fmt(m.comments)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}

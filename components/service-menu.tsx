"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./service-menu.css";

type Concept = {
  id: string;
  label: string;
  desc: string;
  path: string;
};

const PROJECT_NAME = "SF Pharma 360";

const CONCEPTS: Concept[] = [
  {
    id: "v1-sterile-dark",
    label: "v1 — Sterile Dark",
    desc: "First polishing pass (rev 2). Committed baseline.",
    path: "/dols",
  },
  {
    id: "v2-pharma-os",
    label: "v2 — Pharma OS",
    desc: "Premium dark — aurora glass, neon accents (teal / magenta / orange / violet).",
    path: "/concepts/v2/dols",
  },
];

function findActive(pathname: string): Concept {
  const byPathLength = [...CONCEPTS].sort((a, b) => b.path.length - a.path.length);
  return byPathLength.find((c) => pathname.startsWith(c.path)) ?? CONCEPTS[0];
}

export function ServiceMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [gridOn, setGridOn] = useState(false);
  const active = findActive(pathname);

  useEffect(() => {
    try {
      setGridOn(localStorage.getItem("preview-grid") === "on");
    } catch {
      /* SSR or storage-disabled: ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest(".service-menu")) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleGrid = () => {
    const next = !gridOn;
    setGridOn(next);
    try {
      localStorage.setItem("preview-grid", next ? "on" : "off");
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className={`grid-overlay${gridOn ? " is-on" : ""}`}>
        <div className="grid-overlay__frame">
          <div className="grid-overlay__cols">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="grid-overlay__col" />
            ))}
          </div>
        </div>
      </div>

      <div className="service-menu" data-open={open ? "true" : "false"}>
        <button
          type="button"
          className={`grid-toggle${gridOn ? " is-on" : ""}`}
          aria-label="Toggle 12-column grid overlay"
          aria-pressed={gridOn}
          onClick={(e) => {
            e.stopPropagation();
            toggleGrid();
          }}
        >
          <SvgGrid />
        </button>

        <button
          type="button"
          className="service-menu__capsule"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Switch preview version"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          <SvgLayers />
          <span className="service-menu__label">{active.label}</span>
          <SvgCaret />
        </button>

        <div className="service-menu__panel" role="menu">
          <div className="service-menu__panel-header">
            {PROJECT_NAME} — Preview
          </div>
          <ul className="service-menu__list">
            {CONCEPTS.map((c) => (
              <li key={c.id}>
                <a
                  className="service-menu__item"
                  href={c.path}
                  role="menuitem"
                  data-active={c.id === active.id ? "true" : undefined}
                >
                  <div className="service-menu__item-title">{c.label}</div>
                  <div className="service-menu__item-desc">{c.desc}</div>
                </a>
              </li>
            ))}
          </ul>
          <div className="service-menu__footer">
            Internal preview · not for distribution
          </div>
        </div>
      </div>
    </>
  );
}

function SvgLayers() {
  return (
    <svg
      className="service-menu__icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3 2 8l10 5 10-5-10-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m2 16 10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgCaret() {
  return (
    <svg
      className="service-menu__caret"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgGrid() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
    </svg>
  );
}

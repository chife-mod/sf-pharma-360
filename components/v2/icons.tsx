/* v2 UI + social icons. Ported from the v2 source bundle
 * (project/app/icons.jsx). All glyphs share the same stroke style
 * (currentColor, 1.6 weight default) so they tint by parent text-color.
 */
import type { SVGProps } from "react";
import type { Channel } from "@/app/concepts/v2/data";

type Glyph = ((p?: SVGProps<SVGSVGElement>) => React.ReactElement) & {
  displayName?: string;
};

const stroke = (paths: string[], sw = 1.6): Glyph => {
  const Glyph: Glyph = (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
  Glyph.displayName = "StrokeGlyph";
  return Glyph;
};

export const Icons = {
  chevron: stroke(["M6 9l6 6 6-6"]),
  search: stroke(["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.3-4.3"]),
  sliders: stroke([
    "M4 6h10", "M18 6h2", "M4 12h2", "M10 12h10", "M4 18h8", "M16 18h4",
    "M14 4v4M6 10v4M12 16v4",
  ]),
  close: stroke(["M6 6l12 12", "M18 6L6 18"]),
  check: stroke(["M5 12.5l4.5 4.5L19 7"], 2.4),
  dots: stroke(["M12 6.2v.01", "M12 12v.01", "M12 17.8v.01"], 2.6),
  sort: stroke(["M7 5v14", "M4 8l3-3 3 3", "M17 19V5", "M14 16l3 3 3-3"]),
  bell: stroke([
    "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9",
    "M13.7 21a2 2 0 01-3.4 0",
  ]),
  arrowUp: stroke(["M12 19V5", "M6 11l6-6 6 6"], 2),
  arrowDownRight: stroke(["M7 7l10 10", "M17 9v8h-8"], 2),
  users: stroke([
    "M16 19v-1.5a4 4 0 00-4-4H6a4 4 0 00-4 4V19",
    "M9 9.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7",
    "M22 19v-1.5a4 4 0 00-3-3.87",
    "M16 2.6a4 4 0 010 7.75",
  ]),
  doc: stroke([
    "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z",
    "M14 3v5h5",
    "M9 13h6",
    "M9 17h4",
  ]),
  comment: stroke([
    "M21 11.5a8.5 8.5 0 01-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1121 11.5z",
  ]),
  commenters: stroke([
    "M17 18a5 5 0 00-10 0",
    "M12 13a3.5 3.5 0 100-7 3.5 3.5 0 000 7",
    "M21 20a7 7 0 00-3.5-5.5",
    "M3 20a7 7 0 013.5-5.5",
  ]),
  pulse: stroke(["M3 12h3l2.5-7 5 14L18 8l1.5 4H21"], 1.8),
  emptyGlass: stroke([
    "M11 19a8 8 0 100-16 8 8 0 000 16z",
    "M21 21l-4.3-4.3",
    "M8 11h6",
  ]),
} satisfies Record<string, Glyph>;

/* ---- social glyphs (brand paths, fill-based) ---- */

export const Social: Record<Channel, Glyph> = {
  facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
    </svg>
  ),
  instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <rect x={3} y={3} width={18} height={18} rx={5} />
      <circle cx={12} cy={12} r={4} />
      <circle cx={17.3} cy={6.7} r={0.9} fill="currentColor" stroke="none" />
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 3h3.2l-7 8 8.23 10h-6.44l-5.04-6.59L5.6 21H2.4l7.48-8.55L2 3h6.6l4.56 6.03L17.5 3zm-1.12 16.1h1.77L7.7 4.8H5.8l10.58 14.3z" />
    </svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6.94 5a1.94 1.94 0 11-3.88 0 1.94 1.94 0 013.88 0zM3.4 8.5h3.1V21H3.4V8.5zm5.16 0h2.97v1.7h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.7 2.06 3.7 4.74V21h-3.1v-5.62c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21h-3.1V8.5z" />
    </svg>
  ),
  youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.77-1.77C19.34 5.1 12 5.1 12 5.1s-7.34 0-8.83.43A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.77 1.77c1.49.43 8.83.43 8.83.43s7.34 0 8.83-.43a2.5 2.5 0 001.77-1.77C23 15.2 23 12 23 12zm-13.2 3.02V8.98L15.3 12l-5.5 3.02z" />
    </svg>
  ),
  tiktok: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M16.5 3c.36 2.1 1.7 3.7 3.9 3.86v2.6c-1.27.12-2.4-.2-3.7-.96v5.95c0 4.3-3.32 6.7-6.7 5.9-3.7-.9-4.9-5.3-2.3-7.9 1.1-1.1 2.7-1.6 4.3-1.3v2.8c-.4-.12-.8-.13-1.3-.04-1.07.2-1.86 1.2-1.6 2.4.27 1.27 1.8 1.85 2.9 1.13.7-.45.95-1.2.95-2V3h3.55z" />
    </svg>
  ),
  threads: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M16.3 11.5c-.1-.05-.2-.1-.3-.14-.18-3.2-1.95-5.05-4.9-5.07h-.05c-1.77 0-3.24.76-4.15 2.13l1.63 1.12c.68-1.03 1.74-1.25 2.52-1.25h.03c.97 0 1.7.28 2.17.84.34.4.57.96.68 1.66-.84-.14-1.74-.18-2.7-.12-2.72.16-4.47 1.74-4.35 3.95.06 1.12.62 2.08 1.57 2.71.8.53 1.84.79 2.92.73 1.42-.08 2.54-.62 3.32-1.62.59-.75.97-1.73 1.13-2.96.68.41 1.18.95 1.46 1.6.47 1.1.5 2.9-.97 4.37-1.29 1.29-2.84 1.85-5.18 1.86-2.6-.02-4.56-.85-5.83-2.46C5.13 17.15 4.5 14.95 4.48 12c.02-2.95.65-5.15 1.87-6.55C7.62 3.84 9.58 3.02 12.18 3c2.62.02 4.62.85 5.94 2.46.65.8 1.14 1.8 1.46 2.99l1.9-.5c-.4-1.48-1.03-2.76-1.88-3.81C17.92 2.05 15.4.97 12.19.95h-.02C8.96.97 6.47 2.06 4.79 4.18 3.3 6.05 2.53 8.66 2.5 11.99v.02c.03 3.33.8 5.94 2.29 7.81 1.68 2.12 4.17 3.21 7.38 3.23h.02c2.85-.02 4.86-.77 6.52-2.43 2.17-2.17 2.1-4.89 1.39-6.56-.51-1.2-1.48-2.17-2.8-2.56z" />
    </svg>
  ),
};

export const channelMeta: Record<Channel, { name: string; color: string; icon: Glyph }> = {
  facebook:  { name: "Facebook",  color: "#3B82F6", icon: Social.facebook },
  instagram: { name: "Instagram", color: "#E1306C", icon: Social.instagram },
  x:         { name: "X",         color: "#E7EAF0", icon: Social.x },
  linkedin:  { name: "LinkedIn",  color: "#3B9AE0", icon: Social.linkedin },
  youtube:   { name: "YouTube",   color: "#FF5A5A", icon: Social.youtube },
  tiktok:    { name: "TikTok",    color: "#22D3EE", icon: Social.tiktok },
  threads:   { name: "Threads",   color: "#CBD2E0", icon: Social.threads },
};

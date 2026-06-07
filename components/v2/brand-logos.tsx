/* Real social-network logos (app-tile style, brand colours) + pharma
 * brand wordmark monograms. Hand-authored inline SVG — deliberately NOT
 * the Tabler monochrome glyphs (those stay on the channel-switcher tabs).
 * Used in the DOL-detail Audience snapshot + mentions drawer + Brands. */

import { type Channel, BRAND_META } from "@/data/dols";
import { brandLogoUrl } from "@/data/brand-logos";
import { Social } from "./icons";

const R = 5.5; // tile corner radius at 24px viewBox

function Tile({ size, children, fill, gradient }: { size: number; children: React.ReactNode; fill?: string; gradient?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden role="img">
      {gradient ? (
        <>
          <defs>
            <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FEDA75" />
              <stop offset="0.35" stopColor="#FA7E1E" />
              <stop offset="0.62" stopColor="#D62976" />
              <stop offset="0.82" stopColor="#962FBF" />
              <stop offset="1" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
          <rect x="1.5" y="1.5" width="21" height="21" rx={R} fill="url(#ig-grad)" />
        </>
      ) : (
        <rect x="1.5" y="1.5" width="21" height="21" rx={R} fill={fill} />
      )}
      {children}
    </svg>
  );
}

/* full-bleed simple-icons positive glyphs → scaled white inside a tile */
function Glyph({ d, scale = 0.74 }: { d: string; scale?: number }) {
  const t = (24 - 24 * scale) / 2;
  return (
    <g transform={`translate(${t} ${t}) scale(${scale})`}>
      {/* evenodd so the inner counters (Threads @-loop, TikTok note) cut out */}
      <path d={d} fill="#fff" fillRule="evenodd" clipRule="evenodd" />
    </g>
  );
}

const X_PATH =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";
const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

export function SocialLogo({ channel, size = 20 }: { channel: Channel; size?: number }) {
  switch (channel) {
    case "facebook":
      return (
        <Tile size={size} fill="#1877F2">
          <path
            d="M13.55 21v-7.55h2.53l.38-2.94h-2.91V8.62c0-.85.24-1.43 1.46-1.43h1.56V4.56c-.27-.04-1.2-.12-2.26-.12-2.24 0-3.77 1.37-3.77 3.88v2.21H8.02v2.94h2.52V21z"
            fill="#fff"
          />
        </Tile>
      );
    case "youtube":
      return (
        <Tile size={size} fill="#FF0000">
          <path d="M9.6 8.3v7.4l6.2-3.7z" fill="#fff" />
        </Tile>
      );
    case "instagram":
      return (
        <Tile size={size} gradient>
          <rect x="6" y="6" width="12" height="12" rx="3.6" stroke="#fff" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.7" />
          <circle cx="16.1" cy="7.9" r="1.05" fill="#fff" />
        </Tile>
      );
    case "linkedin":
      return (
        <Tile size={size} fill="#0A66C2">
          <circle cx="7.3" cy="7.2" r="1.35" fill="#fff" />
          <rect x="6.1" y="9.6" width="2.4" height="8.4" fill="#fff" />
          <path
            d="M10.5 18V9.6h2.3v1.15h.03c.32-.6 1.1-1.23 2.27-1.23 2.43 0 2.88 1.5 2.88 3.46V18h-2.4v-3.62c0-.86-.02-1.97-1.2-1.97-1.2 0-1.38.94-1.38 1.91V18z"
            fill="#fff"
          />
        </Tile>
      );
    case "x":
      return (
        <Tile size={size} fill="#000">
          <Glyph d={X_PATH} scale={0.62} />
        </Tile>
      );
    case "tiktok":
      return (
        <Tile size={size} fill="#010101">
          <Glyph d={TIKTOK_PATH} scale={0.66} />
        </Tile>
      );
    case "threads": {
      // custom path kept rendering muddy at small sizes — use the clean
      // glyph on the black tile so it actually reads as Threads.
      const T = Social.threads;
      return (
        <span
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: size, height: size, borderRadius: Math.round(size * 0.27),
            background: "#000",
          }}
          aria-hidden
        >
          <T size={Math.round(size * 0.66)} color="#fff" />
        </span>
      );
    }
    default:
      return null;
  }
}

/* Real pharma logo seated in a white tile (so the dark-/coloured-ink
 * wordmarks stay legible on the dark page). Falls back to the BrandMark
 * monogram when MinIO had no asset (e.g. Pfizer). `pad` is inset in px so
 * the wordmark breathes inside the tile. */
export function BrandLogoTile({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const url = brandLogoUrl(name);
  if (!url) {
    // no real asset → brand-name wordmark text on the SAME white tile (so it
    // sits consistently beside the real logo lockups), coloured with the
    // brand hue. Never an empty square. (MINIO_WORKFLOW.md §8 fallback rule.)
    const color = BRAND_META[name]?.color ?? "#3A3D52";
    return (
      <span className={"dd-bv-logo " + (className ?? "")}>
        <span className="dd-bv-wordmark" style={{ color }}>
          {name}
        </span>
      </span>
    );
  }
  return (
    <span className={"dd-bv-logo " + (className ?? "")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={name} loading="lazy" />
    </span>
  );
}

/* pharma brand chip mark — coloured rounded tile + white monogram.
 * (No open icon set exists for pharma logos; this is an honest wordmark
 * treatment for the prototype — real logo assets can drop in later.) */
export function BrandMark({ name, size = 24 }: { name: string; size?: number }) {
  const meta = BRAND_META[name] ?? { color: "#3A3D52", mono: name.slice(0, 1) };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden role="img">
      <rect x="0" y="0" width="24" height="24" rx="6" fill={meta.color} />
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font), Inter, system-ui, sans-serif"
        fill="#fff"
      >
        {meta.mono}
      </text>
    </svg>
  );
}

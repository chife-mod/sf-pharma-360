/* Real social-network logos (app-tile style, brand colours) + pharma
 * brand wordmark monograms. Hand-authored inline SVG — deliberately NOT
 * the Tabler monochrome glyphs (those stay on the channel-switcher tabs).
 * Used in the DOL-detail Audience snapshot + mentions drawer + Brands. */

import { type Channel, BRAND_META } from "@/data/dols";

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
      <path d={d} fill="#fff" />
    </g>
  );
}

const X_PATH =
  "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";
const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
const THREADS_PATH =
  "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.168 1.43 1.78 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.74-1.752-.51-.586-1.297-.886-2.336-.893h-.036c-.835 0-1.965.23-2.686 1.31l-1.687-1.135c.96-1.43 2.519-2.214 4.388-2.214h.052c3.117.02 4.974 1.935 5.16 5.273.107.045.213.092.317.141 1.475.69 2.555 1.738 3.124 3.029.792 1.79.866 4.71-1.491 7.026-1.802 1.766-3.989 2.564-7.063 2.585zm1.86-9.495c-.273 0-.55.009-.832.025-1.838.103-2.978.946-2.914 2.143.066 1.243 1.435 1.821 2.752 1.75 1.211-.065 2.793-.535 3.058-3.624a10.59 10.59 0 0 0-2.064-.293z";

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
    case "threads":
      return (
        <Tile size={size} fill="#000">
          <Glyph d={THREADS_PATH} scale={0.68} />
        </Tile>
      );
    default:
      return null;
  }
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

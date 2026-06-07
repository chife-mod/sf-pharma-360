/* Real pharma brand logos pulled from MinIO bucket `sf-ai`
 * (objects-logos/ct_brand_*.png) via scripts/download_pharma_logos.cjs.
 * Files live in public/assets/brand-logos/. The manifest maps a brand
 * display name → its file (or null when the bucket had no asset → UI
 * falls back to the BrandMark monogram). Logos are full-colour wordmark
 * lockups on transparent/white grounds, so they MUST sit in a white tile
 * to stay legible on the dark page. */
import manifest from "./brand-logos-manifest.json";

/* Raw <img src> is NOT basePath-aware in Next (only next/image / next/link
 * are). On GH Pages the app lives under /sf-pharma-360, so prefix manually. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Entry = { file: string; ext: string; matchedSlug: string } | null;
const MAP = manifest as Record<string, Entry>;

/** Public URL of a brand's real logo, or null if none was found in MinIO. */
export function brandLogoUrl(name: string): string | null {
  const e = MAP[name];
  return e ? `${BASE}/assets/brand-logos/${e.file}` : null;
}

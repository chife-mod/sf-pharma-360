import "./v2.css";

import { AppBgV2 } from "@/components/v2/app-bg-v2";
import { SiteHeaderV2 } from "@/components/v2/site-header-v2";

/**
 * Layout for /concepts/v3/* routes. Wraps every v2 page with:
 * - .v2-root scope (OKLCH-ish token block + Inter Tight body font)
 * - AppBgV2 immersive backdrop (fixed gradients + 64px grid)
 * - v2 TopBar (brand + nav, Figma 370:6560 right cluster)
 * - .v2-shell content rail (max-w 1480, px-28, pb-80)
 *
 * Service-menu pill from the root layout still renders on top —
 * concept switcher lives outside the v2 chrome.
 */
export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v2-root">
      <AppBgV2 />
      <SiteHeaderV2 />
      <div className="v2-shell">{children}</div>
    </div>
  );
}

import "./v2.css";

import { AppBgV2 } from "@/components/v2/app-bg-v2";
import { SiteHeaderV2 } from "@/components/v2/site-header-v2";

/**
 * Layout for the /dols route. Wraps the page with:
 * - .v2-root scope (token block + Inter Tight body font)
 * - AppBgV2 immersive backdrop (fixed gradients + 64px grid)
 * - SiteHeaderV2 top bar (brand + nav + right cluster)
 * - .v2-shell content rail (max-w 1650, px-24, pb-80)
 *
 * Service-menu pill from the root layout still renders on top.
 */
export default function DolsLayout({
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

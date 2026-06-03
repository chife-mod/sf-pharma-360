/**
 * v2 immersive backdrop. Fixed behind everything:
 * - layered radial gradients (teal/violet/magenta blobs at corners)
 * - a faint square grid (.v2-app-grid) bound to the content rail
 *   (max-w 1650, centered, 24px gutters) — starts at the content's left
 *   edge, clips at the right (background-clip: content-box).
 */
export function AppBgV2() {
  return (
    <div className="v2-app-bg" aria-hidden>
      <div className="v2-app-grid" />
    </div>
  );
}

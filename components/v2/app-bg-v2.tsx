/**
 * v2 immersive backdrop. Fixed behind everything:
 * - layered radial gradients (teal/violet/magenta blobs at corners)
 * - faint horizontal rule lines (.v2-app-bg::after)
 * - a 12-column vertical guide (.v2-app-grid) bound to the SAME content
 *   rail as the layout (max-w 1650, centered, 24px gutters, 16px gaps),
 *   so the background grid lines up with the real columns.
 */
export function AppBgV2() {
  return (
    <div className="v2-app-bg" aria-hidden>
      <div className="v2-app-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

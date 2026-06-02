/**
 * v2 immersive backdrop. Fixed-position behind everything: layered
 * radial gradients (teal/violet/magenta blobs at corners) + a 64px
 * grid overlay masked to fade from the top. Verbatim port of `.app-bg`
 * from the v2 source bundle (project/app/styles.css).
 */
export function AppBgV2() {
  return <div className="v2-app-bg" aria-hidden />;
}

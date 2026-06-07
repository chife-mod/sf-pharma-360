/**
 * Normalize brand logos to ONE uniform square so the brand wall reads evenly.
 * Pristine MinIO originals live in scripts/brand-logos-raw/ (re-runnable):
 *   raw → flatten onto white → trim to real content → fit into a uniform inner
 *   box → center on a CANVAS×CANVAS white square → write public/assets/brand-logos/.
 * Result: every logo has the SAME baked margin + the same visual footprint, no
 * per-image built-in padding, nothing clipped (Lilly's left swash included).
 * Run: node scripts/normalize_logos.cjs
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAW = path.join(__dirname, "brand-logos-raw");
const OUT = path.join(__dirname, "..", "public", "assets", "brand-logos");
const CANVAS = 256; // output square
const INNER = 200; // logo fits inside this → (256-200)/2 = 28px uniform margin
const WHITE = { r: 255, g: 255, b: 255 };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(RAW).filter((f) => f.endsWith(".png"));
  for (const f of files) {
    const src = path.join(RAW, f);
    // 1) flatten any alpha onto white so RGB + RGBA sources behave identically
    // 2) trim the white border down to the real logo content
    const trimmed = await sharp(src)
      .flatten({ background: WHITE })
      .trim({ background: WHITE, threshold: 18 })
      .toBuffer();
    // 3) scale the content to fit the uniform inner box (enlarge small ones too)
    const fitted = await sharp(trimmed)
      .resize(INNER, INNER, { fit: "inside", withoutEnlargement: false })
      .toBuffer({ resolveWithObject: true });
    const { width, height } = fitted.info;
    const left = Math.round((CANVAS - width) / 2);
    const top = Math.round((CANVAS - height) / 2);
    // 4) center on a uniform white square → identical margin for every brand
    await sharp({
      create: { width: CANVAS, height: CANVAS, channels: 3, background: WHITE },
    })
      .composite([{ input: fitted.data, left, top }])
      .png()
      .toFile(path.join(OUT, f) + ".tmp");
    fs.renameSync(path.join(OUT, f) + ".tmp", path.join(OUT, f));
    console.log(`${f.padEnd(28)} content ${width}x${height} → ${CANVAS}x${CANVAS}`);
  }
  console.log(`\nDone: ${files.length} logos normalized to ${CANVAS}px (inner ${INNER}px).`);
})();

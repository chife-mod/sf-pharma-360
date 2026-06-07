/**
 * MinIO pharma-logo downloader. Probes objects-logos/ct_brand_{slug}.{svg|png}
 * for the 8 pharma brands used on the DOL detail page. Writes found assets to
 * public/assets/brand-logos/ and a manifest to data/brand-logos-manifest.json.
 * Full workflow: ../wwg-2026-novelties-redesign/MINIO_WORKFLOW.md
 * Run: node scripts/refresh_cookies.cjs && node scripts/download_pharma_logos.cjs
 */
const fs = require('fs')
const https = require('https')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const BASE = 'https://sa.minio-admin.semanticforce.ai'
const BUCKET = 'sf-ai'
const COOKIES = path.join(ROOT, 'cookies.txt')
const OUT_DIR = path.join(ROOT, 'public/assets/brand-logos')
const MANIFEST = path.join(ROOT, 'data/brand-logos-manifest.json')

const token = fs.readFileSync(COOKIES, 'utf8').trim().split('\t').pop().trim()
console.log(`token: ${token.slice(0, 8)}…(${token.length})`)
const b64 = (s) => Buffer.from(s).toString('base64')

function tryDownload(remotePath, localDest) {
  return new Promise((resolve) => {
    const url = `${BASE}/api/v1/buckets/${BUCKET}/objects/download?prefix=${b64(remotePath)}`
    https
      .get(url, { headers: { Cookie: 'token=' + token } }, (res) => {
        if (res.statusCode === 200) {
          fs.mkdirSync(path.dirname(localDest), { recursive: true })
          const file = fs.createWriteStream(localDest)
          res.pipe(file)
          file.on('finish', () => {
            file.close()
            const size = fs.statSync(localDest).size
            if (size === 0) { fs.unlinkSync(localDest); console.log(`  ✗ empty ${remotePath}`); resolve(false); return }
            console.log(`  ✓ ${remotePath} (${size}b)`)
            resolve(true)
          })
        } else {
          let body = ''
          res.on('data', (c) => (body += c))
          res.on('end', () => {
            const hint = res.statusCode >= 500 ? ` — ${body.slice(0, 100)}` : ''
            console.log(`  ✗ ${res.statusCode} ${remotePath}${hint}`)
            resolve(false)
          })
        }
      })
      .on('error', (e) => { console.log(`  ! ${e.message} ${remotePath}`); resolve(false) })
  })
}

async function findLogo(name, slugs) {
  console.log(`\n[${name}]`)
  for (const slug of slugs) {
    for (const ext of ['svg', 'png']) {
      const remote = `objects-logos/ct_brand_${slug}.${ext}`
      const local = path.join(OUT_DIR, `${slugs[0]}.${ext}`)
      if (await tryDownload(remote, local)) return { file: `${slugs[0]}.${ext}`, ext, matchedSlug: slug }
    }
  }
  return null
}

const BRANDS = [
  { name: 'Novo Nordisk',         slugs: ['novo_nordisk', 'novonordisk', 'novo'] },
  { name: 'Eli Lilly',            slugs: ['eli_lilly', 'lilly', 'eli_lilly_and_company', 'elililly'] },
  { name: 'Pfizer',               slugs: ['pfizer'] },
  { name: 'AstraZeneca',          slugs: ['astrazeneca', 'astra_zeneca'] },
  { name: 'Sanofi',               slugs: ['sanofi', 'sanofi_aventis'] },
  { name: 'Boehringer Ingelheim', slugs: ['boehringer_ingelheim', 'boehringer', 'boehringeringelheim'] },
  { name: 'Bayer',                slugs: ['bayer'] },
  { name: 'Merck',                slugs: ['merck', 'merck_co', 'msd'] },
]

;(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const manifest = {}
  let found = 0
  for (const b of BRANDS) {
    const res = await findLogo(b.name, b.slugs)
    manifest[b.name] = res
    if (res) found++
  }
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\n── итог: ${found}/${BRANDS.length} ──`)
  const missing = Object.entries(manifest).filter(([, v]) => !v).map(([k]) => k)
  if (missing.length) console.log(`нет в бакете (текстовый fallback): ${missing.join(', ')}`)
})()

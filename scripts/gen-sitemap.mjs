// Post-build: scan dist/ for rendered HTML pages and emit dist/sitemap.xml.
// Because it runs after vite-ssg, it automatically includes exactly the pages
// that were built — i.e. only PUBLISHED blog posts (future-dated ones appear
// once the daily rebuild renders them). Blog posts get a <lastmod> from their
// publish date. Each URL lists hreflang alternates for its de/en twin.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = 'dist'
const BASE = 'https://kipphard.com'
const BLOG_SRC = 'src/content/blog'

// Shared product-slug map (canonical German id -> English slug) — single source of
// truth, also used by src/lib/i18n-routing.ts.
const EN_SLUG = JSON.parse(readFileSync('src/lib/product-slugs.json', 'utf8'))
const DE_BY_EN = Object.fromEntries(Object.entries(EN_SLUG).map(([de, en]) => [en, de]))

function translateProductSeg(path, dir) {
  const m = path.match(/^\/products\/([^/]+)(\/.*)?$/)
  if (!m) return path
  const slug = m[1]
  const rest = m[2] ?? ''
  if (dir === 'de2en') return EN_SLUG[slug] ? `/products/${EN_SLUG[slug]}${rest}` : path
  return DE_BY_EN[slug] ? `/products/${DE_BY_EN[slug]}${rest}` : path
}

// Neutral (German, no prefix) form of any path.
function neutralOf(path) {
  if (path === '/en') return '/'
  if (path.startsWith('/en/')) return translateProductSeg(path.slice(3), 'en2de')
  return path
}
function dePath(path) {
  return neutralOf(path)
}
function enPath(path) {
  const en = translateProductSeg(neutralOf(path), 'de2en')
  return en === '/' ? '/en' : '/en' + en
}

const blogDates = {}
if (existsSync(BLOG_SRC)) {
  for (const slug of readdirSync(BLOG_SRC)) {
    const metaPath = join(BLOG_SRC, slug, 'meta.json')
    if (existsSync(metaPath)) {
      try {
        blogDates[slug] = JSON.parse(readFileSync(metaPath, 'utf8')).publishedAt
      } catch {
        /* ignore malformed meta */
      }
    }
  }
}

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (entry.endsWith('.html')) out.push(full)
  }
  return out
}

const paths = [
  ...new Set(
    walk(DIST)
      .map((f) => relative(DIST, f).split(sep).join('/'))
      .filter((f) => f !== '404.html' && f !== 'en/404.html')
      .map((f) => (f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, ''))),
  ),
].sort()

function entry(path) {
  const m = path.match(/^(?:\/en)?\/blog\/(.+)$/)
  const lastmod = m && blogDates[m[1]] ? `\n    <lastmod>${blogDates[m[1]]}</lastmod>` : ''
  const de = dePath(path)
  const en = enPath(path)
  const alts =
    `\n    <xhtml:link rel="alternate" hreflang="de" href="${BASE}${de}"/>` +
    `\n    <xhtml:link rel="alternate" hreflang="en" href="${BASE}${en}"/>` +
    `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${de}"/>`
  return `  <url>\n    <loc>${BASE}${path}</loc>${lastmod}${alts}\n  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(entry).join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), xml)
console.log(`[sitemap] ${paths.length} urls -> dist/sitemap.xml`)

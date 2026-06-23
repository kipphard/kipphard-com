// Post-build: scan dist/ for rendered HTML pages and emit dist/sitemap.xml.
// Because it runs after vite-ssg, it automatically includes exactly the pages
// that were built — i.e. only PUBLISHED blog posts (future-dated ones appear
// once the daily rebuild renders them). Blog posts get a <lastmod> from their
// publish date.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = 'dist'
const BASE = 'https://kipphard.com'
const BLOG_SRC = 'src/content/blog'

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
      .filter((f) => f !== '404.html')
      .map((f) => (f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, ''))),
  ),
].sort()

function entry(path) {
  const m = path.match(/^\/blog\/(.+)$/)
  const lastmod = m && blogDates[m[1]] ? `\n    <lastmod>${blogDates[m[1]]}</lastmod>` : ''
  return `  <url>\n    <loc>${BASE}${path}</loc>${lastmod}\n  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(entry).join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), xml)
console.log(`[sitemap] ${paths.length} urls -> dist/sitemap.xml`)

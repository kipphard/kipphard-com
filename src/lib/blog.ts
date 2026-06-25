// Blog content layer. Posts live in src/content/blog/<slug>/{meta.json, de.html, en.html}.
// No runtime markdown dependency — bodies are authored as HTML and injected directly.
// Publish-date gating uses the build timestamp (__BUILD_TIME__) so SSG output and client
// hydration agree on which posts are live; the daily server rebuild advances that cutoff,
// which is what makes scheduled posts go live on their date (with a correct sitemap).

export type BlogLang = 'de' | 'en'

interface LangMeta {
  title: string
  /** Optional shorter title used only for the document <title> / SERP; the
   *  on-page <h1> and JSON-LD headline keep using `title`. Falls back to
   *  `title` when absent. */
  seoTitle?: string
  description: string
  excerpt: string
}

interface RawMeta {
  category: string
  tags: string[]
  publishedAt: string
  featured?: boolean
  de: LangMeta
  en: LangMeta
}

export interface BlogPost {
  slug: string
  category: string
  tags: string[]
  publishedAt: string
  publishedDate: Date
  featured: boolean
  de: LangMeta & { body: string }
  en: LangMeta & { body: string }
}

declare const __BUILD_TIME__: string
const BUILD_NOW = new Date(typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now())

const metaModules = import.meta.glob('../content/blog/*/meta.json', { eager: true }) as Record<
  string,
  { default: RawMeta }
>
const bodyModules = import.meta.glob('../content/blog/*/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function slugFromPath(path: string): string {
  const m = path.match(/\/blog\/([^/]+)\//)
  return m ? m[1] : path
}

const posts: BlogPost[] = Object.entries(metaModules)
  .map(([path, mod]) => {
    const slug = slugFromPath(path)
    const meta = mod.default
    return {
      slug,
      category: meta.category,
      tags: meta.tags ?? [],
      publishedAt: meta.publishedAt,
      publishedDate: new Date(meta.publishedAt),
      featured: meta.featured ?? false,
      de: { ...meta.de, body: bodyModules[`../content/blog/${slug}/de.html`] ?? '' },
      en: { ...meta.en, body: bodyModules[`../content/blog/${slug}/en.html`] ?? '' },
    }
  })
  .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())

export function isPublished(post: BlogPost, now: Date = BUILD_NOW): boolean {
  return post.publishedDate.getTime() <= now.getTime()
}

/** All posts whose publish date has arrived as of the build, newest first. */
export function publishedPosts(): BlogPost[] {
  return posts.filter((p) => isPublished(p))
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

/** Most recent published posts, optionally excluding one slug. */
export function recentPosts(n: number, exclude?: string): BlogPost[] {
  return publishedPosts()
    .filter((p) => p.slug !== exclude)
    .slice(0, n)
}

/** Posts related to the given one: same category first, then recent fillers. */
export function relatedPosts(post: BlogPost, n: number): BlogPost[] {
  const pool = publishedPosts().filter((p) => p.slug !== post.slug)
  const sameCat = pool.filter((p) => p.category === post.category)
  const rest = pool.filter((p) => p.category !== post.category)
  return [...sameCat, ...rest].slice(0, n)
}

export interface CategoryCount {
  key: string
  count: number
}

/** Distinct categories among published posts, with counts, most-used first. */
export function categories(): CategoryCount[] {
  const counts = new Map<string, number>()
  for (const p of publishedPosts()) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
}

/** Rough reading time in minutes from an HTML body (~200 wpm). */
export function readingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(dateStr: string, lang: BlogLang): string {
  return new Date(dateStr).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

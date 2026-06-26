// Single source of truth for locale-prefixed routing.
//
// German is the canonical/neutral locale and lives at the root (`/...`).
// English lives under `/en/...`. Only product slugs are translated between
// locales; every other path segment (work, blog, top-level) is identical and
// merely gains the `/en` prefix.
//
// The product-slug map is kept in product-slugs.json so the (non-TS) sitemap
// script can read the same data — keep that file as the only place to edit slugs.
import EN_SLUG from './product-slugs.json'

export type Locale = 'de' | 'en'
export const LOCALES: Locale[] = ['de', 'en']
export const DEFAULT_LOCALE: Locale = 'de'

// Canonical product id === German slug (matches products.items[].id in both locale files).
const EN_SLUGS: Record<string, string> = EN_SLUG

// Canonical product ids (= German slugs), in declaration order. Used to build routes.
export const PRODUCT_IDS: string[] = Object.keys(EN_SLUGS)

export function localeFromPath(path: string): Locale {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'de'
}

// canonical id -> URL slug in the given locale
export function productSlug(id: string, locale: Locale): string {
  return locale === 'en' ? EN_SLUGS[id] ?? id : id
}

// URL slug (in the given locale) -> canonical id, or null if it isn't a known product
export function productIdFromSlug(slug: string, locale: Locale): string | null {
  if (locale === 'en') {
    for (const [id, en] of Object.entries(EN_SLUGS)) if (en === slug) return id
    return null
  }
  return Object.prototype.hasOwnProperty.call(EN_SLUGS, slug) ? slug : null
}

// Strip the `/en` prefix -> the neutral (German) path.
function stripPrefix(path: string): string {
  if (path === '/en') return '/'
  if (path.startsWith('/en/')) return path.slice(3) // '/en/products' -> '/products'
  return path
}

// Translate a leading `/products/<slug>` segment from one locale's slug to another's.
function translateProductSegment(path: string, from: Locale, to: Locale): string {
  const m = path.match(/^\/products\/([^/]+)(\/.*)?$/)
  if (!m) return path
  const id = productIdFromSlug(m[1], from)
  if (!id) return path
  return `/products/${productSlug(id, to)}${m[2] ?? ''}`
}

// Build a path in `target` locale given a path written in `current` locale.
// Preserves `?query` and `#hash`. Internal `to=` strings are authored in neutral
// (German) form, so components call this with current='de'.
export function toLocalePath(rawPath: string, target: Locale, current: Locale): string {
  const hashIdx = rawPath.indexOf('#')
  const hash = hashIdx >= 0 ? rawPath.slice(hashIdx) : ''
  const noHash = hashIdx >= 0 ? rawPath.slice(0, hashIdx) : rawPath
  const qIdx = noHash.indexOf('?')
  const query = qIdx >= 0 ? noHash.slice(qIdx) : ''
  const pathOnly = qIdx >= 0 ? noHash.slice(0, qIdx) : noHash

  // 1. Normalise to the canonical neutral path (German slug, no prefix).
  let neutral = current === 'en' ? stripPrefix(pathOnly) : pathOnly
  if (current === 'en') neutral = translateProductSegment(neutral, 'en', 'de')

  // 2. Emit in the target locale.
  let out = neutral
  if (target === 'en') out = translateProductSegment(out, 'de', 'en')
  const prefixed = target === 'en' ? (out === '/' ? '/en' : '/en' + out) : out

  return prefixed + query + hash
}

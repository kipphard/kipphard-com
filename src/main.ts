import { ViteSSG } from 'vite-ssg'
import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import './styles/main.scss'
import Home from './pages/Home.vue'
import Impressum from './pages/Impressum.vue'
import Datenschutz from './pages/Datenschutz.vue'
import CaseStudy from './pages/CaseStudy.vue'
import Products from './pages/Products.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Blog from './pages/Blog.vue'
import BlogPost from './pages/BlogPost.vue'
import NotFound from './pages/NotFound.vue'
import { trackPageview } from './lib/consent'
import { publishedPosts } from './lib/blog'
import { LOCALES, PRODUCT_IDS, localeFromPath, productSlug } from './lib/i18n-routing'

// Neutral (German/root) route descriptors. English variants are derived by
// prefixing `/en` and translating the product slug — see buildRoutes().
type RouteDesc = { path: string; component: Component }

const baseRoutes: RouteDesc[] = [
  { path: '/', component: Home },
  { path: '/impressum', component: Impressum },
  { path: '/datenschutz', component: Datenschutz },
  { path: '/work/wickie', component: CaseStudy },
  { path: '/work/profit-prime', component: CaseStudy },
  { path: '/work/augusta-beauty', component: CaseStudy },
  { path: '/work/lipold', component: CaseStudy },
  { path: '/work/pigmentfrei', component: CaseStudy },
  { path: '/products', component: Products },
  { path: '/blog', component: Blog },
  { path: '/blog/:slug', component: BlogPost },
]

function buildRoutes(): RouteRecordRaw[] {
  const routes: RouteDesc[] = []
  for (const loc of LOCALES) {
    const prefix = loc === 'en' ? '/en' : ''
    for (const r of baseRoutes) {
      const path = r.path === '/' ? prefix || '/' : prefix + r.path
      routes.push({ path, component: r.component })
    }
    // Product detail: one route per product, with the locale's slug.
    for (const id of PRODUCT_IDS) {
      routes.push({ path: `${prefix}/products/${productSlug(id, loc)}`, component: ProductDetail })
    }
  }
  // 404 / catch-alls — English first, root global last.
  routes.push({ path: '/en/404', component: NotFound })
  routes.push({ path: '/en/:pathMatch(.*)*', component: NotFound })
  routes.push({ path: '/404', component: NotFound })
  routes.push({ path: '/:pathMatch(.*)*', component: NotFound })
  return routes as RouteRecordRaw[]
}

const routes = buildRoutes()

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' }
      return { top: 0 }
    },
  },
  ({ app, router, isClient }) => {
    const i18n = createI18n({
      legacy: false,
      locale: 'de',
      fallbackLocale: 'en',
      messages: { de, en },
    })
    app.use(i18n)

    // Client-only: honour a stored language preference for the bare root.
    // Runs only in the browser so SSG always prerenders `/` as German (x-default).
    if (isClient) {
      router.beforeEach((to) => {
        if (to.path === '/' && localStorage.getItem('ak-lang') === 'en') return '/en'
      })
    }

    // The URL is the source of truth for locale. Runs during prerender and on the
    // client before render, so each page renders (and hydrates) in the right language.
    router.beforeEach((to) => {
      const want = localeFromPath(to.path)
      if (i18n.global.locale.value !== want) i18n.global.locale.value = want
    })

    // Send GA4 page_view on client-side route changes (consent-gated inside).
    if (isClient) {
      router.afterEach((to) => trackPageview(to.path))
    }
  },
)

// vite-ssg picks up this named export to enumerate which routes to pre-render.
// Param routes (/blog/:slug) can't auto-enumerate, so emit one static page per
// PUBLISHED blog post, in BOTH locales — future-dated posts are excluded until a
// rebuild on their date reveals them (and adds them to the sitemap).
export function includedRoutes(paths: string[]): string[] {
  const staticPaths = paths.filter((p) => !p.includes(':'))
  const blogPaths = publishedPosts().flatMap((p) => [`/blog/${p.slug}`, `/en/blog/${p.slug}`])
  return [...staticPaths, ...blogPaths]
}

import { ViteSSG } from 'vite-ssg'
import { watch } from 'vue'
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

const routes = [
  { path: '/', component: Home },
  { path: '/impressum', component: Impressum },
  { path: '/datenschutz', component: Datenschutz },
  { path: '/work/wickie', component: CaseStudy },
  { path: '/work/profit-prime', component: CaseStudy },
  { path: '/work/augusta-beauty', component: CaseStudy },
  { path: '/work/lipold', component: CaseStudy },
  { path: '/work/pigmentfrei', component: CaseStudy },
  { path: '/products', component: Products },
  { path: '/products/barrierefrei-check', component: ProductDetail },
  { path: '/products/altersverifikation', component: ProductDetail },
  { path: '/products/angebotsanfrage', component: ProductDetail },
  { path: '/products/wieder-verfuegbar', component: ProductDetail },
  { path: '/products/wunschliste', component: ProductDetail },
  { path: '/blog', component: Blog },
  { path: '/blog/:slug', component: BlogPost },
  { path: '/404', component: NotFound },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

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
  ({ app, router, head, isClient }) => {
    const i18n = createI18n({
      legacy: false,
      locale: 'de',
      fallbackLocale: 'en',
      messages: { de, en },
    })
    app.use(i18n)

    head?.push({ htmlAttrs: { lang: 'de' } })

    // Sync <html lang> on locale change — guard for SSR where document is absent
    if (typeof document !== 'undefined') {
      const locale = i18n.global.locale
      document.documentElement.lang = String(locale.value)
      watch(locale, (val) => {
        document.documentElement.lang = String(val)
      })
    }

    // Send GA4 page_view on client-side route changes (consent-gated inside).
    if (isClient) {
      router.afterEach((to) => trackPageview(to.path))
    }
  },
)

// vite-ssg picks up this named export to enumerate which routes to pre-render.
// Param routes (/blog/:slug) can't auto-enumerate, so emit one static page per
// PUBLISHED blog post — future-dated posts are excluded until a rebuild on
// their date reveals them (and adds them to the sitemap).
export function includedRoutes(paths: string[]): string[] {
  const staticPaths = paths.filter((p) => !p.includes(':'))
  const blogPaths = publishedPosts().map((p) => `/blog/${p.slug}`)
  return [...staticPaths, ...blogPaths]
}

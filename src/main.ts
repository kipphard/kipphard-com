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
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './styles/main.scss'
import Home from './pages/Home.vue'
import Impressum from './pages/Impressum.vue'
import Datenschutz from './pages/Datenschutz.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/impressum', component: Impressum },
  { path: '/datenschutz', component: Datenschutz },
]

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  },
  ({ app }) => {
    const i18n = createI18n({
      legacy: false,
      locale: 'de',
      fallbackLocale: 'en',
      messages: { de, en },
    })
    app.use(i18n)

    // Sync <html lang> on locale change — guard for SSR where document is absent
    if (typeof document !== 'undefined') {
      const locale = i18n.global.locale
      document.documentElement.lang = String(locale.value)
      watch(locale, (val) => {
        document.documentElement.lang = String(val)
      })
    }
  },
)

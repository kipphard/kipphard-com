import { ViteSSG } from 'vite-ssg/single-page'
import { watch } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import './styles/main.scss'

export const createApp = ViteSSG(App, ({ app }) => {
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
})

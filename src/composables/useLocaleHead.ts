import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { toLocalePath } from '@/lib/i18n-routing'

const BASE = 'https://kipphard.com'

// Emits per-locale canonical + og:url, hreflang alternates (de/en/x-default) and
// og:locale for the current page. `neutralPath` returns the page path in neutral
// (German) form, e.g. () => '/products/' + germanSlug.
export function useLocaleHead(neutralPath: () => string) {
  const { locale } = useI18n()
  const dePath = computed(() => toLocalePath(neutralPath(), 'de', 'de'))
  const enPath = computed(() => toLocalePath(neutralPath(), 'en', 'de'))
  const canonical = computed(() => BASE + (locale.value === 'en' ? enPath.value : dePath.value))

  useHead({
    link: [
      { rel: 'canonical', href: () => canonical.value },
      { rel: 'alternate', hreflang: 'de', href: () => BASE + dePath.value },
      { rel: 'alternate', hreflang: 'en', href: () => BASE + enPath.value },
      { rel: 'alternate', hreflang: 'x-default', href: () => BASE + dePath.value },
    ],
    meta: [
      { property: 'og:url', content: () => canonical.value },
      { property: 'og:locale', content: () => (locale.value === 'en' ? 'en_US' : 'de_DE') },
    ],
  })

  return { canonical }
}

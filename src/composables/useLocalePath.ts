import { useI18n } from 'vue-i18n'
import { toLocalePath, type Locale } from '@/lib/i18n-routing'

// localePath('/products') -> '/en/products' when the active locale is English.
// `to` is authored in neutral (German) form; this projects it into the active locale.
export function useLocalePath() {
  const { locale } = useI18n()
  const localePath = (to: string) => toLocalePath(to, locale.value as Locale, 'de')
  return { localePath, locale }
}

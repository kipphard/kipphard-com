<template>
  <header class="nav">
    <div class="container nav__inner">
      <RouterLink :to="localePath('/')" class="brand" :aria-label="t('nav.home')">
        <span class="brand__mark" aria-hidden="true">AK</span>
        <span>André Kipphard</span>
      </RouterLink>

      <nav class="nav__links" :aria-label="t('nav.mobileMenuLabel')">
        <RouterLink :to="localePath('/#about')">{{ t('nav.about') }}</RouterLink>
        <RouterLink :to="localePath('/#services')">{{ t('nav.services') }}</RouterLink>
        <RouterLink :to="localePath('/#work')">{{ t('nav.work') }}</RouterLink>
        <div class="nav__drop">
          <RouterLink :to="localePath('/products')">{{ t('nav.products') }}</RouterLink>
          <div class="nav__submenu" role="menu" :aria-label="t('nav.products')">
            <RouterLink
              v-for="p in products"
              :key="p.id"
              :to="localePath('/products/' + p.id)"
              role="menuitem"
            >{{ p.name }}</RouterLink>
          </div>
        </div>
        <RouterLink :to="localePath('/#labs')">{{ t('nav.labs') }}</RouterLink>
        <RouterLink :to="localePath('/#pricing')">{{ t('nav.pricing') }}</RouterLink>
      </nav>

      <div class="nav__spacer"></div>

      <div class="nav__tools">
        <div class="lang-toggle" role="group" :aria-label="t('nav.langLabel')">
          <button :class="{ active: locale === 'de' }" :aria-pressed="locale === 'de'" @click="switchTo('de')">DE</button>
          <button :class="{ active: locale === 'en' }" :aria-pressed="locale === 'en'" @click="switchTo('en')">EN</button>
        </div>

        <button
          class="icon-btn"
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')"
        >
          <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
        </button>

        <RouterLink :to="localePath('/#contact')" class="btn btn--primary btn--sm nav-cta">
          {{ t('nav.ctaShort') }}
          <span class="arrow" aria-hidden="true">→</span>
        </RouterLink>

        <button
          :class="['menu-toggle', { open: menuOpen }]"
          :aria-label="menuOpen ? t('nav.menuClose') : t('nav.menuOpen')"
          aria-controls="mobile-menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile drawer -->
  <div
    :class="['mobile-menu', { open: menuOpen }]"
    id="mobile-menu"
    :aria-hidden="!menuOpen"
    :aria-label="t('nav.mobileMenuLabel')"
  >
    <ol>
      <li><RouterLink :to="localePath('/#about')" @click="menuOpen = false">{{ t('nav.about') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink :to="localePath('/#services')" @click="menuOpen = false">{{ t('nav.services') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink :to="localePath('/#work')" @click="menuOpen = false">{{ t('nav.work') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink :to="localePath('/products')" @click="menuOpen = false">{{ t('nav.products') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li class="mobile-sub">
        <RouterLink
          v-for="p in products"
          :key="p.id"
          :to="localePath('/products/' + p.id)"
          @click="menuOpen = false"
        >{{ p.name }}</RouterLink>
      </li>
      <li><RouterLink :to="localePath('/#labs')" @click="menuOpen = false">{{ t('nav.labs') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink :to="localePath('/#pricing')" @click="menuOpen = false">{{ t('nav.pricing') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink :to="localePath('/#contact')" @click="menuOpen = false">{{ t('nav.contact') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
    </ol>

    <div class="mobile-controls">
      <div class="lang-toggle" role="group" :aria-label="t('nav.langLabel')">
        <button :class="{ active: locale === 'de' }" :aria-pressed="locale === 'de'" @click="switchTo('de')">DE</button>
        <button :class="{ active: locale === 'en' }" :aria-pressed="locale === 'en'" @click="switchTo('en')">EN</button>
      </div>
      <button
        class="icon-btn"
        @click="toggleTheme"
        :aria-label="theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')"
      >
        <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
      </button>
    </div>

    <div class="meta">
      <span>andre@kipphard.com</span>
      <span>Paderborn · Remote</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/ui/Icon/Icon.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { localeFromPath, toLocalePath, type Locale } from '@/lib/i18n-routing'

const { t, tm, locale } = useI18n()

// Product sub-menu items under "Products" (reactive to locale via tm()).
interface ProductNavItem { id: string; name: string }
const products = computed(() => (tm('products.items') as ProductNavItem[]) || [])
const route = useRoute()
const router = useRouter()
const { localePath } = useLocalePath()

// Switch language by navigating to the equivalent URL in the target locale
// (preserves hash/query and translates the product slug). The route guard then
// sets the i18n locale from the URL.
function switchTo(target: Locale) {
  localStorage.setItem('ak-lang', target)
  const current = localeFromPath(route.path)
  if (current === target) return
  router.push(toLocalePath(route.fullPath, target, current))
}

const theme = ref<'dark' | 'light'>('dark')
const menuOpen = ref(false)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('ak-theme', theme.value)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) menuOpen.value = false
}

function onResize() {
  if (window.innerWidth >= 981 && menuOpen.value) menuOpen.value = false
}

// Lock body scroll while the drawer is open.
watch(menuOpen, (open) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

// Close on navigation (hash or path).
watch(() => route.fullPath, () => { menuOpen.value = false })

onMounted(() => {
  // Precedence: ?theme= override (shareable links) → stored preference → dark default.
  const param = new URLSearchParams(window.location.search).get('theme')
  const stored = localStorage.getItem('ak-theme')
  if (param === 'dark' || param === 'light') {
    theme.value = param
    localStorage.setItem('ak-theme', param)
  } else {
    theme.value = stored === 'light' ? 'light' : 'dark'
  }
  document.documentElement.setAttribute('data-theme', theme.value)

  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  if (typeof document !== 'undefined') document.documentElement.style.overflow = ''
})
</script>

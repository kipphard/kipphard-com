<template>
  <!-- Topbar: thin strip above the sticky nav, scrolls away with the page -->
  <div class="topbar">
    <div class="container topbar-inner">
      <span class="status">
        <span class="dot" aria-hidden="true"></span>
        {{ t('hero.status') }}
      </span>
      <span class="right">{{ t('topbar.right') }}</span>
    </div>
  </div>

  <!-- Sticky nav -->
  <header class="nav">
    <div class="container nav-inner">
      <RouterLink to="/" class="brand" :aria-label="t('nav.home')">
        <span class="mark" aria-hidden="true">AK</span>
        <span class="name">André Kipphard</span>
      </RouterLink>

      <nav class="nav-links" :aria-label="t('nav.mobileMenuLabel')">
        <RouterLink to="/#about">{{ t('nav.about') }}</RouterLink>
        <RouterLink to="/#services">{{ t('nav.services') }}</RouterLink>
        <RouterLink to="/#work">{{ t('nav.work') }}</RouterLink>
        <RouterLink to="/#pricing">{{ t('nav.pricing') }}</RouterLink>
        <RouterLink to="/#contact">{{ t('nav.contact') }}</RouterLink>
      </nav>

      <div class="nav-controls">
        <div class="pill-toggle" role="group" :aria-label="t('nav.langLabel')">
          <button
            :class="{ active: locale === 'de' }"
            :aria-pressed="locale === 'de'"
            @click="locale = 'de'"
          >DE</button>
          <button
            :class="{ active: locale === 'en' }"
            :aria-pressed="locale === 'en'"
            @click="locale = 'en'"
          >EN</button>
        </div>

        <button
          class="icon-btn"
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')"
        >
          <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="16" />
        </button>

        <RouterLink to="/#contact" class="btn btn--sm nav-cta">
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

  <!-- Slide-down mobile drawer -->
  <div
    :class="['mobile-menu', { open: menuOpen }]"
    id="mobile-menu"
    :aria-hidden="!menuOpen"
    :aria-label="t('nav.mobileMenuLabel')"
  >
    <ol>
      <li><RouterLink to="/" @click="menuOpen = false">{{ t('nav.home') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink to="/#about" @click="menuOpen = false">{{ t('nav.about') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink to="/#services" @click="menuOpen = false">{{ t('nav.services') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink to="/#work" @click="menuOpen = false">{{ t('nav.work') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink to="/#pricing" @click="menuOpen = false">{{ t('nav.pricing') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
      <li><RouterLink to="/#contact" @click="menuOpen = false">{{ t('nav.contact') }} <span class="arrow" aria-hidden="true">→</span></RouterLink></li>
    </ol>

    <div class="mobile-controls">
      <div class="pill-toggle" role="group" :aria-label="t('nav.langLabel')">
        <button :class="{ active: locale === 'de' }" :aria-pressed="locale === 'de'" @click="locale = 'de'">DE</button>
        <button :class="{ active: locale === 'en' }" :aria-pressed="locale === 'en'" @click="locale = 'en'">EN</button>
      </div>
      <button
        class="icon-btn"
        @click="toggleTheme"
        :aria-label="theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')"
      >
        <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="16" />
      </button>
    </div>

    <div class="meta">
      <span>andre@kipphard.com</span>
      <span>Berlin · 2026</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Icon from '@/components/ui/Icon/Icon.vue'

const { t, locale } = useI18n()
const route = useRoute()

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
  if (window.innerWidth >= 900 && menuOpen.value) menuOpen.value = false
}

// Lock body scroll while the drawer is open.
watch(menuOpen, (open) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

// Close on navigation (hash or path).
watch(() => route.fullPath, () => { menuOpen.value = false })

onMounted(() => {
  const stored = localStorage.getItem('ak-theme')
  if (stored === 'dark' || stored === 'light') {
    theme.value = stored
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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

<style lang="scss" scoped src="./Header.scss" />

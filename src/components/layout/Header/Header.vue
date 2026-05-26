<template>
  <div :class="['nav-wrap', { scrolled }]">
    <div class="container nav">
      <RouterLink to="/">
        <Wordmark variant="v1" />
      </RouterLink>

      <nav class="nav-links" aria-label="Primary">
        <RouterLink to="/#about">{{ t('nav.about') }}</RouterLink>
        <RouterLink to="/#services">{{ t('nav.services') }}</RouterLink>
        <RouterLink to="/#work">{{ t('nav.work') }}</RouterLink>
        <RouterLink to="/#pricing">{{ t('nav.pricing') }}</RouterLink>
        <RouterLink to="/#contact">{{ t('nav.contact') }}</RouterLink>
      </nav>

      <div class="nav-right">
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

        <RouterLink to="/#contact" class="btn btn-primary">
          {{ t('nav.cta') }}
          <Icon name="arrow" :size="14" class="arrow" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Wordmark from '@/components/ui/Wordmark/Wordmark.vue'
import Icon from '@/components/ui/Icon/Icon.vue'

const { t, locale } = useI18n()

const scrolled = ref(false)
const theme = ref<'dark' | 'light'>('dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('ak-theme', theme.value)
}

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  const stored = localStorage.getItem('ak-theme')
  if (stored === 'dark' || stored === 'light') {
    theme.value = stored
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  document.documentElement.setAttribute('data-theme', theme.value)

  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped src="./Header.scss" />

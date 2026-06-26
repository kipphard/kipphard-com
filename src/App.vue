<template>
  <a href="#main" class="skip-link">Zum Hauptinhalt springen / Skip to content</a>

  <Header />

  <RouterView />

  <Footer />

  <CookieConsent />
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/layout/Header/Header.vue'
import Footer from '@/components/layout/Footer/Footer.vue'
import CookieConsent from '@/components/CookieConsent/CookieConsent.vue'

// Reactive <html lang> so each prerendered page (and client navigation) reflects the locale.
const { locale } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })
</script>

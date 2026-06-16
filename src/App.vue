<template>
  <a href="#main" class="skip-link">Zum Hauptinhalt springen / Skip to content</a>

  <Header />

  <RouterView />

  <Footer />
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header/Header.vue'
import Footer from '@/components/layout/Footer/Footer.vue'
</script>

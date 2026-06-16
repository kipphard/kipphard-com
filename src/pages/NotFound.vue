<template>
  <main id="main">
    <section class="notfound">
      <div class="notfound__code">404</div>
      <h1>{{ t('notFound.title') }}</h1>
      <p>{{ t('notFound.lede') }}</p>
      <RouterLink to="/" class="btn btn--primary">{{ t('notFound.cta') }} <span class="arrow">→</span></RouterLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('pages.notFound.title'),
  meta: [
    { name: 'description', content: () => t('pages.notFound.description') },
    { name: 'robots', content: 'noindex' },
  ],
})
</script>

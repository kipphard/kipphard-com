<template>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('products.eyebrow') }}</span>
          <h1>{{ t('products.title') }}</h1>
          <p>{{ t('products.intro') }}</p>
        </div>

        <div class="product-grid">
          <article v-for="item in items" :key="item.id" class="product-card">
            <div class="product-card__head">
              <h2>{{ item.name }}</h2>
              <span class="labs-badge">{{ item.category }}</span>
            </div>
            <p class="product-card__tagline">{{ item.tagline }}</p>
            <p class="product-card__price">{{ item.priceFrom }}</p>
            <div class="tags product-card__stack">
              <span v-for="s in item.stack" :key="s" class="tag">{{ s }}</span>
            </div>
            <div class="product-card__actions">
              <RouterLink :to="`/products/${item.id}`" class="btn btn--primary btn--sm">
                {{ t('products.detailsCta') }} <span class="arrow" aria-hidden="true">→</span>
              </RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

interface ProductItem {
  id: string
  name: string
  tagline: string
  category: string
  status: string
  priceFrom: string
  stack: string[]
  demoUrl: string
}

const { t, tm } = useI18n()

const items = computed(() => tm('products.items') as ProductItem[])

const canonical = 'https://kipphard.com/products'

useHead({
  title: () => t('pages.products.title'),
  meta: [
    { name: 'description',        content: () => t('pages.products.description') },
    { property: 'og:title',       content: () => t('pages.products.title') },
    { property: 'og:description', content: () => t('pages.products.description') },
    { property: 'og:type',        content: 'website' },
    { property: 'og:url',         content: canonical },
    { name: 'twitter:card',       content: 'summary' },
  ],
  link: [{ rel: 'canonical', href: canonical }],
})
</script>

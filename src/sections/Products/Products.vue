<template>
  <section class="section" id="products">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">{{ t('products.eyebrow') }}</span>
        <h2>{{ t('products.title') }}</h2>
        <p>{{ t('products.intro') }}</p>
      </div>

      <div class="product-grid">
        <article v-for="item in items" :key="item.id" class="product-card">
          <div class="product-card__head">
            <h3>{{ item.name }}</h3>
            <span class="labs-badge">{{ item.category }}</span>
          </div>
          <p class="product-card__tagline">{{ item.tagline }}</p>
          <p class="product-card__price">{{ item.priceFrom }}</p>
          <div class="tags product-card__stack">
            <span v-for="s in item.stack" :key="s" class="tag">{{ s }}</span>
          </div>
          <div class="product-card__actions">
            <RouterLink :to="localePath(`/products/${item.id}`)" class="btn btn--primary btn--sm">
              {{ t('products.detailsCta') }} <span class="arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="products-all-link">
        <RouterLink :to="localePath('/products')" class="btn btn--ghost">
          {{ t('products.viewAll') }} <span class="arrow" aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '@/composables/useLocalePath'

interface ProductItem {
  id: string
  name: string
  tagline: string
  category: string
  priceFrom: string
  stack: string[]
}

// Curated selection shown on the homepage; the full catalog lives at /products.
// Edit this list to feature different products.
const FEATURED = ['barrierefrei-check', 'angebotsanfrage', 'wieder-verfuegbar', 'wunschliste']

const { t, tm } = useI18n()
const { localePath } = useLocalePath()
const items = computed(() => {
  const all = tm('products.items') as ProductItem[]
  const featured = all.filter((i) => FEATURED.includes(i.id))
  return featured.length ? featured : all.slice(0, 4)
})
</script>

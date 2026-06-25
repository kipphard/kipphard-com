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
            <RouterLink :to="`/products/${item.id}`" class="btn btn--primary btn--sm">
              {{ t('products.detailsCta') }} <span class="arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface ProductItem {
  id: string
  name: string
  tagline: string
  category: string
  priceFrom: string
  stack: string[]
}

const { t, tm } = useI18n()
const items = tm('products.items') as ProductItem[]
</script>

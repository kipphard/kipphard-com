<template>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('products.eyebrow') }}</span>
          <h1>{{ t('products.title') }}</h1>
          <p>{{ t('products.intro') }}</p>
        </div>

        <div v-if="availableGroups.length > 1" class="product-filters" role="group" :aria-label="t('products.eyebrow')">
          <button
            type="button"
            class="product-filter"
            :class="{ 'product-filter--active': activeGroup === 'all' }"
            :aria-pressed="activeGroup === 'all'"
            @click="activeGroup = 'all'"
          >
            {{ t('products.filterAll') }}
          </button>
          <button
            v-for="g in availableGroups"
            :key="g"
            type="button"
            class="product-filter"
            :class="{ 'product-filter--active': activeGroup === g }"
            :aria-pressed="activeGroup === g"
            @click="activeGroup = g"
          >
            {{ groupLabels[g] }}
          </button>
        </div>

        <div class="product-grid">
          <article v-for="item in filtered" :key="item.id" class="product-card">
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
              <RouterLink :to="localePath(`/products/${item.id}`)" class="btn btn--primary btn--sm">
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
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleHead } from '@/composables/useLocaleHead'

interface ProductItem {
  id: string
  name: string
  tagline: string
  category: string
  group: string
  status: string
  priceFrom: string
  stack: string[]
  demoUrl: string
}

const { t, tm } = useI18n()
const { localePath } = useLocalePath()

const items = computed(() => tm('products.items') as ProductItem[])
const groupLabels = computed(() => tm('products.groups') as Record<string, string>)

// Filter chips: only groups that actually have products, ordered as defined in the locale map.
const availableGroups = computed(() => {
  const present = new Set(items.value.map((i) => i.group))
  return Object.keys(groupLabels.value).filter((k) => present.has(k))
})

const activeGroup = ref('all')
const filtered = computed(() =>
  activeGroup.value === 'all' ? items.value : items.value.filter((i) => i.group === activeGroup.value),
)

useHead({
  title: () => t('pages.products.title'),
  meta: [
    { name: 'description',        content: () => t('pages.products.description') },
    { property: 'og:title',       content: () => t('pages.products.title') },
    { property: 'og:description', content: () => t('pages.products.description') },
    { property: 'og:type',        content: 'website' },
    { name: 'twitter:card',       content: 'summary' },
  ],
})

// canonical + hreflang + og:url + og:locale
useLocaleHead(() => '/products')
</script>

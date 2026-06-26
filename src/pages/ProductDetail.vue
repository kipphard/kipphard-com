<template>
  <main id="main">
    <template v-if="item">
      <!-- Hero -->
      <section class="section cs-hero">
        <div class="container">
          <RouterLink :to="localePath('/products')" class="crumb">{{ t('products.backToProducts') }}</RouterLink>
          <div class="cs-meta">
            <span class="accent">{{ item.category }}</span>
            <span>{{ item.priceFrom }}</span>
          </div>
          <h1>{{ item.name }}</h1>
          <p class="cs-hero__lede">{{ item.detail.lede }}</p>
          <div class="cs-hero__actions">
            <a class="btn btn--primary" :href="localePath('/#contact')">
              {{ item.detail.ctaPrimary }} <span class="arrow">→</span>
            </a>
            <a class="btn btn--ghost" href="#features">
              {{ item.detail.ctaSecondary }}
            </a>
            <a
              v-if="item.demoUrl"
              class="btn btn--ghost"
              :href="item.demoUrl"
              target="_blank"
              rel="noopener"
            >
              Demo <span class="arrow" aria-hidden="true">↗</span>
            </a>
          </div>
          <p v-if="!item.demoUrl" class="product-demo-note">{{ item.detail.demoNote }}</p>
        </div>
      </section>

      <!-- Problem + Solution -->
      <section class="section--tight">
        <div class="container">
          <div class="cs-block">
            <h2>{{ item.detail.problemTitle }}</h2>
            <p>{{ item.detail.problem }}</p>
          </div>
          <div class="cs-block">
            <h2>{{ item.detail.solutionTitle }}</h2>
            <p>{{ item.detail.solution }}</p>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" class="section section--sunken">
        <div class="container">
          <div class="section-head">
            <h2>{{ item.detail.featuresTitle }}</h2>
          </div>
          <div class="product-features">
            <div v-for="f in item.detail.features" :key="f.title" class="product-feature-card">
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="section">
        <div class="container">
          <div class="section-head">
            <h2>{{ item.detail.pricingTitle }}</h2>
          </div>
          <div class="product-pricing">
            <div
              v-for="tier in item.detail.pricing"
              :key="tier.name"
              class="pricing-tier"
              :class="{ 'pricing-tier--highlighted': tier.highlighted }"
            >
              <div v-if="tier.highlighted" class="pricing-tier__badge">{{ t('productDetail.recommended') }}</div>
              <p class="pricing-tier__name">{{ tier.name }}</p>
              <p class="pricing-tier__price">
                {{ tier.price }}
                <span class="pricing-tier__period">/ {{ tier.period }}</span>
              </p>
              <ul class="pricing-tier__features">
                <li v-for="f in tier.features" :key="f">{{ f }}</li>
              </ul>
              <a class="btn btn--primary btn--sm" :href="localePath('/#contact')">
                {{ tier.cta }}
              </a>
            </div>
          </div>
          <p class="product-pricing-note">{{ item.detail.pricingNote }}</p>
        </div>
      </section>

      <!-- FAQ -->
      <section class="section section--sunken">
        <div class="container">
          <div class="section-head section-head--center">
            <h2>{{ item.detail.faqTitle }}</h2>
          </div>
          <div class="faq product-faq">
            <details v-for="entry in item.detail.faq" :key="entry.q" class="faq__item">
              <summary class="faq__q">
                {{ entry.q }}
                <span class="plus" aria-hidden="true">+</span>
              </summary>
              <p class="faq__a">{{ entry.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="section--tight">
        <div class="container">
          <div class="cta-panel">
            <h2>{{ t('productDetail.bottomCtaTitle') }}</h2>
            <RouterLink :to="localePath('/#contact')" class="btn btn--primary">
              {{ t('productDetail.bottomCtaButton') }} <span class="arrow">→</span>
            </RouterLink>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="case-not-found">
      <p>{{ t('productDetail.notFound') }}</p>
      <RouterLink :to="localePath('/products')" class="btn btn--ghost">{{ t('productDetail.allProducts') }}</RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleHead } from '@/composables/useLocaleHead'
import { localeFromPath, productIdFromSlug } from '@/lib/i18n-routing'

interface Feature {
  title: string
  desc: string
}

interface PricingTier {
  name: string
  price: string
  period: string
  highlighted: boolean
  cta: string
  features: string[]
}

interface FaqEntry {
  q: string
  a: string
}

interface ProductDetail {
  lede: string
  ctaPrimary: string
  ctaSecondary: string
  demoNote: string
  problemTitle: string
  problem: string
  solutionTitle: string
  solution: string
  featuresTitle: string
  features: Feature[]
  pricingTitle: string
  pricingNote: string
  pricing: PricingTier[]
  faqTitle: string
  faq: FaqEntry[]
}

interface ProductItem {
  id: string
  name: string
  tagline: string
  category: string
  status: string
  priceFrom: string
  stack: string[]
  demoUrl: string
  detail: ProductDetail
}

const { t, tm } = useI18n()
const route = useRoute()
const { localePath } = useLocalePath()

const locale = computed(() => localeFromPath(route.path))
const urlSlug = computed(() => route.path.split('/').pop() ?? '')
// Canonical product id (= German slug), resolved from the locale-specific URL slug.
const productId = computed(() => productIdFromSlug(urlSlug.value, locale.value))

useHead({
  title: () => t(`pages.${productId.value}.title`),
  meta: [
    { name: 'description',        content: () => t(`pages.${productId.value}.description`) },
    { property: 'og:title',       content: () => t(`pages.${productId.value}.title`) },
    { property: 'og:description', content: () => t(`pages.${productId.value}.description`) },
    { property: 'og:type',        content: 'website' },
    { name: 'twitter:card',       content: 'summary' },
  ],
})

// canonical + hreflang + og:url + og:locale — neutral path uses the German slug.
useLocaleHead(() => `/products/${productId.value ?? urlSlug.value}`)

const item = computed(() => {
  const items = tm('products.items') as ProductItem[]
  return productId.value ? items.find((p) => p.id === productId.value) ?? null : null
})
</script>

<template>
  <main id="main">
    <section class="page-head">
      <div class="container">
        <div class="label">{{ t('pricing.eyebrow') }}</div>
        <h1>{{ t('pricing.title') }}</h1>
        <p class="lede">{{ t('pricing.intro') }}</p>
      </div>
    </section>

    <section class="section pricing-section">
      <div class="container">
        <div class="pricing">
          <article
            v-for="(tier, i) in tiers"
            :key="i"
            :class="['price', { 'price--featured': tier.featured }]"
          >
            <header class="label">
              <span class="name">{{ tier.name }}</span>
              <span v-if="tier.badge" class="badge">{{ tier.badge }}</span>
            </header>
            <div class="amount">
              <span class="from">Ab</span>
              <span class="num"><span class="cur">€</span>{{ tier.price }}</span>
            </div>
            <p class="price-meta">{{ tier.desc }}</p>
            <ul class="price-list">
              <li v-for="(feature, j) in tier.features" :key="j">{{ feature }}</li>
            </ul>
            <RouterLink to="/contact" class="btn">{{ tier.cta }} →</RouterLink>
          </article>
        </div>

        <div class="price-note">
          <span class="label">{{ t('pricing.note') }}</span>
          <span class="rate">{{ t('pricing.rate') }}</span>
        </div>
      </div>
    </section>

    <section class="section faq-section">
      <div class="container">
        <div class="section-head">
          <span class="label">05.1 / FAQ</span>
          <div>
            <h2>{{ t('pricing.faqTitle') }}</h2>
          </div>
        </div>

        <ul class="timeline">
          <li v-for="(item, i) in faq" :key="i">
            <div class="when">Q{{ String(i + 1).padStart(2, '0') }}</div>
            <div>
              <span class="role">{{ item.q }}</span>
              <span class="org">{{ item.a }}</span>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <CtaBanner />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'

const { t, tm } = useI18n()

const tiers = computed(() => tm('pricing.tiers') as Array<{
  name: string
  price: string
  desc: string
  featured?: boolean
  badge?: string
  features: string[]
  cta: string
}>)

const faq = computed(() => tm('pricing.faq') as Array<{ q: string; a: string }>)

useHead({
  title: () => t('pages.pricing.title'),
  meta: [{ name: 'description', content: () => t('pages.pricing.description') }],
})
</script>

<style lang="scss" scoped src="./Pricing.scss" />

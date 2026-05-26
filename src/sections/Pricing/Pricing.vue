<template>
  <section id="pricing" class="section" aria-labelledby="pricing-title">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="eyebrow">{{ t('pricing.eyebrow') }}</div>
          <h2 id="pricing-title" class="section-title">{{ t('pricing.title') }}</h2>
        </div>
        <p class="section-intro">{{ t('pricing.intro') }}</p>
      </div>

      <div class="pricing-grid">
        <div
          v-for="(tier, i) in tiers"
          :key="i"
          :class="['tier', { featured: tier.featured }]"
        >
          <div v-if="tier.badge" class="tier-badge">★ {{ tier.badge }}</div>
          <div class="tier-name">{{ tier.name }}</div>
          <div class="tier-price">
            <span class="from">{{ fromLabel }}</span>
            <span class="currency">€</span>
            {{ tier.price }}
          </div>
          <div class="tier-desc">{{ tier.desc }}</div>
          <ul class="tier-feat">
            <li v-for="(feature, j) in tier.features" :key="j">
              <Icon name="check" :size="14" />
              <span>{{ feature }}</span>
            </li>
          </ul>
          <a
            href="#contact"
            :class="['btn', 'tier-cta', tier.featured ? 'btn-accent' : 'btn-ghost']"
          >
            {{ tier.cta }} →
          </a>
        </div>
      </div>

      <div class="pricing-note">
        <span>{{ t('pricing.note') }}</span>
        <span class="mono-badge">{{ t('pricing.rate') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'

interface Tier {
  name: string
  price: string | number
  desc: string
  features: string[]
  cta: string
  featured?: boolean
  badge?: string
}

const { t, tm, locale } = useI18n()

const tiers = computed(() => tm('pricing.tiers') as Tier[])

const fromLabel = computed(() => locale.value === 'de' ? 'ab' : 'from')
</script>

<style lang="scss" scoped src="./Pricing.scss" />

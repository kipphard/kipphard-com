<template>
  <section class="section section--sunken" id="pricing">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="eyebrow">{{ t('nav.pricing') }}</span>
        <h2>{{ t('pricing.title') }}</h2>
        <p>{{ t('pricing.intro') }}</p>
      </div>

      <div class="pricing">
        <article
          v-for="(tier, i) in tiers"
          :key="i"
          :class="['price-card', { 'price-card--featured': tier.featured }]"
        >
          <span v-if="tier.badge" class="price-card__badge">{{ tier.badge }}</span>
          <div class="price-card__name">{{ tier.name }}</div>
          <div class="price-card__price">
            <span class="from">ab</span><span class="cur">€</span>{{ tier.price }}
          </div>
          <p class="price-card__desc">{{ tier.desc }}</p>
          <ul class="price-card__features">
            <li v-for="(f, fi) in tier.features" :key="fi">
              <Icon name="check" :size="18" /> {{ f }}
            </li>
          </ul>
          <a
            href="#contact"
            :class="['btn', 'btn--block', tier.featured ? 'btn--primary' : 'btn--ghost']"
          >{{ tier.cta }}</a>
        </article>
      </div>

      <p class="price-note">{{ t('pricing.note') }} <strong>{{ t('pricing.rate') }}</strong></p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'

interface Tier {
  name: string; price: string; desc: string; features: string[];
  cta: string; featured?: boolean; badge?: string
}

const { t, tm } = useI18n()
const tiers = computed(() => tm('pricing.tiers') as Tier[])
</script>

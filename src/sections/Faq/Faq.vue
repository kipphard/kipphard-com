<template>
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center">
        <h2>{{ t('pricing.faqTitle') }}</h2>
      </div>

      <div class="faq">
        <details v-for="(item, i) in faq" :key="i" class="faq__item" name="faq" :open="i === 0">
          <summary class="faq__q">{{ item.q }} <span class="plus" aria-hidden="true">+</span></summary>
          <div class="faq__a">{{ item.a }}</div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Faq { q: string; a: string }

const { t, tm } = useI18n()
const faq = tm('pricing.faq') as Faq[]
</script>

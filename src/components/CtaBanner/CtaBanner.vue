<template>
  <section class="section--tight">
    <div class="container">
      <div class="cta-panel">
        <h2>{{ t('cta.title') }}</h2>
        <a :href="href" class="btn btn--primary">
          {{ t('cta.button') }}
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ href?: string }>(), {
  href: '/#contact',
})

const { t } = useI18n()
</script>

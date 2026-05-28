<template>
  <section class="cta-banner">
    <div class="container">
      <div class="grid">
        <h2>{{ t('cta.title') }}</h2>
        <RouterLink to="/contact" class="btn btn--inverted">
          {{ t('cta.button') }}
          <span class="arrow" aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss" scoped src="./CtaBanner.scss" />

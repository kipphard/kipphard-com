<template>
  <section class="section--tight">
    <div class="container">
      <div class="cta-panel">
        <h2>{{ t('cta.title') }}</h2>
        <a :href="localizedHref" class="btn btn--primary">
          {{ t('cta.button') }}
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '@/composables/useLocalePath'

const props = withDefaults(defineProps<{ href?: string }>(), {
  href: '/#contact',
})

const { t } = useI18n()
const { localePath } = useLocalePath()
const localizedHref = computed(() => localePath(props.href))
</script>

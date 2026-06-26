<template>
  <section class="section--tight" aria-label="Kennzahlen">
    <div class="container">
      <div class="stats">
        <div v-for="(stat, i) in stats" :key="i" class="stat">
          <div class="stat__num">{{ stat.num }}</div>
          <div class="stat__label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()

const stats = computed(() => tm('hero.stats') as Array<{ num: string; label: string }>)
</script>

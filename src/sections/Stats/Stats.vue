<template>
  <section class="stats-section" aria-label="Kennzahlen">
    <div class="container">
      <div class="stats">
        <div v-for="(stat, i) in stats" :key="i" class="stat">
          <div class="v">{{ stat.num }}</div>
          <div class="k">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()

const stats = tm('hero.stats') as Array<{ num: string; label: string }>
</script>

<style lang="scss" scoped src="./Stats.scss" />

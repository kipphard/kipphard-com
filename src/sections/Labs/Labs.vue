<template>
  <section class="section section--sunken" id="labs">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">{{ t('labs.eyebrow') }}</span>
        <h2>{{ t('labs.title') }}</h2>
        <p>{{ t('labs.intro') }}</p>
      </div>

      <div class="labs-grid">
        <article v-for="item in items" :key="item.id" class="labs-card">
          <div class="labs-card__head">
            <h3>{{ item.name }}</h3>
            <span class="labs-badge">{{ t('labs.wip') }}</span>
          </div>
          <p class="labs-card__desc">{{ item.tagline }}</p>
          <div class="tags labs-card__stack">
            <span v-for="s in item.stack" :key="s" class="tag">{{ s }}</span>
          </div>
          <div class="labs-card__actions">
            <a class="btn btn--primary btn--sm" :href="item.demoUrl" target="_blank" rel="noopener">
              {{ t('labs.demo') }} <span class="arrow" aria-hidden="true">↗</span>
            </a>
            <a class="btn btn--ghost btn--sm" :href="item.repoUrl" target="_blank" rel="noopener noreferrer">
              {{ t('labs.source') }} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface LabItem {
  id: string
  name: string
  tagline: string
  stack: string[]
  demoUrl: string
  repoUrl: string
}

const { t, tm } = useI18n()
const items = tm('labs.items') as LabItem[]
</script>

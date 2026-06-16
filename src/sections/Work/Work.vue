<template>
  <section class="section" id="work">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">{{ t('nav.work') }}</span>
        <h2>{{ t('work.title') }}</h2>
        <p>{{ t('work.intro') }}</p>
      </div>

      <div class="work-grid">
        <RouterLink
          v-for="item in items"
          :key="item.id"
          :to="`/work/${item.id}`"
          :class="['work-card', { 'work-card--featured': item.size === 'featured' }]"
        >
          <div class="work-card__media">
            <img :src="item.case?.hero" :alt="item.client" loading="lazy" />
          </div>
          <div class="work-card__body">
            <div class="work-card__meta">
              <span class="accent">{{ item.year }}</span>
              <span>{{ item.client }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p class="work-card__desc">{{ item.desc }}</p>
            <div class="work-card__foot">
              <div class="tags">
                <span v-for="tag in item.stack.slice(0, 4)" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <span class="work-card__more">{{ t('caseStudy.viewCase') }} <span class="arrow" aria-hidden="true">→</span></span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

interface WorkItem {
  id: string; size: string; year: string; client: string; type: string;
  title: string; desc: string; stack: string[]; url?: string;
  case?: { hero: string }
}

const { t, tm } = useI18n()
const items = tm('work.items') as WorkItem[]
</script>

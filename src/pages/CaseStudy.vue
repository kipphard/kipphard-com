<template>
  <main id="main">
    <section class="section">
      <div class="container">
        <template v-if="item && item.case">
          <RouterLink to="/#projects" class="case-breadcrumb">
            {{ t('caseStudy.backToProjects') }}
          </RouterLink>

          <div class="case-study">
            <!-- Hero block -->
            <p class="case-meta">{{ item.client }} · {{ item.year }} · {{ item.type }}</p>
            <h1 class="case-title">{{ item.title }}</h1>

            <img
              :src="item.case.hero"
              :alt="item.title"
              class="case-hero"
              loading="eager"
            />

            <div v-if="item.url" class="case-cta">
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                {{ t('caseStudy.visitLiveSite') }} ↗
              </a>
            </div>

            <!-- Narrative -->
            <div class="case-narrative">
              <h2>{{ t('caseStudy.sections.challenge') }}</h2>
              <p>{{ item.case.challenge }}</p>

              <h2>{{ t('caseStudy.sections.solution') }}</h2>
              <p>{{ item.case.solution }}</p>

              <h2>{{ t('caseStudy.sections.today') }}</h2>
              <p>{{ item.case.outcome }}</p>

              <!-- Tech stack chips -->
              <div class="case-stack">
                <p class="case-stack__label">{{ t('caseStudy.sections.stack') }}</p>
                <div class="case-stack__chips">
                  <span
                    v-for="s in item.stack"
                    :key="s"
                    class="case-stack__chip"
                  >{{ s }}</span>
                </div>
              </div>
            </div>

            <!-- Screenshot gallery -->
            <div v-if="item.case.screenshots.length" class="case-gallery">
              <div class="case-gallery__grid">
                <div
                  v-for="(shot, i) in item.case.screenshots"
                  :key="i"
                  class="case-gallery__item"
                >
                  <img
                    :src="shot.src"
                    :alt="shot.alt"
                    class="case-gallery__img"
                    loading="lazy"
                  />
                  <p v-if="shot.caption" class="case-gallery__caption">{{ shot.caption }}</p>
                </div>
              </div>
            </div>

            <!-- Bottom CTA -->
            <div v-if="item.url" class="case-cta-bottom">
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                {{ t('caseStudy.visitLiveSite') }} ↗
              </a>
            </div>
          </div>
        </template>

        <div v-else class="case-not-found">
          <p>{{ t('caseStudy.notFound') }}</p>
          <RouterLink to="/" class="btn btn-ghost">← Home</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface CaseScreenshot {
  src: string
  alt: string
  caption?: string
}

interface CaseBlock {
  hero: string
  screenshots: CaseScreenshot[]
  challenge: string
  solution: string
  outcome: string
}

interface WorkItem {
  id: string
  size: 'featured' | 'normal' | 'compact'
  filter: string[]
  year: string
  client: string
  type: string
  title: string
  desc: string
  stack: string[]
  thumb: string
  url?: string
  case?: CaseBlock
}

const { t, tm } = useI18n()
const route = useRoute()

const slug = computed(() => {
  const segments = route.path.split('/')
  return segments[segments.length - 1]
})

const item = computed(() => {
  const items = tm('work.items') as WorkItem[]
  return items.find((i) => i.id === slug.value) ?? null
})
</script>

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
                class="btn"
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
                <button
                  v-for="(shot, i) in item.case.screenshots"
                  :key="i"
                  type="button"
                  class="case-gallery__item"
                  :aria-label="`${t('caseStudy.enlarge')}: ${shot.alt}`"
                  @click="lightboxIndex = i"
                >
                  <img
                    :src="shot.src"
                    :alt="shot.alt"
                    class="case-gallery__img"
                    loading="lazy"
                  />
                  <p v-if="shot.caption" class="case-gallery__caption">{{ shot.caption }}</p>
                </button>
              </div>
            </div>

            <!-- Bottom CTA -->
            <div v-if="item.url" class="case-cta-bottom">
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn"
              >
                {{ t('caseStudy.visitLiveSite') }} ↗
              </a>
            </div>
          </div>
        </template>

        <div v-else class="case-not-found">
          <p>{{ t('caseStudy.notFound') }}</p>
          <RouterLink to="/" class="btn btn--ghost">← Home</RouterLink>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div
      v-if="item && item.case && lightboxIndex !== null"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="t('caseStudy.lightbox')"
      @click="closeLightbox"
      @keydown="onLightboxKey"
      tabindex="-1"
      ref="lightboxEl"
    >
      <button
        type="button"
        class="lightbox__close"
        :aria-label="t('caseStudy.close')"
        @click.stop="closeLightbox"
      >
        ✕
      </button>
      <button
        v-if="item.case.screenshots.length > 1"
        type="button"
        class="lightbox__nav lightbox__nav--prev"
        :aria-label="t('caseStudy.previous')"
        @click.stop="lightboxIndex = (lightboxIndex! - 1 + item.case.screenshots.length) % item.case.screenshots.length"
      >
        ‹
      </button>
      <figure class="lightbox__figure" @click.stop>
        <img
          :src="item.case.screenshots[lightboxIndex].src"
          :alt="item.case.screenshots[lightboxIndex].alt"
          class="lightbox__img"
        />
        <figcaption v-if="item.case.screenshots[lightboxIndex].caption" class="lightbox__caption">
          {{ item.case.screenshots[lightboxIndex].caption }}
        </figcaption>
      </figure>
      <button
        v-if="item.case.screenshots.length > 1"
        type="button"
        class="lightbox__nav lightbox__nav--next"
        :aria-label="t('caseStudy.next')"
        @click.stop="lightboxIndex = (lightboxIndex! + 1) % item.case.screenshots.length"
      >
        ›
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
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

useHead({
  title: () => t(`pages.${slug.value}.title`),
  meta: [
    { name: 'description', content: () => t(`pages.${slug.value}.description`) },
  ],
})

const lightboxIndex = ref<number | null>(null)
const lightboxEl = ref<HTMLElement | null>(null)

function closeLightbox() {
  lightboxIndex.value = null
}

function onLightboxKey(e: KeyboardEvent) {
  if (!item.value?.case) return
  const len = item.value.case.screenshots.length
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight' && len > 1) lightboxIndex.value = ((lightboxIndex.value ?? 0) + 1) % len
  else if (e.key === 'ArrowLeft' && len > 1) lightboxIndex.value = ((lightboxIndex.value ?? 0) - 1 + len) % len
}

watch(lightboxIndex, async (i) => {
  if (i !== null) {
    await nextTick()
    lightboxEl.value?.focus()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const item = computed(() => {
  const items = tm('work.items') as WorkItem[]
  return items.find((i) => i.id === slug.value) ?? null
})
</script>

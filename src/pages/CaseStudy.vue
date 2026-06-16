<template>
  <main id="main">
    <template v-if="item && item.case">
      <!-- Hero -->
      <section class="section cs-hero">
        <div class="container">
          <RouterLink to="/#work" class="crumb">{{ t('caseStudy.backToProjects') }}</RouterLink>
          <div class="cs-meta">
            <span class="accent">{{ item.year }}</span>
            <span>{{ item.client }}</span>
            <span>{{ item.type }}</span>
          </div>
          <h1>{{ item.title }}</h1>
          <p class="cs-hero__lede">{{ item.desc }}</p>
          <div class="cs-hero__actions">
            <a
              v-if="item.url"
              class="btn btn--primary"
              :href="item.url"
              target="_blank"
              rel="noopener"
            >{{ t('caseStudy.visitLiveSite') }} <span class="arrow">↗</span></a>
            <RouterLink to="/#work" class="btn btn--ghost">Weitere Projekte</RouterLink>
          </div>
          <figure class="cs-figure">
            <img :src="item.case.hero" :alt="item.title" loading="eager" />
          </figure>
        </div>
      </section>

      <!-- Body: narrative + sidebar -->
      <section class="section--tight">
        <div class="container cs-body">
          <div>
            <div class="cs-block">
              <h2>{{ t('caseStudy.sections.challenge') }}</h2>
              <p>{{ item.case.challenge }}</p>
            </div>
            <div class="cs-block">
              <h2>{{ t('caseStudy.sections.solution') }}</h2>
              <p>{{ item.case.solution }}</p>
            </div>
            <div class="cs-block">
              <h2>{{ t('caseStudy.sections.today') }}</h2>
              <p>{{ item.case.outcome }}</p>
            </div>
          </div>

          <div>
            <div class="cs-aside--sticky">
              <div class="cs-aside">
                <h3>Projekt</h3>
                <dl>
                  <div><dt>Kunde</dt><dd>{{ item.client }}</dd></div>
                  <div><dt>Zeitraum</dt><dd>{{ item.year }}</dd></div>
                  <div><dt>Typ</dt><dd>{{ item.type }}</dd></div>
                  <div v-if="item.url">
                    <dt>Live</dt>
                    <dd><a :href="item.url" target="_blank" rel="noopener">{{ item.url.replace(/^https?:\/\//, '') }} ↗</a></dd>
                  </div>
                </dl>
              </div>
              <div class="cs-aside">
                <h3>{{ t('caseStudy.sections.stack') }}</h3>
                <div class="tags">
                  <span v-for="s in item.stack" :key="s" class="tag">{{ s }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery -->
      <section v-if="item.case.screenshots.length" class="section--tight">
        <div class="container">
          <div class="cs-gallery">
            <button
              v-for="(shot, i) in item.case.screenshots"
              :key="i"
              type="button"
              class="cs-gallery__item"
              :aria-label="`${t('caseStudy.enlarge')}: ${shot.alt}`"
              @click="lightboxIndex = i"
            >
              <img :src="shot.src" :alt="shot.alt" loading="lazy" />
              <p v-if="shot.caption" class="cs-gallery__caption">{{ shot.caption }}</p>
            </button>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="section--tight">
        <div class="container">
          <div class="cta-panel">
            <h2>Ein ähnliches Projekt im Kopf? Lass uns sprechen.</h2>
            <RouterLink to="/#contact" class="btn btn--primary">Projekt anfragen <span class="arrow">→</span></RouterLink>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="case-not-found">
      <p>{{ t('caseStudy.notFound') }}</p>
      <RouterLink to="/" class="btn btn--ghost">← Home</RouterLink>
    </div>

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

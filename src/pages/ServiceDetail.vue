<template>
  <main id="main">
    <template v-if="item">
      <!-- Hero -->
      <section class="section cs-hero">
        <div class="container">
          <RouterLink :to="localePath('/leistungen')" class="crumb">{{ t('servicesDetail.backTo') }}</RouterLink>
          <div class="cs-meta">
            <span class="accent">{{ t('servicesDetail.eyebrow') }}</span>
          </div>
          <h1>{{ item.title }}</h1>
          <p class="cs-hero__lede">{{ item.lede }}</p>
          <div class="cs-hero__actions">
            <a
              class="btn btn--primary"
              :href="localePath('/#contact')"
              @click="trackEvent('cta_click', { location: 'service_hero', service: item.id })"
            >
              {{ item.ctaPrimary }} <span class="arrow" aria-hidden="true">→</span>
            </a>
            <a v-if="item.faq?.length" class="btn btn--ghost" href="#faq">
              {{ t('servicesDetail.toFaq') }}
            </a>
          </div>
        </div>
      </section>

      <!-- Content sections -->
      <section class="section--tight">
        <div class="container">
          <div v-for="sec in item.sections" :key="sec.h2" class="cs-block">
            <h2>{{ sec.h2 }}</h2>
            <p v-for="(para, i) in sec.paras" :key="i">{{ para }}</p>
          </div>
        </div>
      </section>

      <!-- Offer / feature grid -->
      <section v-if="item.features" class="section section--sunken">
        <div class="container">
          <div class="section-head">
            <h2>{{ item.features.title }}</h2>
          </div>
          <div class="product-features">
            <div v-for="f in item.features.items" :key="f.title" class="product-feature-card">
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Related case studies -->
      <section v-if="caseStudies.length" class="section">
        <div class="container">
          <div class="section-head">
            <h2>{{ t('servicesDetail.relatedTitle') }}</h2>
          </div>
          <div class="grid-3">
            <RouterLink
              v-for="cs in caseStudies"
              :key="cs.id"
              :to="localePath(`/work/${cs.id}`)"
              class="card"
            >
              <h3>{{ cs.client }}</h3>
              <p>{{ cs.title }}</p>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section v-if="item.faq?.length" id="faq" class="section section--sunken">
        <div class="container">
          <div class="section-head section-head--center">
            <h2>{{ t('servicesDetail.faqTitle') }}</h2>
          </div>
          <div class="faq product-faq">
            <details v-for="entry in item.faq" :key="entry.q" class="faq__item">
              <summary class="faq__q">
                {{ entry.q }}
                <span class="plus" aria-hidden="true">+</span>
              </summary>
              <p class="faq__a">{{ entry.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <CtaBanner />
    </template>

    <div v-else class="case-not-found">
      <p>{{ t('servicesDetail.notFound') }}</p>
      <RouterLink :to="localePath('/leistungen')" class="btn btn--ghost">{{ t('servicesDetail.allServices') }}</RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleHead } from '@/composables/useLocaleHead'
import { localeFromPath, serviceIdFromSlug } from '@/lib/i18n-routing'
import { trackEvent } from '@/lib/consent'

interface ServiceSection {
  h2: string
  paras: string[]
}

interface Feature {
  title: string
  desc: string
}

interface FaqEntry {
  q: string
  a: string
}

interface ServiceItem {
  id: string
  icon: string
  title: string
  teaser: string
  lede: string
  ctaPrimary: string
  sections: ServiceSection[]
  features?: { title: string; items: Feature[] }
  faq?: FaqEntry[]
  caseStudies?: string[]
}

interface WorkItem {
  id: string
  client: string
  title: string
}

const { t, tm } = useI18n()
const route = useRoute()
const { localePath } = useLocalePath()

const locale = computed(() => localeFromPath(route.path))
const urlSlug = computed(() => route.path.split('/').pop() ?? '')
// Canonical service id (= German slug), resolved from the locale-specific URL slug.
const serviceId = computed(() => serviceIdFromSlug(urlSlug.value, locale.value))

const item = computed(() => {
  const items = tm('servicesDetail.items') as ServiceItem[]
  return serviceId.value ? items.find((s) => s.id === serviceId.value) ?? null : null
})

const caseStudies = computed<WorkItem[]>(() => {
  const wanted = item.value?.caseStudies ?? []
  if (!wanted.length) return []
  const all = tm('work.items') as WorkItem[]
  return wanted.map((id) => all.find((w) => w.id === id)).filter((w): w is WorkItem => !!w)
})

useHead({
  title: () => t(`pages.${serviceId.value}.title`),
  meta: [
    { name: 'description',        content: () => t(`pages.${serviceId.value}.description`) },
    { property: 'og:title',       content: () => t(`pages.${serviceId.value}.title`) },
    { property: 'og:description', content: () => t(`pages.${serviceId.value}.description`) },
    { property: 'og:type',        content: 'website' },
    { name: 'twitter:card',       content: 'summary' },
  ],
})

// canonical + hreflang + og:url + og:locale — neutral path uses the German slug.
const { canonical } = useLocaleHead(() => `/leistungen/${serviceId.value ?? urlSlug.value}`)

// JSON-LD: Service (ProfessionalService for the local Paderborn page) + FAQPage.
const jsonLd = computed(() => {
  if (!item.value || !serviceId.value) return ''
  const isLocal = serviceId.value === 'webentwickler-paderborn'
  const service: Record<string, unknown> = {
    '@type': isLocal ? 'ProfessionalService' : 'Service',
    name: item.value.title,
    description: t(`pages.${serviceId.value}.description`),
    url: canonical.value,
    provider: {
      '@type': 'Person',
      name: 'André Kipphard',
      url: 'https://kipphard.com',
      jobTitle: 'Senior Frontend Engineer',
    },
    areaServed: isLocal ? 'Paderborn, Ostwestfalen-Lippe' : 'DE',
    ...(isLocal && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Paderborn',
        addressCountry: 'DE',
      },
    }),
  }
  const graph: Record<string, unknown>[] = [service]
  if (item.value.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: item.value.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
})

useHead({
  script: [{ type: 'application/ld+json', innerHTML: () => jsonLd.value }],
})
</script>

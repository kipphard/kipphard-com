<template>
  <main id="main">
    <Hero />
    <Stats />

    <!-- About preview -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="label">{{ t('about.eyebrow') }}</p>
          <div>
            <h2>{{ t('about.title') }}</h2>
            <p class="lede">{{ t('about.intro') }}</p>
            <p class="more">
              <RouterLink to="/about" class="link">
                {{ t('home.aboutLink') }}
                <span class="arrow" aria-hidden="true">→</span>
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services preview -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="label">{{ t('services.eyebrow') }}</p>
          <div>
            <h2>{{ t('services.title') }}</h2>
            <p class="lede">{{ t('services.intro') }}</p>
          </div>
        </div>

        <div class="services">
          <article
            v-for="(item, i) in servicesPreview"
            :key="i"
            class="service"
          >
            <div class="n">
              <span>{{ String(i + 1).padStart(2, '0') }} / 06</span>
              <span>{{ categoryLabel(item.icon) }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </article>
        </div>

        <p class="more">
          <RouterLink to="/services" class="link">
            {{ t('home.servicesLink') }}
            <span class="arrow" aria-hidden="true">→</span>
          </RouterLink>
        </p>
      </div>
    </section>

    <!-- Work preview -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="label">{{ t('work.eyebrow') }}</p>
          <div>
            <h2>{{ t('work.title') }}</h2>
            <p class="lede">{{ t('work.intro') }}</p>
          </div>
        </div>

        <div class="projects">
          <component
            v-for="item in workPreview"
            :is="projectTag(item)"
            v-bind="projectAttrs(item)"
            :key="item.id"
            :class="['project', { 'project--featured': item.size === 'featured' }]"
          >
            <div class="meta">
              <span>{{ item.type }}</span>
              <span>{{ item.year }}</span>
            </div>
            <div>
              <h3>{{ item.client }} — {{ item.title }}</h3>
              <p class="desc">{{ item.desc }}</p>
              <div class="tags">
                <span v-for="tag in item.stack" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="year">{{ item.year }} →</div>
          </component>
        </div>

        <p class="more">
          <RouterLink to="/work" class="link">
            {{ t('home.workLink') }}
            <span class="arrow" aria-hidden="true">→</span>
          </RouterLink>
        </p>
      </div>
    </section>

    <CtaBanner />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import Hero from '@/sections/Hero/Hero.vue'
import Stats from '@/sections/Stats/Stats.vue'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'

interface ServiceItem { icon: string; title: string; desc: string; tags: string[] }
interface WorkItem {
  id: string; size: string; year: string; client: string; type: string;
  title: string; desc: string; stack: string[]; url?: string;
  case?: { hero: string }
}

const { t, tm } = useI18n()

const servicesAll = computed(() => tm('services.items') as ServiceItem[])
const workAll     = computed(() => tm('work.items') as WorkItem[])

const servicesPreview = computed(() => servicesAll.value.slice(0, 3))
const workPreview     = computed(() => workAll.value.slice(0, 3))

const categoryMap: Record<string, string> = {
  code: 'Frontend',
  server: 'Backend',
  cart: 'Shop',
  wordpress: 'WordPress',
  search: 'SEO',
  gauge: 'Performance',
}
function categoryLabel(icon: string) {
  return categoryMap[icon] ?? icon
}

function projectTag(item: WorkItem) {
  if (item.case) return RouterLink
  if (item.url) return 'a'
  return 'div'
}
function projectAttrs(item: WorkItem): Record<string, string> {
  if (item.case) return { to: `/work/${item.id}` }
  if (item.url) return { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
  return {}
}

useSeoMeta({
  title:         () => t('pages.home.title'),
  description:   () => t('pages.home.description'),
  ogTitle:       () => t('pages.home.ogTitle'),
  ogDescription: () => t('pages.home.ogDescription'),
  ogType:        'website',
  ogUrl:         'https://kipphard.com/',
  ogImage:       'https://kipphard.com/og-image.png',
  twitterCard:   'summary_large_image',
})
</script>

<style lang="scss" scoped src="./Home.scss" />

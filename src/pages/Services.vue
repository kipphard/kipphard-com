<template>
  <main id="main">
    <section class="page-head">
      <div class="container">
        <div class="label">{{ t('services.eyebrow') }}</div>
        <h1>{{ t('services.title') }}</h1>
        <p class="lede">{{ t('services.intro') }}</p>
      </div>
    </section>

    <section class="section services-section">
      <div class="container">
        <div class="services">
          <article
            v-for="(svc, i) in items"
            :key="i"
            class="service"
          >
            <div class="n">
              <span>{{ String(i + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}</span>
              <span>{{ categoryLabel(svc.icon) }}</span>
            </div>
            <h3>{{ svc.title }}</h3>
            <p>{{ svc.desc }}</p>
            <div class="tags">
              <span v-for="tag in svc.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <CtaBanner />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'

interface ServiceItem {
  icon: string
  title: string
  desc: string
  tags: string[]
}

const { t, tm } = useI18n()

const items = computed(() => tm('services.items') as ServiceItem[])

const CATEGORY_MAP: Record<string, string> = {
  code: 'Frontend',
  server: 'Backend',
  cart: 'Shop',
  wordpress: 'WordPress',
  search: 'SEO',
  gauge: 'Performance',
}

function categoryLabel(icon: string): string {
  return CATEGORY_MAP[icon] ?? icon
}

useHead({
  title: () => t('pages.services.title'),
  meta: [{ name: 'description', content: () => t('pages.services.description') }],
})
</script>

<style lang="scss" scoped src="./Services.scss" />

<template>
  <main id="main">
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">{{ t('servicesIndex.eyebrow') }}</span>
          <h1>{{ t('servicesIndex.title') }}</h1>
          <p>{{ t('servicesIndex.intro') }}</p>
        </div>

        <div class="grid-3">
          <RouterLink
            v-for="item in items"
            :key="item.id"
            :to="localePath(`/leistungen/${item.id}`)"
            class="card"
          >
            <div class="card__icon"><Icon :name="item.icon" :size="24" /></div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.teaser }}</p>
            <span class="work-card__more">{{ t('servicesIndex.more') }} <span class="arrow" aria-hidden="true">→</span></span>
          </RouterLink>
        </div>
      </div>
    </section>

    <CtaBanner />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleHead } from '@/composables/useLocaleHead'

interface ServiceItem {
  id: string
  icon: string
  title: string
  teaser: string
}

const { t, tm } = useI18n()
const { localePath } = useLocalePath()

const items = computed(() => tm('servicesDetail.items') as ServiceItem[])

useHead({
  title: () => t('pages.leistungen.title'),
  meta: [
    { name: 'description',        content: () => t('pages.leistungen.description') },
    { property: 'og:title',       content: () => t('pages.leistungen.title') },
    { property: 'og:description', content: () => t('pages.leistungen.description') },
    { property: 'og:type',        content: 'website' },
    { name: 'twitter:card',       content: 'summary' },
  ],
})

useLocaleHead(() => '/leistungen')
</script>

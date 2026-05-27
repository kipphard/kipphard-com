<template>
  <main id="main">
    <section class="page-head">
      <div class="container">
        <div class="label">{{ t('work.eyebrow') }}</div>
        <h1>{{ t('work.title') }}</h1>
        <p class="lede">{{ t('work.intro') }}</p>
      </div>
    </section>

    <section class="section work-section">
      <div class="container">
        <div class="work-filters" role="group" :aria-label="t('work.filtersLabel')">
          <button
            v-for="f in filters"
            :key="f.id"
            class="filter"
            :aria-pressed="activeFilter === f.id ? 'true' : 'false'"
            @click="activeFilter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="projects">
          <component
            :is="projectTag(item)"
            v-for="(item, index) in filteredItems"
            :key="item.id"
            v-bind="projectBindings(item)"
            :class="['project', { 'project--featured': index === 0 && item.size === 'featured' }]"
          >
            <div>
              <div class="meta">
                <template v-if="index === 0 && item.size === 'featured'">
                  <span v-for="tag in item.filter" :key="tag">{{ tag }}</span>
                </template>
                <template v-else>
                  <span>{{ item.type }}</span>
                  <span>{{ item.year }}</span>
                </template>
              </div>
            </div>
            <div>
              <h3>{{ item.client }} — {{ item.title }}</h3>
              <p class="desc">{{ item.desc }}</p>
              <div class="tags">
                <span v-for="s in item.stack" :key="s" class="tag">{{ s }}</span>
              </div>
            </div>
            <div class="year">{{ item.year }}{{ item.url || item.case ? ' →' : '' }}</div>
          </component>
        </div>
      </div>
    </section>

    <CtaBanner />
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'

interface WorkItem {
  id: string
  size: string
  filter: string[]
  year: string
  client: string
  type: string
  title: string
  desc: string
  stack: string[]
  thumb: string
  url?: string
  case?: { hero: string }
}

interface WorkFilter {
  id: string
  label: string
}

const { t, tm } = useI18n()

useHead({
  title: () => t('pages.work.title'),
  meta: [{ name: 'description', content: () => t('pages.work.description') }],
})

const filters = computed(() => tm('work.filters') as WorkFilter[])
const items = computed(() => tm('work.items') as WorkItem[])

const activeFilter = ref<string>('all')

const filteredItems = computed(() =>
  activeFilter.value === 'all'
    ? items.value
    : items.value.filter((i) => i.filter?.includes(activeFilter.value)),
)

function projectTag(item: WorkItem) {
  if (item.case) return RouterLink
  if (item.url) return 'a'
  return 'div'
}

function projectBindings(item: WorkItem): Record<string, string> {
  if (item.case) return { to: `/work/${item.id}` }
  if (item.url) return { href: item.url, target: '_blank', rel: 'noopener' }
  return {}
}
</script>

<style lang="scss" scoped src="./Work.scss" />

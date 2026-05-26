<template>
  <section id="work" class="section" aria-labelledby="work-title">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="eyebrow">{{ t('work.eyebrow') }}</div>
          <h2 id="work-title" class="section-title">{{ t('work.title') }}</h2>
        </div>
        <p class="section-intro">{{ t('work.intro') }}</p>
      </div>

      <div class="filter-row">
        <button
          v-for="f in filters"
          :key="f.id"
          :class="['filter', { active: filter === f.id }]"
          @click="filter = f.id"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="work-grid">
        <component
          :is="item.case ? 'RouterLink' : item.url ? 'a' : 'div'"
          v-for="item in filteredItems"
          :key="item.id"
          v-bind="cardBindings(item)"
          :class="['work-card', item.size]"
        >
          <div class="work-thumb">
            <div :class="['work-thumb__visual', `work-thumb__visual--${item.thumb}`]">
              <div class="browser-chrome">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="thumb-body"></div>
            </div>
          </div>
          <div class="work-meta">
            <span>{{ item.client }}</span>
            <span>{{ item.type }} · {{ item.year }}</span>
          </div>
          <h3 class="work-title">{{ item.title }}</h3>
          <p v-if="item.size !== 'compact'" class="work-desc">{{ item.desc }}</p>
          <div class="work-stack">
            <span v-for="s in item.stack" :key="s">{{ s }}</span>
          </div>
          <span v-if="!item.case && item.url" class="work-card__ext" aria-hidden="true">↗</span>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface WorkItem {
  id: string
  filter: string[]
  size: 'featured' | 'normal' | 'compact'
  thumb: string
  client: string
  type: string
  year: string
  title: string
  desc: string
  stack: string[]
  url?: string
  case?: object
}

interface WorkFilter {
  id: string
  label: string
}

const { t, tm } = useI18n()

const filter = ref<string>('all')

const filters = computed(() => tm('work.filters') as WorkFilter[])
const items = computed(() => tm('work.items') as WorkItem[])

const filteredItems = computed(() =>
  items.value.filter(
    (i) => filter.value === 'all' || i.filter.includes(filter.value),
  ),
)

function cardBindings(item: WorkItem): Record<string, string> {
  if (item.case) {
    return { to: `/work/${item.id}` }
  }
  if (item.url) {
    return { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
  }
  return {}
}
</script>

<style lang="scss" scoped src="./Projects.scss" />

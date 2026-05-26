<template>
  <section id="services" class="section" aria-labelledby="services-title">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="eyebrow">{{ t('services.eyebrow') }}</div>
          <h2 id="services-title" class="section-title">{{ t('services.title') }}</h2>
        </div>
        <p class="section-intro">{{ t('services.intro') }}</p>
      </div>
      <div class="services-grid">
        <div
          v-for="(svc, i) in items"
          :key="i"
          class="svc"
        >
          <div class="num">{{ String(i + 1).padStart(2, '0') }} / {{ total }}</div>
          <div class="svc-icon">
            <Icon :name="svc.icon" :size="22" />
          </div>
          <h3>{{ svc.title }}</h3>
          <p>{{ svc.desc }}</p>
          <div class="svc-tags">
            <span v-for="tag in svc.tags" :key="tag" class="svc-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'

interface ServiceItem {
  icon: string
  title: string
  desc: string
  tags: string[]
}

const { t, tm } = useI18n()

const items = computed(() => tm('services.items') as ServiceItem[])
const total = computed(() => String(items.value.length).padStart(2, '0'))
</script>

<style lang="scss" scoped src="./Services.scss" />

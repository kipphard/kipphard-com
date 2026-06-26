<template>
  <section class="section" id="services">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">{{ t('nav.services') }}</span>
        <h2>{{ t('services.title') }}</h2>
        <p>{{ t('services.intro') }}</p>
      </div>

      <div class="grid-3">
        <article v-for="(item, i) in services" :key="i" class="card">
          <div class="card__icon"><Icon :name="item.icon" :size="24" /></div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'

interface ServiceItem { icon: string; title: string; desc: string; tags: string[] }

const { t, tm } = useI18n()
const services = computed(() => tm('services.items') as ServiceItem[])
</script>

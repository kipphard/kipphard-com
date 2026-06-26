<template>
  <section class="section section--sunken" id="about">
    <div class="container about__grid">
      <div class="about__copy">
        <span class="eyebrow">{{ t('nav.about') }}</span>
        <h2>{{ t('about.title') }}</h2>
        <p>{{ t('about.intro') }}</p>
        <p>{{ t('about.para2') }}</p>
        <p>{{ t('about.para3') }}</p>
      </div>

      <div>
        <div class="workflow__head">
          <span class="tag tag--accent">{{ t('about.workflowTag') }}</span>
          <strong>{{ t('about.workflowTitle') }}</strong>
        </div>
        <div class="steps">
          <div v-for="(step, i) in steps" :key="i" class="step">
            <div class="step__num">{{ i + 1 }}</div>
            <div>
              <div class="step__label">{{ step.label }}</div>
              <div class="step__desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Step { label: string; desc: string; ai: boolean }

const { t, tm } = useI18n()
const steps = computed(() => tm('about.steps') as Step[])
</script>

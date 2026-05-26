<template>
  <section id="about" class="section" aria-labelledby="about-title">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="eyebrow">{{ t('about.eyebrow') }}</div>
          <h2 id="about-title" class="section-title">{{ t('about.title') }}</h2>
        </div>
      </div>
      <div class="about-grid">
        <div class="about-copy">
          <p>{{ t('about.intro') }}</p>
          <p>{{ t('about.para2') }}</p>
          <p>{{ t('about.para3') }}</p>
          <div class="credentials">
            <div
              v-for="(c, i) in credentials"
              :key="i"
              class="cred-row"
            >
              <div class="year">{{ c.year }}</div>
              <div class="what">{{ c.what }}</div>
              <div class="where">{{ c.where }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="workflow">
            <div class="workflow-head">
              <h3>{{ t('about.workflowTitle') }}</h3>
              <span class="workflow-tag">◆ {{ t('about.workflowTag') }}</span>
            </div>
            <div
              v-for="(s, i) in steps"
              :key="i"
              :class="['flow-step', { ai: s.ai }]"
            >
              <div class="idx">{{ String(i + 1).padStart(2, '0') }}</div>
              <div>
                <div class="label">{{ s.label }}</div>
                <div class="desc">{{ s.desc }}</div>
              </div>
              <div class="flow-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Credential {
  year: string
  what: string
  where: string
}

interface Step {
  label: string
  desc: string
  ai?: boolean
}

const { t, tm } = useI18n()

const credentials = tm('about.credentials') as Credential[]
const steps = tm('about.steps') as Step[]
</script>

<style lang="scss" scoped src="./About.scss" />

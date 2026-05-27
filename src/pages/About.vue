<template>
  <main id="main">
    <section class="page-head">
      <div class="container">
        <div class="label">{{ t('about.eyebrow') }}</div>
        <h1>{{ t('about.title') }}</h1>
        <p class="lede">{{ t('about.intro') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="bio-grid">
          <div class="bio">
            <p>{{ t('about.para2') }}</p>
            <p>{{ t('about.para3') }}</p>
          </div>

          <div>
            <div class="label" style="margin-bottom: var(--sp-4);">Laufbahn</div>
            <ul class="timeline">
              <li v-for="(c, i) in credentials" :key="i">
                <span class="when">{{ c.year }}</span>
                <div>
                  <span class="role">{{ c.what }}</span>
                  <span class="org">{{ c.where }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="label">02.1 / Workflow</span>
          <div>
            <h2>
              {{ t('about.workflowTitle') }}
              <span class="workflow-tag">◆ {{ t('about.workflowTag') }}</span>
            </h2>
          </div>
        </div>

        <div class="workflow">
          <div
            v-for="(s, i) in steps"
            :key="i"
            class="workflow-step"
          >
            <span class="n">{{ String(i + 1).padStart(2, '0') }} / {{ String(steps.length).padStart(2, '0') }}</span>
            <h4>{{ s.label }}</h4>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaBanner />
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'

const { t, tm } = useI18n()

const credentials = tm('about.credentials') as Array<{ year: string; what: string; where: string }>
const steps       = tm('about.steps')       as Array<{ label: string; desc: string; ai: boolean }>

useHead({
  title: () => t('pages.about.title'),
  meta: [{ name: 'description', content: () => t('pages.about.description') }],
})
</script>

<style lang="scss" scoped src="./About.scss" />

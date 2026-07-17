<template>
  <main id="main">
    <section class="section">
      <div class="container about__grid">
        <div class="about__copy">
          <span class="eyebrow">{{ t('cv.eyebrow') }}</span>
          <h1>{{ t('cv.name') }}</h1>
          <p><strong>{{ t('cv.role') }}</strong></p>
          <p>{{ t('cv.location') }}</p>
          <p>{{ t('cv.profile') }}</p>

          <div class="tags cv-contact">
            <a
              href="mailto:andre@kipphard.com"
              class="tag"
              @click="trackEvent('contact_click', { method: 'email', location: 'about' })"
            >andre@kipphard.com</a>
            <a href="https://de.linkedin.com/in/andr%C3%A9-kipphard-2653991b3" target="_blank" rel="noopener noreferrer" class="tag">LinkedIn ↗</a>
            <a href="https://github.com/kipphard" target="_blank" rel="noopener noreferrer" class="tag">GitHub ↗</a>
          </div>

          <div class="hero__cta cv-actions">
            <a :href="t('cv.pdfUrl')" download class="btn btn--primary">
              {{ t('cv.downloadLabel') }}
              <span class="arrow" aria-hidden="true">→</span>
            </a>
            <RouterLink :to="localePath('/#contact')" class="btn btn--ghost">{{ t('cv.getInTouch') }}</RouterLink>
          </div>
        </div>

        <div class="hero__media">
          <img
            src="/portrait.webp"
            alt="André Kipphard"
            width="800"
            height="1200"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="stats">
          <div v-for="stat in stats" :key="stat.label" class="stat">
            <div class="stat__num">{{ stat.num }}</div>
            <div class="stat__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sunken">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('cv.skillsTitle') }}</h2>
        </div>
        <div class="grid-2">
          <div v-for="skill in skills" :key="skill.title" class="card">
            <div class="card__icon"><Icon :name="skill.icon" :size="24" /></div>
            <h3>{{ skill.title }}</h3>
            <div class="tags">
              <span v-for="tag in skill.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('cv.experienceTitle') }}</h2>
        </div>
        <div class="steps">
          <div v-for="job in experience" :key="job.company + job.period" class="step step--period">
            <div class="step__num step__num--year">{{ job.period }}</div>
            <div>
              <div class="step__label">
                {{ job.company }} — {{ job.role }}
                <span v-if="job.current" class="ai">Current</span>
              </div>
              <div class="step__location">{{ job.location }}</div>
              <ul class="exp-bullets">
                <li v-for="bullet in job.bullets" :key="bullet">{{ bullet }}</li>
              </ul>
              <div v-if="job.links" class="step__links">
                <RouterLink v-for="link in job.links" :key="link.to" :to="localePath(link.to)" class="step__more">
                  {{ link.label }} <span class="arrow" aria-hidden="true">→</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('cv.educationTitle') }}</h2>
        </div>
        <div class="steps">
          <div v-for="edu in education" :key="edu.what" class="step step--period">
            <div class="step__num step__num--year">{{ edu.period }}</div>
            <div>
              <div class="step__label">{{ edu.what }}</div>
              <div class="step__desc">{{ edu.where }}</div>
            </div>
          </div>
        </div>

        <div class="section-head cv-subsection">
          <h2>{{ t('cv.languagesTitle') }}</h2>
        </div>
        <div class="tags">
          <span v-for="lang in languages" :key="lang" class="tag">{{ lang }}</span>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="section-head">
          <h2>{{ t('cv.focusTitle') }}</h2>
        </div>
        <div class="grid-2">
          <RouterLink :to="localePath('/leistungen/bfsg-barrierefreiheit')" class="card">
            <h3>{{ t('cv.focusBfsgTitle') }}</h3>
            <p>{{ t('cv.focusBfsgText') }}</p>
            <span class="work-card__more">{{ t('cv.focusMore') }} <span class="arrow" aria-hidden="true">→</span></span>
          </RouterLink>
          <RouterLink :to="localePath('/products/barrierefrei-check')" class="card">
            <h3>{{ t('cv.focusPluginTitle') }}</h3>
            <p>{{ t('cv.focusPluginText') }}</p>
            <span class="work-card__more">{{ t('cv.focusMore') }} <span class="arrow" aria-hidden="true">→</span></span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-panel">
          <div class="cta-panel__copy">
            <h2>{{ t('cv.ctaTitle') }}</h2>
            <p>{{ t('cv.ctaText') }}</p>
          </div>
          <div class="hero__cta">
            <RouterLink :to="localePath('/#contact')" class="btn btn--primary">
              {{ t('cv.getInTouch') }} <span class="arrow" aria-hidden="true">→</span>
            </RouterLink>
            <a :href="t('cv.pdfUrl')" download class="btn btn--ghost">{{ t('cv.downloadLabel') }}</a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleHead } from '@/composables/useLocaleHead'
import { trackEvent } from '@/lib/consent'

interface Stat { num: string; label: string }
interface Skill { icon: string; title: string; tags: string[] }
interface ExperienceLink { label: string; to: string }
interface Experience {
  period: string
  company: string
  role: string
  location: string
  current: boolean
  bullets: string[]
  links?: ExperienceLink[]
}
interface Education { period: string; what: string; where: string }

const { t, tm } = useI18n()
const { localePath } = useLocalePath()

const stats = computed(() => tm('cv.stats') as Stat[])
const skills = computed(() => tm('cv.skills') as Skill[])
const experience = computed(() => tm('cv.experience') as Experience[])
const education = computed(() => tm('cv.education') as Education[])
const languages = computed(() => tm('cv.languages') as string[])

useHead({
  title: () => t('pages.about.title'),
  meta: [
    { name: 'description',        content: () => t('pages.about.description') },
    { property: 'og:title',       content: () => t('pages.about.title') },
    { property: 'og:description', content: () => t('pages.about.description') },
    { property: 'og:type',        content: 'profile' },
    { name: 'twitter:card',       content: 'summary' },
  ],
})

// canonical + hreflang + og:url + og:locale
useLocaleHead(() => '/about')
</script>

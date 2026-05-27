<template>
  <main id="main">
    <section class="page-head">
      <div class="container">
        <p class="label">{{ t('contact.eyebrow') }}</p>
        <h1>{{ t('contact.title') }}</h1>
        <p class="lede">{{ t('contact.lede') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <!-- Left: contact info as a definition list -->
          <dl class="contact-info">
            <div v-for="(link, i) in links" :key="i" class="contact-row">
              <dt>{{ link.label }}</dt>
              <dd>
                <a v-if="link.href !== '#'" :href="link.href">{{ link.value }}</a>
                <span v-else>{{ link.value }}</span>
              </dd>
            </div>
          </dl>

          <!-- Right: form -->
          <form class="form" @submit="handleSubmit">
            <div v-if="status === 'success'" class="success-card" role="status" aria-live="polite">
              <div class="success-icon" aria-hidden="true">✓</div>
              <div>
                <div class="success-title">{{ t('contact.form.success') }}</div>
                <div class="success-sub">{{ t('contact.form.successSub') }}</div>
              </div>
            </div>

            <template v-else>
              <div class="form-row form-row--2">
                <div class="field">
                  <label for="contact-name">{{ t('contact.form.name') }}</label>
                  <input
                    id="contact-name"
                    v-model="form.name"
                    type="text"
                    :placeholder="t('contact.form.name')"
                    aria-required="true"
                  />
                </div>
                <div class="field">
                  <label for="contact-email">{{ t('contact.form.email') }}</label>
                  <input
                    id="contact-email"
                    v-model="form.email"
                    type="email"
                    :placeholder="t('contact.form.email')"
                    aria-required="true"
                  />
                </div>
              </div>

              <div class="hp-field" aria-hidden="true">
                <label for="contact-website">Website</label>
                <input
                  id="contact-website"
                  v-model="form.website"
                  type="text"
                  name="website"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <div class="form-row">
                <div class="field">
                  <label for="contact-company">{{ t('contact.form.company') }}</label>
                  <input
                    id="contact-company"
                    v-model="form.company"
                    type="text"
                    :placeholder="t('contact.form.company')"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label id="type-group-label">{{ t('contact.form.type') }}</label>
                  <div class="choice-group" role="radiogroup" :aria-labelledby="'type-group-label'">
                    <label v-for="tp in types" :key="tp" class="choice">
                      <input
                        type="radio"
                        name="contact-type"
                        :value="tp"
                        :checked="selectedType === tp"
                        @change="selectedType = tp"
                      />
                      <span>{{ tp }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label id="budget-group-label">{{ t('contact.form.budget') }}</label>
                  <div class="choice-group" role="radiogroup" :aria-labelledby="'budget-group-label'">
                    <label v-for="b in budgets" :key="b" class="choice">
                      <input
                        type="radio"
                        name="contact-budget"
                        :value="b"
                        :checked="selectedBudget === b"
                        @change="selectedBudget = b"
                      />
                      <span>{{ b }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label for="contact-message">{{ t('contact.form.message') }}</label>
                  <textarea
                    id="contact-message"
                    v-model="form.message"
                    :placeholder="t('contact.form.messagePh')"
                    aria-required="true"
                  />
                </div>
              </div>

              <div ref="turnstileEl" class="turnstile-widget" />

              <div v-if="status === 'error' && errorKey" class="form-error" role="alert">
                {{ t(`contact.form.errors.${errorKey}`) }}
              </div>

              <div class="form-actions">
                <span class="note">↳ {{ t('contact.form.note') }}</span>
                <button
                  type="submit"
                  class="btn"
                  :disabled="status === 'sending'"
                >
                  {{ status === 'sending' ? t('contact.form.submitting') : t('contact.form.submit') }}
                  <span class="arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </template>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

interface ContactLink {
  label: string
  value: string
  href: string
}

const { t, tm } = useI18n()

useHead({
  title: () => t('pages.contact.title'),
  meta: [{ name: 'description', content: () => t('pages.contact.description') }],
})

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorKey = ref<string | null>(null)

const selectedBudget = ref<string | null>(null)
const selectedType = ref<string | null>(null)
const form = reactive({ name: '', email: '', company: '', message: '', website: '' })

const links = computed(() => tm('contact.links') as ContactLink[])
const types = computed(() => tm('contact.form.types') as string[])
const budgets = computed(() => tm('contact.form.budgets') as string[])

const turnstileEl = ref<HTMLDivElement | null>(null)
const turnstileToken = ref<string | null>(null)
let turnstileWidgetId: string | null = null
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

onMounted(async () => {
  if (!TURNSTILE_SITE_KEY) return
  await loadTurnstileScript()
  if (!turnstileEl.value || !window.turnstile) return
  turnstileWidgetId = window.turnstile.render(turnstileEl.value, {
    sitekey: TURNSTILE_SITE_KEY,
    callback: (t: string) => { turnstileToken.value = t },
    'expired-callback': () => { turnstileToken.value = null },
    'error-callback': () => { turnstileToken.value = null },
    theme: 'auto',
    action: 'contact-form',
  })
})

function loadTurnstileScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve()
    const existing = document.querySelector('script[data-turnstile]')
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true; s.defer = true
    s.dataset.turnstile = 'true'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile-load-failed'))
    document.head.appendChild(s)
  })
}

async function handleSubmit(e: Event) {
  e.preventDefault()
  if (status.value === 'sending') return
  if (!TURNSTILE_SITE_KEY) {
    status.value = 'error'; errorKey.value = 'config'; return
  }
  if (!turnstileToken.value) {
    status.value = 'error'; errorKey.value = 'captcha'; return
  }
  status.value = 'sending'; errorKey.value = null
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        projectType: selectedType.value ?? '',
        budget: selectedBudget.value ?? '',
        message: form.message.trim(),
        website: form.website,
        turnstileToken: turnstileToken.value,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && (data as { ok?: boolean }).ok) {
      status.value = 'success'
    } else {
      status.value = 'error'
      errorKey.value = (data && (data as { error?: string }).error) || 'send-failed'
      resetTurnstile()
    }
  } catch {
    status.value = 'error'; errorKey.value = 'network'
    resetTurnstile()
  }
}

function resetTurnstile() {
  if (turnstileWidgetId && window.turnstile) {
    window.turnstile.reset(turnstileWidgetId)
  }
  turnstileToken.value = null
}
</script>

<style lang="scss" scoped src="./Contact.scss" />

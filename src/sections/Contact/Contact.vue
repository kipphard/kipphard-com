<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="container">
      <div class="section-head">
        <div>
          <div class="eyebrow">{{ t('contact.eyebrow') }}</div>
        </div>
      </div>

      <div class="contact-grid">
        <div>
          <h2 id="contact-title" class="contact-lede">
            <span>{{ titleParts[0] }}</span>
            <span class="accent">{{ titleParts[1] }}</span>
            <span>{{ titleParts[2] }}</span>
          </h2>
          <p>{{ t('contact.lede') }}</p>
          <div class="contact-links">
            <a
              v-for="(link, i) in links"
              :key="i"
              class="contact-link"
              :href="link.href"
            >
              <span class="label">{{ link.label }}</span>
              <span class="value">{{ link.value }}</span>
              <span class="arrow"><Icon name="arrow" :size="16" /></span>
            </a>
          </div>
        </div>

        <form class="form" @submit="handleSubmit">
          <div v-if="submitted" class="success-card" role="status" aria-live="polite">
            <div class="success-icon">✓</div>
            <div>
              <div class="success-title">{{ t('contact.form.success') }}</div>
              <div class="success-sub">{{ t('contact.form.successSub') }}</div>
            </div>
          </div>

          <template v-else>
            <div class="field-row">
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

            <div class="field">
              <label for="contact-company">{{ t('contact.form.company') }}</label>
              <input
                id="contact-company"
                v-model="form.company"
                type="text"
                :placeholder="t('contact.form.company')"
              />
            </div>

            <div class="field">
              <div class="chip-label" id="type-group-label">{{ t('contact.form.type') }}</div>
              <div class="chip-row" role="radiogroup" :aria-labelledby="'type-group-label'">
                <button
                  v-for="tp in types"
                  :key="tp"
                  type="button"
                  role="radio"
                  :aria-checked="selectedType === tp"
                  :class="['chip', { selected: selectedType === tp }]"
                  @click="selectedType = selectedType === tp ? null : tp"
                >{{ tp }}</button>
              </div>
            </div>

            <div class="field">
              <div class="chip-label" id="budget-group-label">{{ t('contact.form.budget') }}</div>
              <div class="chip-row" role="radiogroup" :aria-labelledby="'budget-group-label'">
                <button
                  v-for="b in budgets"
                  :key="b"
                  type="button"
                  role="radio"
                  :aria-checked="selectedBudget === b"
                  :class="['chip', { selected: selectedBudget === b }]"
                  @click="selectedBudget = selectedBudget === b ? null : b"
                >{{ b }}</button>
              </div>
            </div>

            <div class="field">
              <label for="contact-message">{{ t('contact.form.message') }}</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                :placeholder="t('contact.form.messagePh')"
                aria-required="true"
              />
            </div>

            <div class="form-foot">
              <div class="form-note">↳ {{ t('contact.form.note') }}</div>
              <button type="submit" class="btn btn-primary">
                {{ t('contact.form.submit') }} →
              </button>
            </div>
          </template>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/ui/Icon/Icon.vue'

interface ContactLink {
  label: string
  value: string
  href: string
}

const { t, tm } = useI18n()

const submitted = ref(false)
const selectedBudget = ref<string | null>(null)
const selectedType = ref<string | null>(null)
const form = reactive({ name: '', email: '', company: '', message: '' })

const links = computed(() => tm('contact.links') as ContactLink[])
const types = computed(() => tm('contact.form.types') as string[])
const budgets = computed(() => tm('contact.form.budgets') as string[])

const titleParts = computed(() => {
  const title = t('contact.title')
  const accent = t('contact.titleAccent')
  const idx = title.indexOf(accent)
  if (idx === -1) return [title, '', '']
  return [title.slice(0, idx), accent, title.slice(idx + accent.length)]
})

function handleSubmit(e: Event) {
  e.preventDefault()
  submitted.value = true
}
</script>

<style lang="scss" scoped src="./Contact.scss" />

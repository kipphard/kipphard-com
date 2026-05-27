<template>
  <main id="main" class="not-found">
    <div class="container">
      <p class="eyebrow">{{ t('notFound.eyebrow') }}</p>
      <h1 class="title">{{ t('notFound.title') }}</h1>
      <p class="lede">{{ t('notFound.lede') }}</p>
      <RouterLink to="/" class="cta">
        <span class="arrow" aria-hidden="true">←</span>
        {{ t('notFound.cta') }}
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('pages.notFound.title'),
  meta: [
    { name: 'description', content: () => t('pages.notFound.description') },
    { name: 'robots', content: 'noindex' },
  ],
})
</script>

<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding-block: 120px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 24px;
}

.title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 500;
  max-width: 18ch;
  margin: 0 0 24px;
  text-wrap: balance;
}

.lede {
  font-size: 1.125rem;
  color: var(--fg-muted, var(--fg));
  opacity: 0.85;
  max-width: 52ch;
  margin: 0 0 40px;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 999px;
  background: var(--fg);
  color: var(--bg);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  .arrow {
    transition: transform 0.25s ease;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);

    .arrow {
      transform: translateX(-2px);
    }
  }
}

@media (max-width: 720px) {
  .not-found {
    padding-block: 80px;
    min-height: calc(100vh - 160px);
  }
}
</style>

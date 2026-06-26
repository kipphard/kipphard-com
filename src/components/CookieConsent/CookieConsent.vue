<template>
  <Transition name="consent">
    <div
      v-if="bannerOpen"
      class="consent"
      role="dialog"
      aria-live="polite"
      :aria-label="t('consent.aria')"
    >
      <div class="consent__inner container">
        <div class="consent__text">
          <p class="consent__title">{{ t('consent.title') }}</p>
          <p class="consent__body">
            {{ t('consent.body') }}
            <RouterLink :to="localePath('/datenschutz')" class="consent__link">{{ t('consent.privacyLink') }}</RouterLink>.
          </p>
        </div>
        <div class="consent__actions">
          <button type="button" class="btn btn--ghost btn--sm" @click="declineAnalytics">
            {{ t('consent.decline') }}
          </button>
          <button type="button" class="btn btn--primary btn--sm" @click="acceptAnalytics">
            {{ t('consent.accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bannerOpen, initConsent, acceptAnalytics, declineAnalytics } from '@/lib/consent'
import { useLocalePath } from '@/composables/useLocalePath'

const { t } = useI18n()
const { localePath } = useLocalePath()

// Cookie reads + GA happen client-side only; SSR renders nothing (bannerOpen=false).
onMounted(() => initConsent())
</script>

<style lang="scss" scoped>
.consent {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 300;
  padding: clamp(14px, 2vw, 20px);
  background: var(--bg-elev);
  border-top: 1px solid var(--line-strong);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.28);
}

.consent__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: clamp(14px, 2.5vw, 32px);
}

.consent__text {
  flex: 1 1 320px;
}

.consent__title {
  margin: 0 0 4px;
  font-weight: 700;
  color: var(--fg);
}

.consent__body {
  margin: 0;
  max-width: 70ch;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--fg-muted);
}

.consent__link {
  color: var(--accent);
  text-decoration: underline;
}

.consent__actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.consent-enter-active,
.consent-leave-active {
  transition: transform 0.32s var(--ease), opacity 0.32s var(--ease);
}

.consent-enter-from,
.consent-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 560px) {
  .consent__actions {
    width: 100%;
  }
  .consent__actions .btn {
    flex: 1;
  }
}
</style>

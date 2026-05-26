<template>
  <footer>
    <div class="container">
      <div class="foot-grid">
        <div class="foot-col">
          <Wordmark variant="v1" />
          <p class="foot-tagline">{{ t('footer.tagline') }}</p>
        </div>
        <div class="foot-col">
          <h3>{{ t('footer.quick') }}</h3>
          <RouterLink to="/#about">{{ t('nav.about') }}</RouterLink>
          <RouterLink to="/#services">{{ t('nav.services') }}</RouterLink>
          <RouterLink to="/#work">{{ t('nav.work') }}</RouterLink>
          <RouterLink to="/#pricing">{{ t('nav.pricing') }}</RouterLink>
        </div>
        <div class="foot-col">
          <h3>{{ t('footer.contact') }}</h3>
          <a href="mailto:hallo@kipphard.com">hallo@kipphard.com</a>
          <a
            href="https://linkedin.com/in/kipphard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn-Profil von André Kipphard (öffnet in neuem Tab)"
          >LinkedIn</a>
          <a
            href="https://github.com/kipphard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub-Profil von André Kipphard (öffnet in neuem Tab)"
          >GitHub</a>
        </div>
        <div class="foot-col">
          <h3>{{ t('footer.legal') }}</h3>
          <RouterLink to="/impressum">{{ t('footer.imprint') }}</RouterLink>
          <RouterLink to="/datenschutz">{{ t('footer.privacy') }}</RouterLink>
        </div>
      </div>
      <div class="foot-bottom">
        <span>{{ t('footer.copy') }}</span>
        <span>{{ t('footer.built') }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Wordmark from '@/components/ui/Wordmark/Wordmark.vue'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./Footer.scss" />

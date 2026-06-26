<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <RouterLink :to="localePath('/')" class="brand">
            <span class="brand__mark" aria-hidden="true">AK</span>
            <span>André Kipphard</span>
          </RouterLink>
          <p>{{ t('footer.tagline') }}</p>
          <a href="mailto:andre@kipphard.com" class="footer__mail">andre@kipphard.com <span class="arrow" aria-hidden="true">→</span></a>
        </div>

        <div class="footer__col">
          <h4>{{ t('footer.pagesTitle') }}</h4>
          <ul>
            <li><RouterLink :to="localePath('/#about')">{{ t('nav.about') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/#services')">{{ t('nav.services') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/#work')">{{ t('nav.work') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/products')">{{ t('nav.products') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/#labs')">{{ t('nav.labs') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/blog')">{{ t('nav.blog') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/#pricing')">{{ t('nav.pricing') }}</RouterLink></li>
            <li><RouterLink :to="localePath('/#contact')">{{ t('nav.contact') }}</RouterLink></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4>{{ t('footer.profilesTitle') }}</h4>
          <ul>
            <li><a href="https://de.linkedin.com/in/andr%C3%A9-kipphard-2653991b3" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
            <li><a href="https://github.com/kipphard" target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4>{{ t('footer.locationTitle') }}</h4>
          <ul>
            <li>{{ t('footer.locationCity') }}</li>
            <li>{{ t('footer.locationRemote') }}</li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <span>{{ t('footer.copy') }}</span>
        <div class="right">
          <RouterLink :to="localePath('/impressum')">{{ t('footer.imprint') }}</RouterLink>
          <RouterLink :to="localePath('/datenschutz')">{{ t('footer.privacy') }}</RouterLink>
          <button type="button" class="footer__link-btn" @click="openConsentSettings">{{ t('footer.cookieSettings') }}</button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { openConsentSettings } from '@/lib/consent'
import { useLocalePath } from '@/composables/useLocalePath'

const { t } = useI18n()
const { localePath } = useLocalePath()
</script>

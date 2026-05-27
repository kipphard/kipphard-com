<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-col--lede">
          <h4>{{ t('footer.kontaktTitle') }}</h4>
          <p class="lede">{{ t('footer.kontaktLede') }}</p>
          <a href="mailto:andre@kipphard.com" class="link">
            andre@kipphard.com
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div class="footer-col">
          <h4>{{ t('footer.pagesTitle') }}</h4>
          <ul>
            <li><RouterLink to="/about">{{ t('nav.about') }}</RouterLink></li>
            <li><RouterLink to="/services">{{ t('nav.services') }}</RouterLink></li>
            <li><RouterLink to="/work">{{ t('nav.work') }}</RouterLink></li>
            <li><RouterLink to="/pricing">{{ t('nav.pricing') }}</RouterLink></li>
            <li><RouterLink to="/contact">{{ t('nav.contact') }}</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ t('footer.profilesTitle') }}</h4>
          <ul>
            <li>
              <a
                href="https://linkedin.com/in/kipphard"
                target="_blank"
                rel="noopener noreferrer"
              >LinkedIn <span class="ext" aria-hidden="true">↗</span></a>
            </li>
            <li>
              <a
                href="https://github.com/kipphard"
                target="_blank"
                rel="noopener noreferrer"
              >GitHub <span class="ext" aria-hidden="true">↗</span></a>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ t('footer.locationTitle') }}</h4>
          <ul>
            <li>{{ t('footer.locationCity') }}</li>
            <li>{{ t('footer.locationRemote') }}</li>
          </ul>
        </div>
      </div>

      <div class="footer-meta">
        <div class="footer-meta-left">
          <span>{{ t('footer.copy') }}</span>
          <RouterLink to="/impressum">{{ t('footer.imprint') }}</RouterLink>
          <RouterLink to="/datenschutz">{{ t('footer.privacy') }}</RouterLink>
        </div>
        <span class="footer-meta-right">{{ t('footer.version') }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./Footer.scss" />

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="hero-tags">
        <span>{{ t('hero.tagLeft') }}</span>
        <span class="hide-narrow">{{ t('hero.tagRight') }}</span>
      </div>

      <h1 id="hero-title" class="hero-title">
        {{ t('hero.titleLine1') }}<br>
        <span class="em">{{ t('hero.titleAmp') }}</span>&nbsp;<span class="accent">{{ t('hero.titleAccent') }}</span>&nbsp;{{ t('hero.titleTail') }}
      </h1>

      <div class="hero-grid">
        <div class="hero-left">
          <p class="hero-lede" v-html="t('hero.lede')" />
          <div class="hero-ctas">
            <a href="#contact" class="btn">
              {{ t('hero.ctaPrimary') }}
              <span class="arrow" aria-hidden="true">→</span>
            </a>
            <a href="#work" class="btn btn--ghost">{{ t('hero.ctaGhost') }}</a>
          </div>
        </div>

        <div class="hero-photo">
          <img
            src="/portrait.webp"
            alt="André Kipphard"
            width="600"
            height="800"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss" scoped src="./Hero.scss" />

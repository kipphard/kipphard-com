<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div>
        <span class="hero__status"><span class="dot" aria-hidden="true"></span> {{ t('hero.status') }}</span>
        <h1 id="hero-title">
          {{ t('hero.titleLine1') }} {{ t('hero.titleAmp') }}<br />
          <span class="accent">{{ t('hero.titleAccent') }}</span> {{ t('hero.titleTail') }}
        </h1>
        <p class="hero__lede" v-html="t('hero.lede')" />
        <div class="hero__cta">
          <a href="#contact" class="btn btn--primary">
            {{ t('hero.ctaPrimary') }}
            <span class="arrow" aria-hidden="true">→</span>
          </a>
          <a href="#work" class="btn btn--ghost">{{ t('hero.ctaGhost') }}</a>
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
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

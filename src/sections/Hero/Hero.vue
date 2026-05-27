<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="container">

      <div class="hero-layout">
        <!-- Left column: meta + title + sub -->
        <div class="hero-content">
          <div class="hero-meta">
            <span><span class="dot" />{{ t('hero.status') }}</span>
            <span>{{ t('hero.location') }} / {{ t('hero.year') }}</span>
          </div>

          <h1 id="hero-title" class="hero-title">
            {{ t('hero.title1') }}<br>
            <span>{{ t('hero.title2') }}</span><br>
            <span class="accent-word">{{ t('hero.title3') }}</span><br>
            <span class="soft">{{ t('hero.title4') }}</span>
          </h1>

          <div class="hero-sub">
            <p class="hero-lede" v-html="t('hero.lede')" />
            <div class="hero-ctas">
              <a href="#contact" class="btn btn-primary">{{ t('hero.ctaPrimary') }} →</a>
              <a href="#work" class="btn btn-ghost">{{ t('hero.ctaGhost') }}</a>
            </div>
          </div>
        </div>

        <!-- Right column: photo -->
        <div class="hero-photo">
          <img
            class="hero-photo__img"
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

      <!-- Full-width stats row -->
      <div class="hero-stats">
        <div v-for="(stat, i) in stats" :key="i">
          <div class="stat-num">{{ stat.num }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
      <div v-if="t('hero.statsNote')" class="hero-stats-note">{{ t('hero.statsNote') }}</div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const stats = tm('hero.stats') as Array<{ num: string; label: string }>
</script>

<style lang="scss" scoped src="./Hero.scss" />

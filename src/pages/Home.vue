<template>
  <main id="main">
    <Hero />
    <Stats />
    <About />
    <Services />
    <Projects />
    <Pricing />
    <Contact />
  </main>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import Hero from '@/sections/Hero/Hero.vue'
import Stats from '@/sections/Stats/Stats.vue'
import About from '@/sections/About/About.vue'
import Services from '@/sections/Services/Services.vue'
import Projects from '@/sections/Projects/Projects.vue'
import Pricing from '@/sections/Pricing/Pricing.vue'
import Contact from '@/sections/Contact/Contact.vue'

const { t } = useI18n()

useSeoMeta({
  title:         () => t('pages.home.title'),
  description:   () => t('pages.home.description'),
  ogTitle:       () => t('pages.home.ogTitle'),
  ogDescription: () => t('pages.home.ogDescription'),
  ogType:        'website',
  ogUrl:         'https://kipphard.com/',
  ogImage:       'https://kipphard.com/og-image.png',
  twitterCard:   'summary_large_image',
})
</script>

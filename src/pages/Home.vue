<template>
  <main id="main">
    <Hero />
    <Stats />
    <Services />
    <About />
    <Work />
    <Labs />
    <Pricing />
    <Faq />
    <CtaBanner />
    <Contact />
  </main>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import Hero from '@/sections/Hero/Hero.vue'
import Stats from '@/sections/Stats/Stats.vue'
import Services from '@/sections/Services/Services.vue'
import About from '@/sections/About/About.vue'
import Work from '@/sections/Work/Work.vue'
import Labs from '@/sections/Labs/Labs.vue'
import Pricing from '@/sections/Pricing/Pricing.vue'
import Faq from '@/sections/Faq/Faq.vue'
import CtaBanner from '@/components/CtaBanner/CtaBanner.vue'
import Contact from '@/sections/Contact/Contact.vue'

const { t } = useI18n()

useSeoMeta({
  title:              () => t('pages.home.title'),
  description:        () => t('pages.home.description'),
  ogTitle:            () => t('pages.home.ogTitle'),
  ogDescription:      () => t('pages.home.ogDescription'),
  ogType:             'website',
  ogUrl:              'https://kipphard.com/',
  ogImage:            'https://kipphard.com/og-image.png',
  twitterCard:        'summary_large_image',
  twitterTitle:       () => t('pages.home.ogTitle'),
  twitterDescription: () => t('pages.home.ogDescription'),
  twitterImage:       'https://kipphard.com/og-image.png',
  twitterSite:        '@TheSharpBook',
  twitterCreator:     '@TheSharpBook',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://kipphard.com/' }],
})
</script>

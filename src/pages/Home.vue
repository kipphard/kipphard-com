<template>
  <main id="main">
    <Hero />
    <Stats />
    <Services />
    <About />
    <Work />
    <Products />
    <Labs />
    <Pricing />
    <Faq />
    <CtaBanner />
    <Contact />
  </main>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useLocaleHead } from '@/composables/useLocaleHead'
import Hero from '@/sections/Hero/Hero.vue'
import Stats from '@/sections/Stats/Stats.vue'
import Services from '@/sections/Services/Services.vue'
import About from '@/sections/About/About.vue'
import Work from '@/sections/Work/Work.vue'
import Products from '@/sections/Products/Products.vue'
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
  ogImage:            'https://kipphard.com/og-image.png',
  twitterCard:        'summary_large_image',
  twitterTitle:       () => t('pages.home.ogTitle'),
  twitterDescription: () => t('pages.home.ogDescription'),
  twitterImage:       'https://kipphard.com/og-image.png',
  twitterSite:        '@TheSharpBook',
  twitterCreator:     '@TheSharpBook',
})

// canonical + hreflang + og:url + og:locale
useLocaleHead(() => '/')
</script>

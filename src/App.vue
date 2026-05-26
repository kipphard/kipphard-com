<template>
  <a href="#main" class="skip-link">Zum Hauptinhalt springen / Skip to content</a>

  <Header />

  <main id="main">
    <Hero />
    <About />
    <Services />
    <Projects />
    <Pricing />
    <Contact />
  </main>

  <Footer />
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header/Header.vue'
import Footer from '@/components/layout/Footer/Footer.vue'
import Hero from '@/sections/Hero/Hero.vue'
import About from '@/sections/About/About.vue'
import Services from '@/sections/Services/Services.vue'
import Projects from '@/sections/Projects/Projects.vue'
import Pricing from '@/sections/Pricing/Pricing.vue'
import Contact from '@/sections/Contact/Contact.vue'
</script>

<style lang="scss">
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: 9999;

  &:focus-visible {
    left: 16px;
    top: 16px;
    width: auto;
    height: auto;
    overflow: visible;
    padding: 8px 16px;
    background: var(--bg);
    color: var(--fg);
    border: 2px solid var(--accent);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    outline: none;
  }
}
</style>

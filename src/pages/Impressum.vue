<template>
  <main id="main">
    <section class="legal">
      <div class="container">
        <div class="legal__inner">
          <h1>Impressum</h1>

          <p>
            André Kipphard<br />
            Erlenbusch 12<br />
            33106 Paderborn
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: <a href="tel:+491734783577">0173 4783577</a><br />
            E-Mail: <a href="mailto:andre@kipphard.com">andre@kipphard.com</a>
          </p>

          <h2>Redaktionell verantwortlich</h2>
          <p>
            André Kipphard<br />
            Erlenbusch 12<br />
            33106 Paderborn
          </p>

          <h2>Verbraucher&shy;streit&shy;beilegung / Universal&shy;schlichtungs&shy;stelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <p>
            Quelle: <a href="https://www.e-recht24.de" rel="noopener" target="_blank">eRecht24</a>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('pages.impressum.title'),
  meta: [
    { name: 'description', content: () => t('pages.impressum.description') },
  ],
})
</script>

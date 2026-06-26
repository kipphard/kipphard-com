<template>
  <main id="main">
    <template v-if="post && published">
      <article class="section blog-post">
        <div class="container blog-layout">
          <div class="blog-main">
            <RouterLink :to="localePath('/blog')" class="crumb">{{ t('blog.backToBlog') }}</RouterLink>
            <div class="blog-post__meta">
              <span class="blog-tag">{{ t('blog.categories.' + post.category) }}</span>
              <span>{{ formatDate(post.publishedAt, lang) }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ t('blog.readingTime', { min: readingMinutes(content.body) }) }}</span>
            </div>
            <h1>{{ content.title }}</h1>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="blog-prose" v-html="content.body"></div>
            <div v-if="post.tags.length" class="tags blog-post__tags">
              <span v-for="tg in post.tags" :key="tg" class="tag">{{ tg }}</span>
            </div>
          </div>

          <BlogSidebar :exclude-slug="post.slug" />
        </div>
      </article>

      <section v-if="related.length" class="section--tight blog-related">
        <div class="container">
          <h2>{{ t('blog.relatedTitle') }}</h2>
          <div class="blog-related__grid">
            <article v-for="r in related" :key="r.slug" class="blog-card">
              <div class="blog-card__meta">
                <span class="blog-tag">{{ t('blog.categories.' + r.category) }}</span>
                <span>{{ formatDate(r.publishedAt, lang) }}</span>
              </div>
              <h3><RouterLink :to="localePath(`/blog/${r.slug}`)">{{ r[lang].title }}</RouterLink></h3>
              <p class="blog-card__excerpt">{{ r[lang].excerpt }}</p>
            </article>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="blog-notfound">
      <div class="container">
        <p>{{ t('blog.notFound') }}</p>
        <RouterLink :to="localePath('/blog')" class="btn btn--ghost">{{ t('blog.backToBlog') }}</RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  getPost,
  isPublished,
  relatedPosts,
  formatDate,
  readingMinutes,
  type BlogLang,
} from '@/lib/blog'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { useLocaleHead } from '@/composables/useLocaleHead'

const route = useRoute()
const { t, locale } = useI18n()
const { localePath } = useLocalePath()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'de') as BlogLang)

const slug = computed(() => {
  const segs = route.path.split('/')
  return segs[segs.length - 1]
})
const post = computed(() => getPost(slug.value) ?? null)
const published = computed(() => (post.value ? isPublished(post.value) : false))
const content = computed(() =>
  post.value ? post.value[lang.value] : { title: '', description: '', excerpt: '', body: '' },
)
const related = computed(() => (post.value ? relatedPosts(post.value, 3) : []))

// canonical + hreflang + og:url + og:locale — blog slug is identical across locales.
const { canonical } = useLocaleHead(() => `/blog/${slug.value}`)
const jsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: content.value.title,
    description: content.value.description,
    datePublished: post.value?.publishedAt,
    inLanguage: lang.value,
    author: { '@type': 'Person', name: 'André Kipphard', url: 'https://kipphard.com/' },
    publisher: { '@type': 'Person', name: 'André Kipphard' },
    mainEntityOfPage: canonical.value,
  }),
)

useHead({
  title: () =>
    post.value
      ? `${post.value[lang.value].seoTitle || post.value[lang.value].title} — André Kipphard`
      : t('blog.notFound'),
  meta: [
    { name: 'description', content: () => content.value.description },
    { property: 'og:title', content: () => content.value.title },
    { property: 'og:description', content: () => content.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: 'https://kipphard.com/og-image.png' },
    { property: 'article:published_time', content: () => post.value?.publishedAt ?? '' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  script: [{ type: 'application/ld+json', innerHTML: () => jsonLd.value }],
})
</script>

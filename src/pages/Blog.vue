<template>
  <main id="main">
    <section class="section blog-hero">
      <div class="container">
        <span class="eyebrow">{{ t('blog.eyebrow') }}</span>
        <h1>{{ t('blog.title') }}</h1>
        <p class="blog-hero__intro">{{ t('blog.intro') }}</p>
      </div>
    </section>

    <section class="section--tight">
      <div class="container blog-layout">
        <div class="blog-main">
          <div class="blog-filters" role="group" :aria-label="t('blog.categoriesTitle')">
            <button
              type="button"
              :class="['blog-pill', { active: activeCategory === null }]"
              @click="activeCategory = null"
            >{{ t('blog.allCategories') }}</button>
            <button
              v-for="c in cats"
              :key="c.key"
              type="button"
              :class="['blog-pill', { active: activeCategory === c.key }]"
              @click="activeCategory = c.key"
            >{{ t('blog.categories.' + c.key) }}</button>
          </div>

          <div v-if="visiblePosts.length" class="blog-list">
            <article v-for="post in visiblePosts" :key="post.slug" class="blog-card">
              <div class="blog-card__meta">
                <span class="blog-tag">{{ t('blog.categories.' + post.category) }}</span>
                <span>{{ formatDate(post.publishedAt, lang) }}</span>
                <span aria-hidden="true">·</span>
                <span>{{ t('blog.readingTime', { min: readingMinutes(post[lang].body) }) }}</span>
              </div>
              <h2><RouterLink :to="`/blog/${post.slug}`">{{ post[lang].title }}</RouterLink></h2>
              <p class="blog-card__excerpt">{{ post[lang].excerpt }}</p>
              <RouterLink :to="`/blog/${post.slug}`" class="blog-card__more">
                {{ t('blog.readMore') }} <span class="arrow" aria-hidden="true">→</span>
              </RouterLink>
            </article>
          </div>
          <p v-else class="blog-empty">{{ t('blog.empty') }}</p>
        </div>

        <BlogSidebar />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { publishedPosts, categories, readingMinutes, formatDate, type BlogLang } from '@/lib/blog'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'

const route = useRoute()
const { t, locale } = useI18n()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'de') as BlogLang)

const cats = categories()
const all = publishedPosts()

// Start null (matches SSG output → no hydration mismatch); apply ?category= after mount.
const activeCategory = ref<string | null>(null)
function syncFromQuery() {
  const c = route.query.category
  activeCategory.value = typeof c === 'string' && c ? c : null
}
onMounted(syncFromQuery)
watch(() => route.query.category, syncFromQuery)

const visiblePosts = computed(() =>
  activeCategory.value ? all.filter((p) => p.category === activeCategory.value) : all,
)

useHead({
  title: () => t('pages.blog.title'),
  meta: [
    { name: 'description',        content: () => t('pages.blog.description') },
    { property: 'og:title',       content: () => t('pages.blog.title') },
    { property: 'og:description', content: () => t('pages.blog.description') },
    { property: 'og:type',        content: 'website' },
    { property: 'og:url',         content: 'https://kipphard.com/blog' },
    { property: 'og:image',       content: 'https://kipphard.com/og-image.png' },
    { name: 'twitter:card',       content: 'summary_large_image' },
  ],
  link: [{ rel: 'canonical', href: 'https://kipphard.com/blog' }],
})
</script>

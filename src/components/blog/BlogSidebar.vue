<template>
  <aside class="blog-sidebar">
    <div class="blog-aside--sticky">
      <div class="blog-aside">
        <h3>{{ t('blog.categoriesTitle') }}</h3>
        <ul class="blog-cats">
          <li v-for="c in cats" :key="c.key">
            <RouterLink :to="localePath(`/blog?category=${c.key}`)">
              <span>{{ t('blog.categories.' + c.key) }}</span>
              <span class="blog-cats__count">{{ c.count }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div v-if="recent.length" class="blog-aside">
        <h3>{{ t('blog.recentTitle') }}</h3>
        <ul class="blog-recent">
          <li v-for="post in recent" :key="post.slug">
            <RouterLink :to="localePath(`/blog/${post.slug}`)">
              <span class="blog-recent__title">{{ post[lang].title }}</span>
              <span class="blog-recent__date">{{ formatDate(post.publishedAt, lang) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="blog-aside blog-aside--cta">
        <h3>{{ t('blog.ctaTitle') }}</h3>
        <p>{{ t('blog.ctaText') }}</p>
        <RouterLink :to="localePath('/#contact')" class="btn btn--primary btn--sm btn--block">{{ t('blog.ctaButton') }}</RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { categories, recentPosts, formatDate, type BlogLang } from '@/lib/blog'
import { useLocalePath } from '@/composables/useLocalePath'

const props = defineProps<{ excludeSlug?: string }>()
const { t, locale } = useI18n()
const { localePath } = useLocalePath()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'de') as BlogLang)

const cats = categories()
const recent = computed(() => recentPosts(4, props.excludeSlug))
</script>

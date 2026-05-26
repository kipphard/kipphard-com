<template>
  <component :is="tag" class="headline" :class="`headline--${size}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  tag?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'xl' | 'lg' | 'md' | 'sm'
}>(), {
  tag: 'h2',
  size: 'lg',
})
</script>

<style lang="scss" scoped src="./Headline.scss" />

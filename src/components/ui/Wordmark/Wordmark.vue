<template>
  <span class="wordmark" :class="`wordmark--${variant}`">
    <span class="mark" :class="`mark-${variant}`">{{ variant === 'v2' ? 'A·K' : 'AK' }}</span>
    <span class="wordmark-text">André Kipphard<span class="dim">.com</span></span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'v1' | 'v2' | 'v3' | 'v4'
}>(), {
  variant: 'v1',
})
</script>

<style lang="scss" scoped src="./Wordmark.scss" />

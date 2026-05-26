<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="btn"
    :class="[`btn--${variant}`, { 'btn--sm': size === 'sm' }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
  href?: string
}>(), {
  variant: 'primary',
  size: 'md',
})
</script>

<style lang="scss" scoped src="./Button.scss" />

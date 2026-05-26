<template>
  <div class="stat">
    <span class="stat__value">{{ value }}</span>
    <span class="stat__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string
  label: string
}>()
</script>

<style lang="scss" scoped src="./StatItem.scss" />

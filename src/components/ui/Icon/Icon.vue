<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- arrow: diagonal top-right (spec §7) -->
    <template v-if="name === 'arrow'">
      <path d="M7 17 17 7"/>
      <path d="M8 7h9v9"/>
    </template>

    <!-- arrow-right -->
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </template>

    <!-- arrow-down -->
    <template v-else-if="name === 'arrow-down'">
      <path d="M12 5v14"/>
      <path d="m19 12-7 7-7-7"/>
    </template>

    <!-- arrow-up -->
    <template v-else-if="name === 'arrow-up'">
      <path d="M12 19V5"/>
      <path d="m5 12 7-7 7 7"/>
    </template>

    <!-- check (spec §7) -->
    <template v-else-if="name === 'check'">
      <path d="m5 12 4 4L19 6"/>
    </template>

    <!-- sun (spec §7) -->
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </template>

    <!-- moon (spec §7) -->
    <template v-else-if="name === 'moon'">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
    </template>

    <!-- sliders (spec §7) -->
    <template v-else-if="name === 'sliders'">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10"/>
      <circle cx="16" cy="7" r="2"/>
      <circle cx="8" cy="17" r="2"/>
    </template>

    <!-- globe -->
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18"/>
    </template>

    <!-- mail -->
    <template v-else-if="name === 'mail'">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </template>

    <!-- phone -->
    <template v-else-if="name === 'phone'">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.4 1.6.7 2.4a2 2 0 0 1-.4 2.1L8.1 9.4a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.6.6 2.4.7A2 2 0 0 1 22 16.9Z"/>
    </template>

    <!-- linkedin -->
    <template v-else-if="name === 'linkedin'">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </template>

    <!-- github -->
    <template v-else-if="name === 'github'">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </template>

    <!-- code (spec §7) -->
    <template v-else-if="name === 'code'">
      <path d="m16 18 6-6-6-6"/>
      <path d="m8 6-6 6 6 6"/>
    </template>

    <!-- server (spec §7) -->
    <template v-else-if="name === 'server'">
      <rect x="3" y="4" width="18" height="7" rx="2"/>
      <rect x="3" y="13" width="18" height="7" rx="2"/>
      <path d="M7 7.5h.01M7 16.5h.01"/>
    </template>

    <!-- cart (spec §7) -->
    <template v-else-if="name === 'cart'">
      <circle cx="9" cy="20" r="1.5"/>
      <circle cx="18" cy="20" r="1.5"/>
      <path d="M3 4h2l2.4 11.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.5L21 8H6"/>
    </template>

    <!-- wordpress (spec §7) -->
    <template v-else-if="name === 'wordpress'">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3.5 9.5 8.5 21M14.8 4 20 14M5 15l4-11M15 21l5-13"/>
    </template>

    <!-- search (spec §7) -->
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7"/>
      <path d="m20 20-3.5-3.5"/>
    </template>

    <!-- gauge (spec §7) -->
    <template v-else-if="name === 'gauge'">
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
      <path d="m13.4 10.6 4.6-4.6"/>
      <path d="M3 18a9 9 0 1 1 18 0"/>
    </template>

    <!-- lang (spec §7) -->
    <template v-else-if="name === 'lang'">
      <path d="M4 5h11M9 3v2M4 17l5-12 5 12M6 13h6"/>
      <path d="M14 21s3-1 4-4M20 21s-3-1-4-4M13 15h9"/>
    </template>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 16,
})
</script>

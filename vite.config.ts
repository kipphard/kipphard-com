import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  define: {
    // Required so vue-i18n SSR bundle can reference these globals
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssr: {
    // Bundle vue-i18n into the SSR build so Vite applies define-replacements
    noExternal: ['vue-i18n', '@vue/runtime-core', '@vue/reactivity'],
  },
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2020',
    reportCompressedSize: false,
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
})

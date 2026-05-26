/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  turnstile?: {
    render(el: HTMLElement, opts: Record<string, unknown>): string
    reset(id: string): void
    remove(id: string): void
  }
}

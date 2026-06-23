import { ref } from 'vue'

// Consent-gated Google Analytics 4.
// gtag.js is NOT in the static <head>; it is injected only after the visitor
// explicitly opts in via the cookie banner, and only on the production domain
// (so local dev and prod-build previews on localhost never send data).

const GA_ID = 'G-3DGN33PKHG'
const COOKIE = 'kipphard_consent'
const MAX_AGE_DAYS = 180
const PROD_HOST = 'kipphard.com'

export type ConsentChoice = 'granted' | 'denied'

/** Stored choice, or null when the visitor hasn't decided yet. */
export const consent = ref<ConsentChoice | null>(null)
/** Whether the consent banner is currently visible. */
export const bannerOpen = ref(false)

let gaLoaded = false
let lastTrackedPath = ''

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days: number): void {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

function loadGA(): void {
  if (gaLoaded) return
  // Never load on dev / preview / staging — only the live production domain.
  if (location.hostname !== PROD_HOST) return
  gaLoaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments)
  }

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)

  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  lastTrackedPath = location.pathname
}

function clearGACookies(): void {
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0]
    if (name === '_ga' || name === '_gid' || name.startsWith('_ga_')) {
      document.cookie = `${name}=; Max-Age=0; Path=/`
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname}`
    }
  })
}

/** Read the stored choice on first client mount: load GA if granted, else (if
 *  no choice yet) open the banner. Safe to call only in the browser. */
export function initConsent(): void {
  const stored = getCookie(COOKIE)
  if (stored === 'granted') {
    consent.value = 'granted'
    loadGA()
  } else if (stored === 'denied') {
    consent.value = 'denied'
  } else {
    bannerOpen.value = true
  }
}

export function acceptAnalytics(): void {
  setCookie(COOKIE, 'granted', MAX_AGE_DAYS)
  consent.value = 'granted'
  bannerOpen.value = false
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false
  loadGA()
}

export function declineAnalytics(): void {
  setCookie(COOKIE, 'denied', MAX_AGE_DAYS)
  consent.value = 'denied'
  bannerOpen.value = false
  // Stop any already-loaded GA from sending further hits, and drop its cookies.
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true
  clearGACookies()
}

/** Re-open the banner so the visitor can change or withdraw consent. */
export function openConsentSettings(): void {
  bannerOpen.value = true
}

/** SPA page_view for client-side route changes (deduped against the path GA's
 *  initial config already counted). No-op unless consent is granted + GA loaded. */
export function trackPageview(path: string): void {
  if (consent.value !== 'granted' || !gaLoaded || !window.gtag) return
  if (path === lastTrackedPath) return
  lastTrackedPath = path
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: location.href,
    page_title: document.title,
  })
}

# TODO — open items before launch

Tracks work outside the codebase or that needs your input. Code-only follow-ups should go in commits, not here.

---

## Legal (required for DE commercial sites)

- [ ] **Impressum page** — name, address, contact, USt-ID if applicable. Linked from footer (currently `#`).
- [ ] **Datenschutzerklärung (privacy policy)** — generate via [e-recht24.de](https://www.e-recht24.de/) or [Dr. Schwenke](https://drschwenke.de/). Mention any analytics, hosting (Hetzner), font CDN (Google Fonts — note: serving fonts via Google CDN logs visitor IPs, which is a known GDPR issue). Linked from footer.
- [ ] **Decide on Google Fonts hosting** — either self-host Manrope + JetBrains Mono (drop the Google `<link>` and use `@font-face` from `/public/fonts/`), or document the third-party data flow in the privacy policy. Self-hosting also kills the preconnect → faster LCP.

## Contact form

- [ ] **Wire form submission** — currently just flips `submitted = true`. Pick one:
  - [Formspree](https://formspree.io/) — easiest, free tier covers small volume, no backend
  - [Resend](https://resend.com/) — own domain, real email API; needs a tiny backend (Hetzner) or edge function
  - Custom endpoint on the Hetzner box
- [ ] **Spam protection** — at minimum a [honeypot](https://en.wikipedia.org/wiki/Honeypot_(computing)#Spam_protection) field (invisible, bots fill it); ideally Cloudflare Turnstile (free, privacy-friendly, no captcha UX). Avoid reCAPTCHA — it's a GDPR liability.
- [ ] **Rate limiting** — if you self-host the endpoint, cap to ~5 submissions/IP/hour.
- [ ] **Email validation** beyond `type="email"` — basic regex or send a verification ping.
- [ ] **Success/error states** — currently shows success on submit even if the network fails. Wire real states.

## Hosting & domain

- Domain: **kipphard.com** on **Cloudflare**, server: **Hetzner**
- [ ] **DNS** — point `kipphard.com` (apex + `www`) to the Hetzner VPS via A/AAAA records; or use Cloudflare proxy mode (orange cloud) for caching + DDoS.
- [ ] **TLS** — Let's Encrypt via certbot on Hetzner, or Cloudflare's Universal SSL if going through their proxy (Full Strict mode requires a cert on the origin too).
- [ ] **Web server** — nginx / Caddy serving `dist/` as static files. Caddy is one-line config and does TLS automatically.
- [ ] **Caching headers** — long max-age for `/assets/*` (hashed filenames), short / no-cache for `/index.html` and `/sitemap.xml`.
- [ ] **gzip + brotli** — enable in nginx/Caddy. Cloudflare also compresses by default.
- [ ] **www → apex redirect** (or the other way) — pick one canonical.
- [ ] **Deploy pipeline** — GitHub Actions on push to `main` → `pnpm build` → rsync `dist/` to Hetzner. Or use Cloudflare Pages (free, auto-deploys from GitHub, no server needed — could skip the Hetzner box entirely for this static site).

## Analytics

- [ ] **Pick one** (don't mix):
  - **Plausible** (paid, EU-hosted, no cookies, GDPR-free) — best fit for a portfolio
  - **Umami** (self-hosted on Hetzner, no cookies, free)
  - **Google Analytics 4** — most features but requires a cookie banner and Datenschutz entry. Avoid unless you genuinely need GA's depth.
- [ ] **Cookie banner** — only needed if you use GA or anything with persistent identifiers. Plausible/Umami skip this entirely.
- [ ] **Search Console** — once the domain is live, add it to [Google Search Console](https://search.google.com/search-console) and submit `https://kipphard.com/sitemap.xml`.
- [ ] **Bing Webmaster Tools** — same idea, smaller traffic but free signal.

## SEO & content

- [x] **Open Graph image** — `public/og-image.png` (1200×630). Portrait-left + text-right composition rendered via PIL using `_tokens.scss` colors and Manrope from `node_modules/@fontsource/manrope/files/`.
- [x] **Apple touch icon** — `public/apple-touch-icon.png` (180×180). Tight face crop of `andre.jpg`.
- [x] **Real portrait** — `public/portrait.webp` (600×800, ~22 KB, head + shoulders, no t-shirt logo). Wired in `src/sections/Hero/Hero.vue:33`.
- [ ] **Project case studies** — `src/locales/de.json` → `work.items` currently lists Wickie + 5 placeholders. Replace `work.items[1..5]` with real ones (or remove the unused slots until you have material).
- [ ] **Verify accent contrast** — orange (`oklch(0.72 0.15 45)` ≈ `#F0834E`) is used for the italic "fullstack" word and for `.btn-accent`. Run through [a contrast checker](https://webaim.org/resources/contrastchecker/) against `#111110`. If it doesn't hit 4.5:1, darken the accent or change the hero italic word to a lighter neutral.
- [x] **Per-route `<title>` + `<meta name="description">`** — wired via `@unhead/vue` (transitively bundled by vite-ssg, now an explicit dep). Titles + descriptions live in `pages.*` namespace in `src/locales/{de,en}.json`. Home uses `useSeoMeta` for OG/Twitter; other pages use plain `useHead`.
- [x] **`<html lang>` should be `de`, not `en`** — unhead's init seed `htmlAttrs.lang="en"` was overriding `index.html` during SSG. Fixed by pushing `head?.push({ htmlAttrs: { lang: 'de' } })` in the ViteSSG callback in `src/main.ts:45`.

## Performance follow-ups

- [ ] **Run Lighthouse against the deployed site** — local preview scores can mislead.
- [ ] **Web Vitals in production** — if you skip analytics, consider [web-vitals](https://www.npmjs.com/package/web-vitals) reporting to a Cloudflare Worker for free RUM.
- [ ] **Self-host fonts** (see Legal section) — also a perf win, removes the Google preconnect cost.

## A11y follow-ups

- [ ] **Manual keyboard pass** — tab through, verify focus order, confirm skip-link surfaces, no traps.
- [ ] **Screen reader pass** — VoiceOver (Cmd+F5 on macOS) on Safari, or NVDA on Windows.
- [ ] **axe DevTools** browser extension — run a scan on the deployed site to catch anything automated rules can flag.
- [ ] **Reduced-motion verification** — set OS preference to "reduce motion" and confirm transitions don't run.

## Launch gate (currently in place)

- [x] **Kontaktformular vor Launch verdrahten ODER ausblenden** — Done. Contact form posts to Cloudflare Worker `kipphard-com-contact`, validates + sends via Resend, end-to-end tested.
- [ ] **Remove HTTP Basic Auth** — site is currently behind `auth_basic` in `deploy/nginx/kipphard.com.conf` (creds in `/etc/nginx/.htpasswd-kipphard` on `hetzner-vb`). Remove the two `auth_basic*` lines from the vhost AND delete the htpasswd file once:
  - [x] (a) Impressum + Datenschutz are live
  - [ ] (b) Placeholder `work.items[1..5]` replaced by 3 more real case studies (Wickie is in, 3 more needed)
  - [x] (c) `<html lang>` is fixed to `de`
  - [x] (d) Real portrait, favicon, apple-touch, OG image in place

  Also rotate before lifting: Basic Auth password, Turnstile secret key, Resend API key (all sat in chat history during setup).

## Misc

- [ ] **Replace placeholder project thumbnails** — `src/sections/Projects/Projects.scss` has CSS-only stand-ins for the 6 thumb kinds. Real screenshots will look better. (Wickie already uses `case.hero` as a real `<img>` — same pattern when the other 3 case studies land.)
- [ ] **Favicon set** — currently only `favicon.svg` (hand-written AK monogram). Add `favicon.ico` (legacy IE/old browsers) and PNG sizes (16, 32) if you want full coverage.
- [ ] **Favicon Manrope-as-paths** — current `favicon.svg` references `font-family="Manrope"`, but browsers render favicon SVGs in isolation without access to the page's `@font-face` webfonts, so "AK" renders in the system sans-serif fallback. Convert the letters to SVG paths if pixel-perfect Manrope matters.
- [ ] **404 page** — once the host is set up, add a `dist/404.html` that the server serves on missing routes.
- [ ] **GH Actions: Node 20 → Node 24** — `actions/setup-node@v4` and `pnpm/action-setup@v4` are deprecated; GitHub forces Node 24 default starting 2026-06-02, removes Node 20 entirely 2026-09-16. Bump the action versions before then.
- [ ] **README** — write a project README with setup, scripts, deploy instructions.

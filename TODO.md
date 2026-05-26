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

- [ ] **Open Graph image** — `public/og-image.png` (1200×630). Designs the social card preview. Should include name + tagline + portrait.
- [ ] **Apple touch icon** — `public/apple-touch-icon.png` (180×180). iOS home-screen icon.
- [ ] **Real portrait** — replace `public/portrait-placeholder.svg` with an optimized JPEG/WebP (e.g. 600×800 @ ~80 KB). Update `src/sections/Hero/Hero.vue:33` if the filename changes.
- [ ] **Project case studies** — `src/locales/de.json` → `work.items` currently lists 6 invented projects. Replace with real ones (or remove the section until you have material).
- [ ] **Verify accent contrast** — orange (`oklch(0.72 0.15 45)`) is used for the italic "fullstack" word and for `.btn-accent`. Run through [a contrast checker](https://webaim.org/resources/contrastchecker/) against `#111110`. If it doesn't hit 4.5:1, darken the accent or change the hero italic word to a lighter neutral.
- [ ] **`<html lang>` should be `de`, not `en`** — `index.html` source has `lang="de"`, but the vite-ssg-rendered `dist/index.html` ends up with `lang="en"`. Investigate which step in the SSG pipeline overrides it (likely vue-i18n + a `useHead`/SSG hook defaulting to `en`) and force DE on the pre-rendered shell. DE is the canonical language of this site.

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

- [ ] **Remove HTTP Basic Auth** — site is currently behind `auth_basic` in `deploy/nginx/kipphard.com.conf` (creds in `/etc/nginx/.htpasswd-kipphard` on `hetzner-vb`). Remove the two `auth_basic*` lines from the vhost AND delete the htpasswd file once: (a) Impressum + Datenschutz are live, (b) placeholder content (invented projects, placeholder portrait) is replaced, (c) `<html lang>` is fixed to `de`. Then push to redeploy and the site is public.

## Misc

- [ ] **Replace placeholder project thumbnails** — `src/sections/Projects/Projects.scss` has CSS-only stand-ins for the 6 thumb kinds. Real screenshots will look better.
- [ ] **Favicon set** — currently only `favicon.svg`. Add `favicon.ico` (legacy IE/old browsers) and PNG sizes (16, 32) if you want full coverage.
- [ ] **404 page** — once the host is set up, add a `dist/404.html` that the server serves on missing routes.
- [ ] **README** — write a project README with setup, scripts, deploy instructions.

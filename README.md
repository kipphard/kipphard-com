# kipphard.com

My freelance portfolio — a fast, statically generated site with routed case studies, a bilingual
blog with **date-scheduled publishing**, consent-gated analytics, and a serverless contact form.
Built with Vue 3 + Vite and pre-rendered to flat HTML with **vite-ssg**, in German (default) and
English.

## Live

**https://kipphard.com**

## Highlights

- **Static-site generation** via vite-ssg — every route is pre-rendered to a flat HTML file (strong
  Core Web Vitals, no runtime server), then hydrated into a Vue SPA.
- **Bilingual (DE/EN)** with vue-i18n; per-route `<title>`/meta + schema.org JSON-LD via
  `@unhead/vue`; a build-time `sitemap.xml`.
- **Case studies** — routed `/work/<slug>` pages driven from locale data + WebP assets.
- **Blog with scheduled publishing** — posts are HTML + JSON front-matter; a build-time cutoff
  (`__BUILD_TIME__`) gates which posts are live, and a daily server rebuild reveals each one on its
  `publishedAt` date (correct sitemap, no manual step).
- **Consent-gated GA4** — Google Analytics loads only after opt-in via a cookie banner, and only on
  the production domain.
- **Contact form** — a small Cloudflare Worker (`worker/`) verifies a Cloudflare Turnstile token
  and sends mail via Resend; no data stored.
- **Labs** section linking to live, sandboxed demos of my side projects.
- Dark/light theme, accent theming, accessible nav (skip link + ARIA).

## Stack

- **Frontend:** Vue 3 + TypeScript + SCSS, **Vite** + **vite-ssg** (multi-page SSG), **vue-i18n**,
  **@unhead/vue**, **vue-router**; self-hosted fonts (Fontsource). Package manager: **pnpm**.
- **Contact API:** a **Cloudflare Worker** — Turnstile verification + Resend email.
- **Hosting:** built `dist/` served by **nginx** on a Hetzner box, behind **Cloudflare** (proxied,
  Full-Strict TLS with an origin certificate).

## Layout

```
index.html               # SSG entry + <head> (meta, JSON-LD)
src/
  pages/                 # routed views: Home, CaseStudy, Blog, BlogPost, Impressum, Datenschutz, NotFound
  sections/              # Home sections: Hero, Stats, Services, About, Work, Labs, Pricing, Faq, Contact
  components/            # Header/Footer chrome, CtaBanner, CookieConsent, blog sidebar, UI
  content/blog/<slug>/   # blog posts: meta.json + de.html + en.html
  locales/{de,en}.json   # all UI copy + case-study data (work.items) + SEO meta
  lib/                   # blog data layer, consent/GA logic
  styles/                # SCSS tokens + components
  main.ts                # ViteSSG bootstrap, routes, includedRoutes (published blog posts)
worker/                  # Cloudflare Worker for the contact form (Turnstile + Resend)
deploy/                  # nginx vhost, server rebuild script, deploy notes
scripts/gen-sitemap.mjs  # post-build sitemap generator
public/                  # static assets, case-study WebP images, favicons, robots/manifest
```

## Run locally

```bash
pnpm install
pnpm dev        # Vite dev server — http://localhost:5173
pnpm build      # type-check + SSG build + sitemap -> dist/
pnpm preview    # serve the production build locally
```

The contact form's Turnstile widget needs the public site key at build time:

```bash
VITE_TURNSTILE_SITE_KEY=0x... pnpm build
```

Without it the rest of the site builds fine; only the contact widget is inert.

## Authoring content

- **Blog post:** add `src/content/blog/<slug>/` with `meta.json` (`category`, `tags`,
  `publishedAt`, and `de`/`en` `{title, description, excerpt}`) plus `de.html` + `en.html` bodies.
  Routing, the sidebar, related posts and the sitemap pick it up automatically; a future
  `publishedAt` stays hidden until that date.
- **Case study:** add the structured item to `work.items` in both locales, drop WebP assets in
  `public/case-studies/<slug>/`, add `pages.<slug>` SEO meta, and register `/work/<slug>` in
  `src/main.ts`.

## Deployment

Static `dist/` is served by nginx behind Cloudflare. Two paths:

- **Daily server rebuild (the drip):** `deploy/rebuild.sh` runs on the host via cron — it rebuilds
  (`pnpm build:server`, which skips the type-check to stay light) and rsyncs `dist/` to the webroot.
  Rebuilding each day is what makes date-scheduled blog posts go live on their date.
- **GitHub Actions:** `.github/workflows/deploy.yml` builds and deploys on push to `main` (repo
  secrets `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, `TURNSTILE_SITE_KEY`). The Cloudflare Worker is deployed
  separately via `wrangler deploy` from `worker/`.

nginx vhost + origin/Cloudflare setup: see [`deploy/README.md`](deploy/README.md).

## License

MIT — see [LICENSE](LICENSE).

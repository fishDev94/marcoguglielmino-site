# marcoguglielmino.com

Personal website and athletic portfolio for Marco Guglielmino — middle-distance runner, built with Nuxt.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://www.marcoguglielmino.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

---

## Overview

This is the source code for [marcoguglielmino.com](https://www.marcoguglielmino.com) — a personal site blending athletic content with real-time fitness data. It features a blog powered by Contentful CMS, live Strava activity tracking with interactive maps, Instagram reels, race performance records, and a photo gallery.

The site is fully bilingual (Italian/English), SEO-optimized with structured data, and built on a custom "Born to Run" design system. It uses hybrid rendering with ISR on Vercel for optimal performance across dynamic and static content.

---

## Tech Stack

| Layer | Technology | Docs |
|-------|-----------|------|
| Framework | Nuxt 4 | [nuxt.com/docs](https://nuxt.com/docs) |
| UI | Nuxt UI + Tailwind CSS v4 | [ui.nuxt.com](https://ui.nuxt.com) |
| Language | TypeScript (strict) | [typescriptlang.org](https://www.typescriptlang.org/) |
| CMS | Contentful (GraphQL) | [contentful.com/developers/docs](https://www.contentful.com/developers/docs/) |
| Activities | Strava API | [developers.strava.com](https://developers.strava.com/docs/reference/) |
| Social | Instagram Graph API | [developers.facebook.com](https://developers.facebook.com/docs/instagram-api/) |
| Cache | Upstash Redis | [upstash.com/docs/redis](https://upstash.com/docs/redis) |
| Maps | Leaflet | [leafletjs.com](https://leafletjs.com/) |
| i18n | @nuxtjs/i18n | [i18n.nuxtjs.org](https://i18n.nuxtjs.org) |
| Images | @nuxt/image | [image.nuxt.com](https://image.nuxt.com) |
| SEO | Nuxt SEO (sitemap, robots, schema-org) | [nuxtseo.com](https://nuxtseo.com) |
| Analytics | Vercel Analytics + Speed Insights | [vercel.com/docs/analytics](https://vercel.com/docs/analytics) |
| GraphQL | nuxt-graphql-client | [github.com/Diizzayy/nuxt-graphql-client](https://github.com/Diizzayy/nuxt-graphql-client) |
| Composables | VueUse | [vueuse.org](https://vueuse.org/) |
| Deploy | Vercel | [vercel.com/docs](https://vercel.com/docs) |

---

## Architecture

### Rendering Strategy

The app uses **hybrid ISR** (Incremental Static Regeneration) via Nitro route rules:

| Route | Strategy | Revalidation |
|-------|----------|-------------|
| `/activities`, `/activities/**` | ISR | 10 minutes |
| `/coach`, `/gallery`, `/records` | ISR | 1 hour |
| `/contacts` | ISR | 24 hours |
| All other pages | SSR | On-demand |

### Data Sources

```
┌─────────────┐     GraphQL      ┌─────────────────┐
│ Contentful  │ ──────────────── │                 │
└─────────────┘                  │                 │
                                 │   Nuxt Server   │
┌─────────────┐   REST + OAuth   │   (Nitro)       │──── SSR/ISR ──── Client
│ Strava API  │ ──────────────── │                 │
└─────────────┘        ↕         │                 │
                 ┌───────────┐   │                 │
                 │  Upstash  │   └─────────────────┘
                 │  Redis    │          ↑
                 └───────────┘          │
┌─────────────┐   Graph API    ─────────┘
│  Instagram  │ ────────────────
└─────────────┘
```

- **Contentful** → GraphQL queries at build/request time for blog posts, pages, gallery, records
- **Strava** → Server API proxies with OAuth token refresh, Redis cache (15min TTL), rate-limit fallback
- **Instagram** → Server API proxy for reels with video streaming to bypass CORS/IP restrictions
- **Redis** → Caching layer for API responses and OAuth tokens

---

## Features

- **Blog** — Rich text articles from Contentful with search, tag filtering, pagination, and social sharing
- **Strava Activities** — Real-time feed with infinite scroll, detail pages with interactive Leaflet maps, metrics, splits, and laps
- **Instagram Reels** — Server-fetched reels with custom video player (mobile/desktop)
- **Performance Records** — Race results table with times, trends, and linked articles
- **Photo Gallery** — CMS-driven gallery with lightbox viewer
- **Internationalization** — Full IT/EN support with locale-aware routing and SEO hreflang
- **SEO** — Open Graph, Twitter Cards, Schema.org (Person + WebSite), auto-generated sitemap
- **Security** — Strict CSP headers, robots.txt blocking AI bots
- **Design System** — "Born to Run" theme with Material Design 3 color tokens
- **Responsive** — Mobile-first layout with adaptive navigation

---

## Project Structure

```
├── app/
│   ├── pages/                  # File-based routing
│   │   ├── index.vue           # Homepage
│   │   ├── blog/               # Blog listing + detail
│   │   ├── activities/         # Strava activity feed + detail
│   │   ├── performance.vue     # Race records
│   │   └── [slug].vue          # Dynamic CMS pages
│   ├── components/
│   │   ├── Article/            # Blog cards, pagination, social share
│   │   ├── Content/            # CMS content blocks
│   │   ├── Instagram/          # Reel player, viewer, cards
│   │   ├── Performance/        # Race results table, badges
│   │   ├── Strava/             # Activity cards, map, metrics
│   │   └── UI/                 # Navbar, Gallery, ImageViewer, Carousel
│   ├── composables/            # Data fetching and UI state
│   ├── graphql/                # Contentful queries and fragments
│   ├── layouts/                # App shell variants
│   ├── plugins/                # Leaflet (client-only)
│   ├── utils/                  # Adapters, helpers
│   └── assets/                 # CSS, SCSS, SVGs, theme tokens
├── server/
│   ├── api/activities/         # Strava proxy with Redis caching
│   ├── api/instagram/          # Instagram Graph API proxy
│   └── utils/                  # Strava OAuth + fetch utilities
├── i18n/locales/               # it.json, en.json
├── types/                      # TypeScript interfaces
├── public/                     # Static assets
├── nuxt.config.ts              # App configuration
├── DESIGN.md                   # Design system specification
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** 11.x

### Installation

```bash
git clone https://github.com/anthropic-marco/marcoguglielmino-site.git
cd marcoguglielmino-site
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Contentful CMS
CTF_CDA_SPACE_ID=
CTF_CDA_ACCESS_TOKEN=

# Contentful GraphQL
GRAPHQL_CLIENT_CLIENTS_DEFAULT=https://graphql.contentful.com/content/v1/spaces/<SPACE_ID>
GRAPHQL_CLIENT_CLIENTS_DEFAULT_TOKEN=

# Strava API
NUXT_STRAVA_CLIENT_ID=
NUXT_STRAVA_CLIENT_SECRET=
NUXT_STRAVA_REFRESH_TOKEN=
NUXT_STRAVA_ACCESS_TOKEN=

# Upstash Redis
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
KV_URL=
REDIS_URL=

# Instagram Graph API
NUXT_INSTAGRAM_USER_ID=
NUXT_INSTAGRAM_TOKEN=
```

### Development

```bash
# Start the dev server (http://localhost:3000)
pnpm dev

# Type-check the project
pnpm typecheck

# Lint
pnpm lint

# Auto-fix lint issues
pnpm format
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Auto-fix lint issues |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm prepare` | Install Husky git hooks |

---

## Deployment

The site is deployed on **Vercel** with automatic deployments on push:

- **Preset**: Vercel (auto-detected via Nitro)
- **ISR**: Enabled on most routes with configurable revalidation intervals
- **Image Optimization**: Vercel provider in production, ipx locally
- **Analytics**: Vercel Web Analytics + Speed Insights
- **Security Headers**: CSP, X-Frame-Options, and CORS configured via Nitro route rules
- **Dependency Updates**: Automated via Renovate

---

## Documentation References

| Resource | Link |
|----------|------|
| Nuxt | [nuxt.com/docs](https://nuxt.com/docs) |
| Nuxt UI | [ui.nuxt.com](https://ui.nuxt.com) |
| Nuxt I18n | [i18n.nuxtjs.org](https://i18n.nuxtjs.org) |
| Nuxt Image | [image.nuxt.com](https://image.nuxt.com) |
| Nuxt SEO | [nuxtseo.com](https://nuxtseo.com) |
| Contentful | [contentful.com/developers/docs](https://www.contentful.com/developers/docs/) |
| Strava API | [developers.strava.com/docs/reference](https://developers.strava.com/docs/reference/) |
| Upstash Redis | [upstash.com/docs/redis](https://upstash.com/docs/redis) |
| Vercel | [vercel.com/docs](https://vercel.com/docs) |
| Leaflet | [leafletjs.com/reference](https://leafletjs.com/reference.html) |
| VueUse | [vueuse.org](https://vueuse.org/) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| GraphQL | [graphql.org/learn](https://graphql.org/learn/) |

---

## License

This is a personal project. All rights reserved.

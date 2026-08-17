// https://nuxt.com/docs/api/configuration/nuxt-config

const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.marcoguglielmino.com"
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

const baseUrl = getBaseUrl()

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxtjs/mdc",
    "@vercel/analytics",
    "@vercel/speed-insights",
    "nuxt-graphql-client",
    "@nuxt/image",
    "nuxt-svgo-loader",
    "@stefanobartoletti/nuxt-social-share",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "nuxt-schema-org"
  ],
  devtools: {
    enabled: true
  },
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }
      ]
    }
  },
  css: ["~/assets/css/main.css"],
  site: {
    url: baseUrl,
    name: "Marco Guglielmino"
  },
  ui: {
    colorMode: false
  },

  runtimeConfig: {
    ctfSpaceId: "",
    ctfCdaAccessToken: "",
    graphqlClientClientsDefault: "",
    graphqlClientClientsDefaultToken: "",
    stravaClientSecret: "",
    stravaRefreshToken: "",
    stravaClientID: "",
    stravaAccessToken: "",
    cdnBaseUrl: "https://cdn.marcoguglielmino.com",
    instagram: {
      userId: "", // page id
      token: "" // System User Token
    }
  },

  sourcemap: {
    server: true,
    client: true
  },
  compatibilityDate: "2026-06-30",

  nitro: {
    compatibilityDate: {
      vercel: "2025-07-14"
    },
    routeRules: {
      "/coach": {
        isr: 3600
      },
      "/gallery": {
        isr: 3600
      },
      "/contacts": {
        isr: 86400
      },
      "/records": {
        isr: 3600
      },
      "/activities": {
        isr: 600
      },
      "/activities/**": {
        isr: 600
      },
      "/__sitemap__/**": {
        isr: 3600
      },
      "/sitemap.xml": {
        isr: 3600
      },
      "/**": {
        headers: {
          "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https://images.ctfassets.net https://*.tile.openstreetmap.org https://*.cdninstagram.com;",
            "font-src 'self' https://fonts.gstatic.com",
            "media-src 'self' data: https://*.cdninstagram.com https://*.fbcdn.net https://cdn.marcoguglielmino.com;",
            [
              "connect-src",
              "'self'",
              "https://*.cdninstagram.com",
              "https://graphql.contentful.com",
              "https://images.ctfassets.net",
              "https://*.tile.openstreetmap.org",
              "https://vercel.live",
              "wss://*.pusher.com",
              "https://vitals.vercel-insights.com",
              // Nuxt Icon / Iconify
              "https://api.iconify.design",
              "https://cdn.jsdelivr.net",
              "https://unpkg.com"
            ].join(" "),
            "frame-src https://vercel.live",
            "frame-ancestors 'none'"
          ].join("; "),

          "Cross-Origin-Opener-Policy": "same-origin",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      }
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "assets/scss/main" as *;
          `
        }
      }
    }
  },
  "graphql-client": {
    clients: {
      default: {
        host: process.env.GRAPHQL_CLIENT_CLIENTS_DEFAULT as string,
        token: {
          type: "Bearer",
          name: "Authorization",
          value: process.env.GRAPHQL_CLIENT_CLIENTS_DEFAULT_TOKEN
        },
        retainToken: true
      }
    },
    documentPaths: ["./graphql"]
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs"
      }
    }
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"]
    },
    families: [
      {
        name: "Montserrat",
        provider: "google",
        weights: [400, 500, 600, 700, 800, 900],
        global: true
      },
      {
        name: "Inter",
        provider: "google",
        weights: [400, 500, 600, 700, 800, 900],
        global: true
      }
    ]
  },
  i18n: {
    locales: [
      {
        code: "it",
        name: "Italian",
        language: "it-IT",
        file: "it.json"
      },
      {
        code: "en",
        name: "English",
        language: "en-GB",
        file: "en.json"
      }
    ],
    defaultLocale: "it",
    detectBrowserLanguage: false,
    trailingSlash: true,
    baseUrl
  },
  image: {
    providers: {
      contentful: {
        baseURL: "https://images.ctfassets.net/"
      }
    },
    provider: process.env.VERCEL_ENV ? "vercel" : "ipx",
    format: ["webp", "jpg"],
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      xs: 320,
      sm: 640,
      md: 744,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536
    }
  },
  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
    disallow: ["/api/", "/_nuxt/"],
    allow: "/"
  },
  schemaOrg: {
    identity: {
      type: "Person",
      name: "Marco Guglielmino",
      url: baseUrl
    }
  },
  sitemap: {
    autoLastmod: true,
    defaults: {
      changefreq: "weekly",
      priority: 0.5
    }
  },
  socialShare: {
    baseUrl,
    styled: true
  }
})

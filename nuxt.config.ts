// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxtjs/mdc",
    "@vercel/analytics",
    "nuxt-graphql-client",
    "@nuxt/image",
    "nuxt-svgo-loader"
  ],

  devtools: {
    enabled: true
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en"
      },
      title: "Marco Guglielmino",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Marco Guglielmino's personal website"
        }
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        {
          rel: "preload",
          as: "image",
          type: "image/webp",
          href: "https://images.ctfassets.net/5ye49326jqzh/4RWc2Y4nmOdCEazj9fzUmz/c944ce5805fe112c5e66a142b10b45e8/screen.png?fm=webp&q=75&w=1200",
          fetchpriority: "high"
        }
      ]
    }
  },
  css: ["~/assets/css/main.css"],
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
    instagram: {
      userId: "", // page id
      token: "" // System User Token
    }
  },

  routeRules: {
    "/": { prerender: true },
    "/en/": { prerender: true }
  },

  sourcemap: {
    server: true,
    client: true
  },
  compatibilityDate: "2026-06-30",

  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https://images.ctfassets.net https://*.tile.openstreetmap.org",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://images.ctfassets.net https://*.tile.openstreetmap.org https://vercel.live https://vitals.vercel-insights.com",
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
      { code: "en",
        name: "English",
        language: "en-GB",
        file: "en.json"
      }
    ],
    defaultLocale: "it",
    trailingSlash: true
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
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536
    }
  }
})

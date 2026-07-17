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
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
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
    stravaClientSecret: "",
    stravaRefreshToken: "",
    stravaClientID: "",
    stravaAccessToken: ""
  },

  routeRules: {
    "/": { prerender: true }
  },
  compatibilityDate: "2026-06-30",

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
    codegen: !process.env.VERCEL,
    clients: {
      default: {
        host: `https://graphql.contentful.com/content/v1/spaces/${process.env.CTF_CDA_SPACE_ID}/environments/master`,
        token: {
          type: "Bearer",
          name: "Authorization",
          value: process.env.CTF_CDA_ACCESS_TOKEN
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
  i18n: {
    strategy: "no_prefix"
  },
  image: {
    provider: process.env.VERCEL_ENV ? "vercel" : "ipx",
    format: ["webp", "jpg"]
  }
})

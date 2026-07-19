export default defineNitroConfig({
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
})

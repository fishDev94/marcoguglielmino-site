// nitro.config.ts
export default defineNitroConfig({
  routeRules: {
    "/**": {
      headers: {
        // Content Security Policy
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://images.ctfassets.net https://*.tile.openstreetmap.org",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' https://images.ctfassets.net https://*.tile.openstreetmap.org https://vercel.live https://vitals.vercel-insights.com",
          "frame-src https://vercel.live",
          "frame-ancestors 'none'"
        ].join("; "),

        // Cross-Origin-Opener-Policy
        "Cross-Origin-Opener-Policy": "same-origin",

        // Clickjacking protection
        "X-Frame-Options": "DENY",

        // Prevent MIME sniffing
        "X-Content-Type-Options": "nosniff",

        // Referrer policy
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    }
  }
})

export default defineEventHandler((event) => {
  // Skip during prerendering (no response headers available)
  if (import.meta.prerender) return

  // Content Security Policy
  setHeader(event, "Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.ctfassets.net https://*.tile.openstreetmap.org",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://images.ctfassets.net https://*.tile.openstreetmap.org https://vercel.live https://vitals.vercel-insights.com",
    "frame-src https://vercel.live",
    "frame-ancestors 'none'"
  ].join("; "))

  // Cross-Origin-Opener-Policy
  setHeader(event, "Cross-Origin-Opener-Policy", "same-origin")

  // Clickjacking protection (redundant with CSP frame-ancestors, but good for older browsers)
  setHeader(event, "X-Frame-Options", "DENY")

  // Prevent MIME sniffing
  setHeader(event, "X-Content-Type-Options", "nosniff")

  // Referrer policy
  setHeader(event, "Referrer-Policy", "strict-origin-when-cross-origin")
})

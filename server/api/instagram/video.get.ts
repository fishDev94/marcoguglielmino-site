// server/api/instagram/video.get.ts
// Proxies Instagram CDN video URLs through our server to avoid IP/geo-lock issues
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string | undefined

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: "Missing 'url' query parameter" })
  }

  // Validate that the URL points to a known Instagram/Facebook CDN
  const allowedHosts = [
    "cdninstagram.com",
    "fbcdn.net"
  ]

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid URL" })
  }

  const isAllowed = allowedHosts.some(host => parsedUrl.hostname.endsWith(host))
  if (!isAllowed) {
    throw createError({ statusCode: 403, statusMessage: "URL not allowed" })
  }

  // Fetch the video from Instagram CDN server-side
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NuxtProxy/1.0)"
    }
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `Instagram CDN returned ${response.status}`
    })
  }

  // Forward content type and cache headers
  const contentType = response.headers.get("content-type") || "video/mp4"
  const contentLength = response.headers.get("content-length")

  setResponseHeaders(event, {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
    ...(contentLength && { "Content-Length": contentLength })
  })

  // Stream the response body
  return response.body
})

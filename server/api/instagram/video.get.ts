// server/api/instagram/video.get.ts
// Fetches a fresh media_url from the Graph API for a given reel ID,
// then streams the video to the client. This ensures the CDN URL is
// signed for the SAME IP that will download it (this serverless instance).
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const mediaId = query.id as string | undefined

  if (!mediaId) {
    throw createError({ statusCode: 400, statusMessage: "Missing 'id' query parameter" })
  }

  // Validate: Instagram media IDs are numeric strings
  if (!/^\d+$/.test(mediaId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid media ID format" })
  }

  const config = useRuntimeConfig()
  const TOKEN = config.instagram.token

  if (!TOKEN) {
    throw createError({ statusCode: 500, statusMessage: "Missing Instagram token" })
  }

  // 1. Get a fresh media_url from the Graph API (signed for THIS server's IP)
  const mediaData = await $fetch<{ media_url: string, id: string }>(
    `https://graph.facebook.com/v25.0/${mediaId}`,
    {
      query: {
        fields: "media_url",
        access_token: TOKEN
      }
    }
  ).catch((err) => {
    throw createError({
      statusCode: 502,
      statusMessage: `Graph API error: ${err?.data?.error?.message || err.message || "Unknown"}`
    })
  })

  if (!mediaData?.media_url) {
    throw createError({ statusCode: 404, statusMessage: "No media_url returned for this ID" })
  }

  // 2. Immediately fetch the video from the CDN (same IP that just got the URL)
  const response = await fetch(mediaData.media_url, {
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

  // 3. Stream back to client
  const contentType = response.headers.get("content-type") || "video/mp4"
  const contentLength = response.headers.get("content-length")

  setResponseHeaders(event, {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
    ...(contentLength && { "Content-Length": contentLength })
  })

  return response.body
})

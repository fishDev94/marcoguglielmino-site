import type { InstagramReel } from "@@/types/instagram"
// server/api/instagram/reels.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const query = getQuery(event)
  const limit = query.itemCount ? Number.parseInt(query.itemCount as string, 10) : 6

  const IG_USER_ID = config.instagram.userId
  const TOKEN = config.instagram.token

  if (!IG_USER_ID || !TOKEN) {
    throw new Error("Missing Instagram credentials")
  }

  // 1. Chiamata ai media IG
  const res = await $fetch<{ data: InstagramReel[] }>(`https://graph.facebook.com/v25.0/${IG_USER_ID}/media`, {
    query: {
      fields: "id,media_type,media_product_type,media_url,thumbnail_url,caption,permalink,timestamp",
      access_token: TOKEN
    }
  })

  // 2. Filtra solo i Reel
  const reels = res.data.filter(
    m => m.media_product_type === "REELS"
  ).slice(0, limit)

  return reels
})

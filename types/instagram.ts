export interface InstagramReel {
  id: string
  media_type: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM"
  media_product_type: "REELS" | "FEED" | "STORY" | "AD"
  media_url: string
  thumbnail_url?: string
  caption?: string
  permalink: string
  timestamp: string
}

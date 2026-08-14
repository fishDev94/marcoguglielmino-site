/**
 * Formats seconds into mm:ss string
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || Number.isNaN(seconds)) return "00:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

/**
 * Returns a human-friendly relative time string using i18n translations.
 * Pass the `$t` function from the component context.
 */
export const formatTimeAgo = (dateString: string, t: (key: string, count?: number) => string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return t("time_ago.just_now")
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t("time_ago.minutes", minutes)
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t("time_ago.hours", hours)
  const days = Math.floor(hours / 24)
  if (days < 30) return t("time_ago.days", days)
  const months = Math.floor(days / 30)
  if (months < 12) return t("time_ago.months", months)
  const years = Math.floor(days / 365)
  return t("time_ago.years", years)
}

/**
 * Returns the video source URL for a reel.
 * Priority: CDN URL (video_src) > proxy endpoint (fallback).
 */
export const proxyVideoUrl = (reelId: string, videoSrc?: string): string => {
  if (videoSrc) {
    return videoSrc
  }
  // Fallback: proxy endpoint (for reels not yet uploaded to CDN)
  return `/api/instagram/video?id=${encodeURIComponent(reelId)}`
}

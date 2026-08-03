import { Redis } from "@upstash/redis"

export default defineEventHandler(async (event) => {
  const queryString = (event.path || "").split("?")[1] || ""
  const query = Object.fromEntries(new URLSearchParams(queryString))

  const redis = Redis.fromEnv()
  const cacheKey = `strava_activities_${query.per_page || 30}_${query.page || 1}`

  try {
    const accessToken = await getStravaAccessToken()
    const activities = await fetchStravaActivities(accessToken, query)

    // Cache successful response in Redis (15 min TTL)
    await redis.set(cacheKey, JSON.stringify(activities), { ex: 900 })

    return activities
  } catch (err: unknown) {
    const status = (err as { status?: number, statusCode?: number })?.status
      || (err as { status?: number, statusCode?: number })?.statusCode

    // If rate limited (429), serve cached data
    if (status === 429) {
      const cached = await redis.get<string>(cacheKey)

      if (cached) {
        setResponseHeader(event, "X-Data-Source", "cache-stale")
        return typeof cached === "string" ? JSON.parse(cached) : cached
      }

      // No cache available — return empty array instead of crashing
      setResponseHeader(event, "X-Data-Source", "rate-limited")
      return []
    }

    throw err
  }
})

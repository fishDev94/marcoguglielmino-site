import { Redis } from "@upstash/redis"

export default defineEventHandler(async (event) => {
  const activityId = getRouterParam(event, "id")
  const redis = Redis.fromEnv()
  const cacheKey = `strava_activity_${activityId}`

  try {
    const accessToken = await getStravaAccessToken()
    const activity = await fetchStravaActivityById(accessToken, activityId)

    // Cache successful response in Redis (1 hour TTL — single activities don't change)
    await redis.set(cacheKey, JSON.stringify(activity), { ex: 3600 })

    return activity
  } catch (err: unknown) {
    const status = (err as { status?: number, statusCode?: number })?.status
      || (err as { status?: number, statusCode?: number })?.statusCode

    if (status === 429) {
      const cached = await redis.get<string>(cacheKey)

      if (cached) {
        setResponseHeader(event, "X-Data-Source", "cache-stale")
        return typeof cached === "string" ? JSON.parse(cached) : cached
      }

      throw createError({
        statusCode: 429,
        statusMessage: "Strava rate limit reached. Try again in 15 minutes."
      })
    }

    throw err
  }
})

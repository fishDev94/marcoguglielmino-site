import { Redis } from "@upstash/redis"
import type { StravaActivitiesPage, StravaActivitySummary } from "@@/types/strava"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(200, Math.max(1, Number(query.per_page) || 30))

  const redis = Redis.fromEnv()
  const cacheKey = `strava_activities_${perPage}_${page}`

  try {
    const accessToken = await getStravaAccessToken()
    const activities = await fetchStravaActivities(accessToken, {
      page,
      per_page: perPage
    })

    let hasNextPage = false

    if (activities.length === perPage) {
      const probe = await fetchStravaActivities(accessToken, {
        page: page + 1,
        per_page: 1
      })
      hasNextPage = probe.length > 0
    }

    const response: StravaActivitiesPage<StravaActivitySummary> = {
      items: activities,
      page,
      perPage,
      hasNextPage
    }

    // Cache successful response in Redis (15 min TTL)
    await redis.set(cacheKey, JSON.stringify(response), { ex: 900 })

    return response
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

      // No cache available — return empty response envelope instead of crashing
      setResponseHeader(event, "X-Data-Source", "rate-limited")
      return {
        items: [],
        page,
        perPage,
        hasNextPage: false
      } satisfies StravaActivitiesPage<StravaActivitySummary>
    }

    throw err
  }
})

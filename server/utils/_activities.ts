import type {
  StravaActivitySummary,
  StravaActivityDetail,
  StravaTokenResponse
} from "@@/types/strava"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function getStravaAccessToken() {
  const { stravaClientID, stravaClientSecret, stravaRefreshToken } = useRuntimeConfig()

  // Check if we have a cached access token
  try {
    const cachedToken = await redis.get<string>("strava_access_token")
    if (cachedToken) {
      return cachedToken
    }
  } catch (redisErr) {
    console.error("[Strava] Redis read failed for cached token, proceeding with refresh:", redisErr)
  }

  // No cached token — refresh it
  let refreshToken: string | null = null

  try {
    refreshToken = await redis.get<string>("strava_refresh_token")
  } catch (redisErr) {
    console.error("[Strava] Redis read failed for refresh token, using env fallback:", redisErr)
  }

  if (!refreshToken) {
    refreshToken = stravaRefreshToken
    try {
      await redis.set("strava_refresh_token", refreshToken)
    } catch (redisErr) {
      console.error("[Strava] Redis write failed for refresh token:", redisErr)
    }
  }

  let tokenRes: StravaTokenResponse

  try {
    tokenRes = await $fetch<StravaTokenResponse>(
      "https://www.strava.com/oauth/token",
      {
        method: "POST",
        body: {
          client_id: stravaClientID,
          client_secret: stravaClientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken
        }
      }
    )
  } catch (fetchErr) {
    console.error("[Strava] Token refresh failed:", fetchErr)
    throw createError({
      statusCode: 503,
      statusMessage: "Strava authentication failed. Unable to refresh access token."
    })
  }

  const accessToken = tokenRes.access_token
  const newRefreshToken = tokenRes.refresh_token

  // Cache access token for 50 minutes (Strava tokens last 6 hours)
  try {
    await redis.set("strava_access_token", accessToken, { ex: 3000 })

    // Update refresh token if rotated
    if (newRefreshToken && newRefreshToken !== refreshToken) {
      await redis.set("strava_refresh_token", newRefreshToken)
    }
  } catch (redisErr) {
    console.error("[Strava] Redis write failed for tokens (non-blocking):", redisErr)
  }

  return accessToken
}

export async function fetchStravaActivities(
  accessToken: string,
  query?: { page?: number, per_page?: number }
) {
  return await $fetch<StravaActivitySummary[]>(
    "https://www.strava.com/api/v3/athlete/activities",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      query: {
        page: query?.page || 1,
        per_page: query?.per_page || 30
      }
    }
  )
}

export async function fetchStravaActivityById(
  accessToken: string,
  activityId?: string
) {
  return await $fetch<StravaActivityDetail>(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}

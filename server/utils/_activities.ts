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
  const cachedToken = await redis.get<string>("strava_access_token")
  if (cachedToken) {
    return cachedToken
  }

  // No cached token — refresh it
  let refreshToken = await redis.get<string>("strava_refresh_token")

  if (!refreshToken) {
    refreshToken = stravaRefreshToken
    await redis.set("strava_refresh_token", refreshToken)
  }

  const tokenRes = await $fetch<StravaTokenResponse>(
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

  const accessToken = tokenRes.access_token
  const newRefreshToken = tokenRes.refresh_token

  // Cache access token for 50 minutes (Strava tokens last 6 hours)
  await redis.set("strava_access_token", accessToken, { ex: 3000 })

  // Update refresh token if rotated
  if (newRefreshToken && newRefreshToken !== refreshToken) {
    await redis.set("strava_refresh_token", newRefreshToken)
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

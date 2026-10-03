import type {
  StravaActivitySummary,
  StravaActivityDetail,
  StravaTokenResponse
} from "@@/types/strava"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()
const refreshLockKey = "strava_token_refresh_lock"
const refreshLockTtl = 30
const refreshWaitAttempts = 30

const getErrorStatus = (error: unknown) => {
  const fetchError = error as { status?: number, statusCode?: number }
  return fetchError.status || fetchError.statusCode
}

const delay = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds))

let tokenRefreshPromise: Promise<string> | null = null

export async function getStravaAccessToken(rejectedToken?: string) {
  const { stravaClientID, stravaClientSecret, stravaRefreshToken } = useRuntimeConfig()

  try {
    const cachedToken = await redis.get<string>("strava_access_token")
    if (cachedToken && cachedToken !== rejectedToken) {
      return cachedToken
    }
  } catch (redisErr) {
    console.error("[Strava] Redis read failed for cached token, proceeding with refresh:", redisErr)
  }

  if (tokenRefreshPromise) {
    return await tokenRefreshPromise
  }

  tokenRefreshPromise = (async () => {
    const lockId = crypto.randomUUID()
    let hasLock = false

    try {
      hasLock = await redis.set(refreshLockKey, lockId, {
        nx: true,
        ex: refreshLockTtl
      }) === "OK"
    } catch (redisErr) {
      console.error("[Strava] Redis lock failed, proceeding with local refresh coordination:", redisErr)
    }

    if (!hasLock) {
      for (let attempt = 0; attempt < refreshWaitAttempts; attempt++) {
        await delay(100)

        try {
          const cachedToken = await redis.get<string>("strava_access_token")
          if (cachedToken && cachedToken !== rejectedToken) {
            return cachedToken
          }

          hasLock = await redis.set(refreshLockKey, lockId, {
            nx: true,
            ex: refreshLockTtl
          }) === "OK"
          if (hasLock) break
        } catch (redisErr) {
          console.error("[Strava] Redis refresh wait failed:", redisErr)
          break
        }
      }

      if (!hasLock) {
        throw createError({
          statusCode: 503,
          statusMessage: "Strava token refresh is already in progress."
        })
      }
    }

    try {
      const cachedToken = await redis.get<string>("strava_access_token").catch(() => null)
      if (cachedToken && cachedToken !== rejectedToken) {
        return cachedToken
      }

      let refreshToken: string | null = null

      try {
        refreshToken = await redis.get<string>("strava_refresh_token")
      } catch (redisErr) {
        console.error("[Strava] Redis read failed for refresh token, using env fallback:", redisErr)
      }

      if (!refreshToken) {
        refreshToken = stravaRefreshToken
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

      if (tokenRes.refresh_token && tokenRes.refresh_token !== refreshToken) {
        try {
          await redis.set("strava_refresh_token", tokenRes.refresh_token)
        } catch (redisErr) {
          console.error("[Strava] Failed to persist rotated refresh token:", redisErr)
          throw createError({
            statusCode: 503,
            statusMessage: "Strava authentication failed. Unable to persist refresh token."
          })
        }
      }

      try {
        await redis.set("strava_access_token", tokenRes.access_token, { ex: 3000 })
      } catch (redisErr) {
        console.error("[Strava] Redis write failed for access token:", redisErr)
      }

      return tokenRes.access_token
    } finally {
      if (hasLock) {
        try {
          await redis.eval(
            "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
            [refreshLockKey],
            [lockId]
          )
        } catch (redisErr) {
          console.error("[Strava] Redis lock release failed:", redisErr)
        }
      }
    }
  })()

  try {
    return await tokenRefreshPromise
  } finally {
    tokenRefreshPromise = null
  }
}

async function fetchWithTokenRefresh<T>(fetcher: (accessToken: string) => Promise<T>) {
  let accessToken = await getStravaAccessToken()

  try {
    return await fetcher(accessToken)
  } catch (error) {
    if (getErrorStatus(error) !== 401) {
      throw error
    }

    accessToken = await getStravaAccessToken(accessToken)

    try {
      return await fetcher(accessToken)
    } catch (retryError) {
      if (getErrorStatus(retryError) === 401) {
        const fetchError = retryError as { data?: unknown, message?: string }
        console.error("[Strava] API still returned 401 after token refresh:", {
          message: fetchError.message,
          data: fetchError.data
        })
      }

      throw retryError
    }
  }
}

export async function fetchStravaActivities(
  query?: { page?: number, per_page?: number }
) {
  return await fetchWithTokenRefresh(accessToken => $fetch<StravaActivitySummary[]>(
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
  ))
}

export async function fetchStravaActivityById(
  activityId?: string
) {
  return await fetchWithTokenRefresh(accessToken => $fetch<StravaActivityDetail>(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  ))
}

import type { NuxtError } from "#app"
import type { StravaActivity } from "~~/types/strava"

const getActivities = <T extends StravaActivity>(query?: { page?: number, per_page?: number }) => {
  const { data, pending, error } = useFetch("/api/activities/", {
    lazy: true,
    query: {
      page: query?.page,
      per_page: query?.per_page
    },
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  return { data, pending, error } as {
    data: Ref<T[]>
    pending: Ref<boolean>
    error: Ref<NuxtError<unknown>>
  }
}

const getActivity = <T extends StravaActivity>(activityId: string) => {
  const { data, pending, error } = useFetch(`/api/activities/${activityId}`, {
    lazy: true,
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  watch(
    error,
    (err) => {
      if (err) {
        showError(
          createError({
            statusCode: err.status || 500,
            statusMessage: err.statusText || "Fetch error",
            message: err.message
          })
        )
      }
    }
  )

  return { data, pending, error } as {
    data: Ref<T>
    pending: Ref<boolean>
    error: Ref<NuxtError<unknown>>
  }
}

export const useStravaActivities = () => {
  return { getActivities, getActivity }
}

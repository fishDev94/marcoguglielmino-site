import type { NuxtError } from "#app"
import type { StravaActivitiesPage, StravaActivity } from "~~/types/strava"

type StravaActivitiesQuery = {
  page?: number | Ref<number>
  per_page?: number | Ref<number>
}

const getActivities = <T extends StravaActivity>(query?: StravaActivitiesQuery) => {
  const { data, pending, error } = useFetch<StravaActivitiesPage<T>>("/api/activities/", {
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
    data: Ref<StravaActivitiesPage<T> | null>
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

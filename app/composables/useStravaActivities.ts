import type { NuxtError } from "#app"
import type { StravaActivitiesPage, StravaActivity } from "~~/types/strava"
import { PAGE_SIZE } from "~/constants"

type StravaActivitiesQuery = {
  page?: number | Ref<number>
  per_page?: number | Ref<number>
}

const getActivities = <T extends StravaActivity>(query?: StravaActivitiesQuery) => {
  const pageValue = computed(() => unref(query?.page ?? 1))
  const perPageValue = computed(() => unref(query?.per_page ?? PAGE_SIZE))

  const data = ref<StravaActivitiesPage<T> | null>(null)
  const pending = ref(false)
  const error = ref<NuxtError<unknown> | null>(null)

  const execute = async (page?: number) => {
    pending.value = true
    error.value = null

    try {
      const response = await $fetch<StravaActivitiesPage<T>>("/api/activities/", {
        query: {
          page: page ?? pageValue.value,
          per_page: perPageValue.value
        }
      })

      data.value = response
    } catch (err) {
      error.value = err as NuxtError<unknown>
    } finally {
      pending.value = false
    }
  }

  return { data, pending, error, execute } as {
    data: Ref<StravaActivitiesPage<T> | null>
    pending: Ref<boolean>
    error: Ref<NuxtError<unknown> | null>
    execute: (page?: number) => Promise<void>
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

const getActivities = (query?: { page?: number, per_page?: number }) => {
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

  watch(
    error,
    (err) => {
      if (err) {
        showError(
          createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Fetch error",
            message: err.message
          })
        )
      }
    },
    { immediate: true }
  )

  return { data, pending, error }
}

const getActivity = (activityId: string) => {
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
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Fetch error",
            message: err.message
          })
        )
      }
    },
    { immediate: true }
  )

  return { data, pending, error }
}

export const useStravaActivities = () => {
  return { getActivities, getActivity }
}

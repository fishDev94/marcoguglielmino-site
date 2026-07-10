const getActivities = async () => {
  const { data, pending, error } = await useFetch("/api/activities/", {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  if (error.value) {
    showError(createError({
      statusCode: error.value.statusCode || 500,
      statusMessage: error.value.statusMessage || "Fetch error",
      message: error.value.message
    }))
  }

  return { data, pending, error }
}

const getActivity = async (activityId: string) => {
  const { data, pending, error } = await useFetch(`/api/activities/${activityId}`, {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  if (error.value) {
    showError(createError({
      statusCode: error.value.statusCode || 500,
      statusMessage: error.value.statusMessage || "Fetch error",
      message: error.value.message
    }))
  }

  return { data, pending, error }
}

export const useStravaActivities = () => {
  return { getActivities, getActivity }
}

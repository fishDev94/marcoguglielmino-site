const getActivities = async () => {
  const { data, pending, error } = await useFetch("/api/activities/", {
    onRequestError({ error: reqError }) {
      console.error("Request error:", reqError)
    },
    onResponseError({ response }) {
      console.error("Response error:", response)
    },
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  return { data, pending, error }
}

const getActivity = async (activityId: string) => {
  const { data, pending, error } = await useFetch(`/api/activities/${activityId}`, {
    onRequestError({ error: reqError }) {
      console.error("Request error:", reqError)
    },
    onResponseError({ response }) {
      console.error("Response error:", response)
    },
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  return { data, pending, error }
}

export const useStravaActivities = () => {
  return { getActivities, getActivity }
}

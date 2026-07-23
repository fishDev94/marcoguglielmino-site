export const useAsyncBlogPostData = async (slug: string) => {
  const { data, pending, error } = await useAsyncGql({
    operation: "blogPost",
    variables: {
      locale: useCurrentLang(),
      slug
    },
    options: {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  })

  watch(
    error,
    (err) => {
      if (err) {
        showError(
          createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.operationType || "Fetch error",
            message: err.operationName
          })
        )
      }
    },
    { immediate: true }
  )

  const blogPostData = computed(() => {
    if (!data.value.blogPostCollection?.items[0]) {
      showError(
        createError({
          statusCode: 404,
          statusMessage: "No resources",
          message: `There is not resources with this slug: ${slug}`
        })
      )

      return {}
    }

    return data.value.blogPostCollection.items[0]
  })
  const galleryData = computed(() => blogPostData.value.gallery?.items || [])
  const bodyDescription = computed(() => blogPostData.value.bodyDescription)
  const equipmentCollection = computed(() => blogPostData.value.equipment?.items || [])
  const performance = computed(() => blogPostData.value.performance as PerformanceEntry)

  return {
    blogPostData,
    isLoading: pending,
    galleryData,
    bodyDescription,
    equipmentCollection,
    performance,
    error
  }
}

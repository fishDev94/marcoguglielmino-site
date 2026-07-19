import type { FooterDataFragment } from "#gql"

export const useAsyncFooterData = async () => {
  const { data, pending, error } = await useAsyncGql({
    operation: "footer",
    variables: {
      locale: useCurrentLang()
    },
    options: {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  })

  const footerData = computed(() => data.value?.footerCollection?.items[0] as FooterDataFragment | undefined)
  const internalLinks = computed(() => footerData.value?.navigationLinks?.items)
  const externalLinks = computed(() => footerData.value?.socialLinks?.items)

  return {
    footerData,
    isLoading: pending,
    isError: error,
    internalLinks,
    externalLinks
  }
}

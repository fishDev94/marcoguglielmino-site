import type { FooterDataFragment } from "#gql"

export const useAsyncFooterData = async () => {
  const { locale } = useI18n()
  const variables = computed(() => ({ locale: locale.value || "it" }))

  const { data, pending, error } = await useAsyncData(
    () => `footer:${variables.value.locale}`,
    () => GqlFooter(variables.value),
    {
      watch: [variables],
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  )

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

import type { AboutCardFragment, ContentBlockFragment } from "#gql"

export const useAsyncHomepageData = async () => {
  const { data } = await useAsyncGql({
    operation: "homepage",
    variables: { slug: "homepage" },
    options: {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  })

  const homepageData = computed(() => {
    return getHomePageData(data.value)
  })

  const contentBlocks = computed<ContentBlockFragment[]>(() => {
    return homepageData.value?.bodyContent?.items as ContentBlockFragment[]
  })

  const aboutCardList = computed(() => {
    return homepageData.value.bodyContent?.items[0]?.cards?.items as Array<{ type: "light" | "dark" } & AboutCardFragment>
  })

  return {
    homepageData,
    contentBlocks,
    aboutCardList
  }
}

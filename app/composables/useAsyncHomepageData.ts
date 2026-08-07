import type { AboutCardDataFragment, ContentBlockDataFragment, CtaButtonDataFragment, HomepageDataFragment } from "#gql"

export const useAsyncHomepageData = async () => {
  const { data, error } = await useAsyncGql({
    operation: "homepage",
    variables: { slug: "homepage", locale: useCurrentLang() },
    options: {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  })

  if (error.value) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch homepage data",
      fatal: true
    })
  }

  const homepageData = computed(() => {
    return data?.value.homepageCollection?.items[0] as HomepageDataFragment
  })

  const contentBlocks = computed<ContentBlockDataFragment[]>(() => {
    return homepageData.value?.bodyContent?.items as ContentBlockDataFragment[]
  })

  const bottomContentBlocks = computed(() => {
    return homepageData.value?.bottomContent?.items as ContentBlockDataFragment[]
  })

  const aboutCardList = computed(() => {
    return homepageData.value.bodyContent?.items[0]?.cards?.items as Array<{ type: "light" | "dark" } & AboutCardDataFragment>
  })

  const ctaButtons = computed(() => homepageData.value.ctaButton?.items as CtaButtonDataFragment[])

  return {
    homepageData,
    contentBlocks,
    bottomContentBlocks,
    aboutCardList,
    ctaButtons
  }
}

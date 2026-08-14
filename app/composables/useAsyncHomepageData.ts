import type { AboutCardDataFragment, ContentBlockDataFragment, CtaButtonDataFragment, HomepageDataFragment } from "#gql"

const logHomepageDataError = (error: unknown) => {
  if (!import.meta.server) return

  const requestError = error as {
    message?: string
    name?: string
    status?: number
    statusCode?: number
  }

  console.error("[homepage-data] Contentful query failed", {
    name: requestError.name,
    message: requestError.message,
    status: requestError.status || requestError.statusCode,
    vercelEnvironment: process.env.VERCEL_ENV,
    vercelDeployment: process.env.VERCEL_URL
  })
}

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
    logHomepageDataError(error.value)
  }

  const homepageData = computed(() => {
    return data.value?.homepageCollection?.items[0] as HomepageDataFragment | undefined
  })

  const contentBlocks = computed<ContentBlockDataFragment[]>(() => {
    return (homepageData.value?.bodyContent?.items || []) as ContentBlockDataFragment[]
  })

  const bottomContentBlocks = computed(() => {
    return (homepageData.value?.bottomContent?.items || []) as ContentBlockDataFragment[]
  })

  const aboutCardList = computed(() => {
    return (homepageData.value?.bodyContent?.items[0]?.cards?.items || []) as Array<{ type: "light" | "dark" } & AboutCardDataFragment>
  })

  const ctaButtons = computed(() => (homepageData.value?.ctaButton?.items || []) as CtaButtonDataFragment[])

  return {
    homepageData,
    contentBlocks,
    bottomContentBlocks,
    aboutCardList,
    ctaButtons
  }
}

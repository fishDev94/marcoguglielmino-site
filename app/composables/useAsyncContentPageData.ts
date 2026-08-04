import type { ContentPageDataFragment } from "#gql"

export default async function useAsyncContentPageData() {
  const route = useRoute()
  const routeBaseName = useRouteBaseName()

  const baseRouteName = computed(() => routeBaseName(route))
  const lang = useCurrentLang()

  const { data } = await useAsyncGql({
    operation: "page",
    variables: {
      slug: String(baseRouteName.value) || "",
      locale: lang
    }
  })

  const pageData = computed(
    () => data.value?.pageCollection?.items?.[0] as ContentPageDataFragment
  )

  const seoData = computed(() => {
    return {
      title: pageData.value?.seoTitle || "",
      description: pageData.value?.seoDescription || "",
      ogImage: {
        url: pageData.value?.ogImage?.url || "",
        title: pageData.value?.ogImage?.title || "",
        width: pageData.value?.ogImage?.width || 0,
        height: pageData.value?.ogImage?.height || 0
      },
      noIndex: pageData.value?.noIndex || false
    }
  })

  const richTextField = computed(
    () => pageData.value?.bodyContent?.json || null
  )

  return {
    pageData,
    seoData,
    richTextField
  }
}

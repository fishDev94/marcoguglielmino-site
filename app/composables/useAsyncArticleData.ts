import type {
  EquipmentItemDataFragment,
  PerformanceCardDataFragment
} from "#gql"
import type { LightboxImage } from "@@/types/image-viewer"
import type { PaginatorItem } from "~/components/Article/Paginator.vue"
import type { BodyDescriptionType } from "~~/types/contentful"

export const useAsyncArticleData = async (slug: string) => {
  const lang = useCurrentLang()
  const { articles } = useArticlesData()

  const { data, pending, error } = await useAsyncGql({
    operation: "blogPost",
    variables: {
      locale: lang,
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

  const article = computed(() => {
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
  const galleryData = computed<LightboxImage[]>(() => {
    const items = article.value.gallery?.items || []

    return items.map((item) => {
      return {
        id: item?.title || "",
        title: item?.title || "",
        url: item?.url || ""
      }
    })
  })
  const bodyDescription = computed(
    () => article.value.bodyDescription as BodyDescriptionType
  )
  const equipmentCollection = computed(
    () => article.value.equipment?.items as EquipmentItemDataFragment[]
  )
  const performance = computed(
    () => article.value.performance as PerformanceCardDataFragment
  )
  const navigation = computed<{
    prev: PaginatorItem | null
    next: PaginatorItem | null
  }>(() => {
    const items = articles.value || []

    const currentIndex = items.findIndex(item => item?.slug === slug)

    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    const prevItem = items[currentIndex + 1]
    const nextItem = items[currentIndex - 1]

    return {
      prev:
        prevItem?.title && prevItem?.slug
          ? { title: prevItem.title, slug: prevItem.slug }
          : null,
      next:
        nextItem?.title && nextItem?.slug
          ? { title: nextItem.title, slug: nextItem.slug }
          : null
    }
  })

  const seoUtilities = () => {
    const title = computed(
      () => article.value.seoTitle || article.value.title || ""
    )
    const description = computed(() => article.value.seoDescription || "")
    const coverImageUrl = computed(() => article.value.coverImage?.url || "")
    const coverImageAlt = computed(
      () =>
        article.value.coverImage?.description
        || article.value.coverImage?.title
        || title.value
    )
    const coverImageWidth = computed(
      () => article.value.coverImage?.width || 1200
    )
    const coverImageHeight = computed(
      () => article.value.coverImage?.height || 630
    )
    const meta = computed(() => {
      const tagValues = article.value?.tags?.items
        ?.map(tag => tag?.tagValue)
        ?.filter(Boolean)
        .join(", ")

      return tagValues
        ? [{ name: "keywords", content: tagValues }]
        : []
    }
    )

    return {
      title,
      description,
      coverImageUrl,
      coverImageAlt,
      coverImageHeight,
      coverImageWidth,
      meta
    }
  }

  return {
    article,
    isLoading: pending,
    galleryData,
    bodyDescription,
    equipmentCollection,
    performance,
    navigation,
    error,
    seoUtilities
  }
}

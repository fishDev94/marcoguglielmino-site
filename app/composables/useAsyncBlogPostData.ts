import type {
  BlogPostDataFragment,
  EquipmentItemDataFragment,
  PerformanceCardDataFragment
} from "#gql"
import type { AssetBlock, EntryBlock } from "~~/types/contentful"
import type { LightboxImage } from "@@/types/image-viewer"

type BodyDescriptionType = {
  links?: {
    assets?: {
      block?: AssetBlock[]
    }
    entries?: {
      block?: EntryBlock[]
    }
  } | null
} & BlogPostDataFragment["bodyDescription"]

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
  const galleryData = computed<LightboxImage[]>(() => {
    const items = blogPostData.value.gallery?.items || []

    return items.map((item) => {
      return {
        id: item?.title || "",
        title: item?.title || "",
        url: item?.url || ""
      }
    })
  })
  const bodyDescription = computed(
    () =>
      blogPostData.value.bodyDescription as BodyDescriptionType
  )
  const equipmentCollection = computed(
    () => blogPostData.value.equipment?.items as EquipmentItemDataFragment[]
  )
  const performance = computed(
    () => blogPostData.value.performance as PerformanceCardDataFragment
  )

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

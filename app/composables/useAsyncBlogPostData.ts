import type {
  BlogPostDataFragment,
  EquipmentItemDataFragment,
  PerformanceCardDataFragment
} from "#gql"
import type { AssetBlock, EntryBlock } from "~~/types/contentful"
import type { LightboxImage } from "@@/types/image-viewer"
import type { PaginatorItem } from "~/components/Article/Paginator.vue"

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
  const lang = useCurrentLang()

  const [{ data, pending, error }, { data: allPostsData }] = await Promise.all([
    useAsyncGql({
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
    }),
    useAsyncGql({
      operation: "blogPosts",
      variables: {
        locale: lang
      }
    })
  ])

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
  // Navigation Paginator Data (Mock temporaneo in attesa di GraphQL)
  const navigation = computed<{ prev: PaginatorItem | null, next: PaginatorItem | null }>(() => {
    const items = allPostsData.value?.blogPostCollection?.items || []

    // Troviamo la posizione del post attuale nell'elenco
    const currentIndex = items.findIndex(item => item?.slug === slug)

    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    // Post Precedente (il post cronologicamente precedente nella lista, es. i + 1 se ordinati dal più recente)
    const prevItem = items[currentIndex + 1]

    // Post Successivo (il post cronologicamente successivo, es. i - 1)
    const nextItem = items[currentIndex - 1]

    return {
      prev: prevItem?.title && prevItem?.slug ? { title: prevItem.title, slug: prevItem.slug } : null,
      next: nextItem?.title && nextItem?.slug ? { title: nextItem.title, slug: nextItem.slug } : null
    }
  })

  return {
    blogPostData,
    isLoading: pending,
    galleryData,
    bodyDescription,
    equipmentCollection,
    performance,
    navigation,
    error
  }
}

import type { BlogCardFragment } from "#gql"

interface UseArticlesDataOptions {
  searchQuery?: Ref<string> | ComputedRef<string>
  filters?: Ref<string[] | null> | ComputedRef<string[] | null>
  limit?: Ref<number> | ComputedRef<number>
  skip?: Ref<number> | ComputedRef<number>
}

export const useArticlesData = (options: UseArticlesDataOptions = {}) => {
  const lang = useCurrentLang()

  const searchValue = options.searchQuery ?? ref("")
  const filters = options.filters ?? ref(null)
  const limit = options.limit ?? ref(100)
  const skip = options.skip ?? ref(0)

  const { data, pending, error } = useAsyncGql({
    operation: "blogPosts",
    variables: {
      locale: lang,
      searchValue,
      filters,
      limit,
      skip
    },
    options: {
      watch: [searchValue, filters, limit, skip]
    }
  })

  const articles = computed(
    () => data.value?.blogPostCollection?.items as BlogCardFragment[] | undefined
  )
  const total = computed(() => data.value?.blogPostCollection?.total || 0)

  return {
    articles,
    total,
    isLoading: pending,
    error
  }
}

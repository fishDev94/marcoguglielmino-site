import type { BlogCardFragment } from "#gql"

interface UseArticlesDataOptions {
  searchQuery?: Ref<string> | ComputedRef<string>
  filters?: Ref<string[] | null> | ComputedRef<string[] | null>
  limit?: Ref<number> | ComputedRef<number>
  skip?: Ref<number> | ComputedRef<number>
  server?: boolean
}

export const useArticlesData = (options: UseArticlesDataOptions = {}) => {
  const lang = useCurrentLang()

  const searchValue = options.searchQuery ?? ref("")
  const filters = options.filters ?? ref(null)
  const limit = options.limit ?? ref(100)
  const skip = options.skip ?? ref(0)
  const server = options.server !== false

  const variables = computed(() => ({
    locale: unref(lang),
    searchValue: unref(searchValue),
    filters: unref(filters),
    limit: unref(limit),
    skip: unref(skip)
  }))

  const route = useRoute()
  const routeName = String(route.name || "default")

  const fetchKey = computed(() => {
    const normalizedFilters = (unref(filters) ?? []).slice().toSorted().join(",")

    return `articles:${routeName}:${unref(lang)}:${String(unref(searchValue)).trim()}:${normalizedFilters}:${unref(limit)}:${unref(skip)}`
  })

  const { data, pending, error } = useAsyncData(
    fetchKey,
    () => GqlBlogPosts(variables.value),
    {
      lazy: true,
      server,
      watch: [variables]
    }
  )

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

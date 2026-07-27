import type { TagDataFragment } from "#gql"

interface UseArticlesDataOptions {
  ignoreQueryParams?: boolean
  search?: string
  filters?: string[]
}

export const useArticlesData = (options: UseArticlesDataOptions = {}) => {
  const {
    ignoreQueryParams = false,
    search: customSearch,
    filters: customFilters
  } = options

  const lang = useCurrentLang()
  const route = useRoute()
  const router = useRouter()

  const limit = ref(100)
  const skip = ref(0)

  const queryFilters = computed(() => {
    if (customFilters?.length) return customFilters
    if (ignoreQueryParams) return null

    const rawQuery = route.query.filters
    if (!rawQuery) return null

    const filtersToArray = String(rawQuery)
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)

    return filtersToArray.length ? filtersToArray : null
  })

  const searchQuery = computed({
    get() {
      if (customSearch !== undefined) return customSearch
      if (ignoreQueryParams) return ""
      return route.query.search ? String(route.query.search) : ""
    },
    set(val) {
      if (!ignoreQueryParams && customSearch === undefined) {
        updateQuery("search", val)
      }
    }
  })

  const isFilterSelected = (filter: TagDataFragment["tagValue"]) => {
    const filterLowCase = filter?.toLowerCase() || ""
    return queryFilters.value?.includes(filterLowCase) ?? false
  }

  const updateQuery = (key: "search" | "filters", value: string | undefined) => {
    if (ignoreQueryParams) return

    const query = { ...route.query }

    if (value) {
      query[key] = value
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete query[key]
    }

    if (query.page) {
      delete query.page
    }

    router.push({ query })
  }

  const { data, pending, error } = useAsyncGql({
    operation: "blogPosts",
    variables: {
      locale: lang,
      searchValue: searchQuery,
      filters: queryFilters,
      limit,
      skip
    }
  })

  const articles = computed(() => data.value?.blogPostCollection?.items)

  const setFilter = (filter: string) => {
    if (ignoreQueryParams || customFilters !== undefined || !filter) return

    const filterLowCase = filter.toLowerCase()

    const queryFiltersArray = (route.query.filters as string || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)

    const isAlreadySelected = queryFiltersArray.includes(filterLowCase)

    const filtersList = isAlreadySelected
      ? queryFiltersArray.filter(filterName => filterName !== filterLowCase)
      : [...queryFiltersArray, filterLowCase]

    const queryValue = filtersList.length ? filtersList.join(",") : undefined

    updateQuery("filters", queryValue)
  }

  return {
    articles,
    isLoading: pending,
    error,
    searchQuery,
    setFilter,
    isFilterSelected
  }
}

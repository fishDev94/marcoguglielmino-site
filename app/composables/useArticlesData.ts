import type { BlogCardFragment, TagDataFragment } from "#gql"

interface UseArticlesDataOptions {
  ignoreQueryParams?: boolean
  search?: string
  filters?: string[]
  pageSize?: number
}

export const useArticlesData = (options: UseArticlesDataOptions = {}) => {
  const {
    ignoreQueryParams = false,
    search: customSearch,
    filters: customFilters,
    pageSize
  } = options

  const lang = useCurrentLang()
  const route = useRoute()
  const router = useRouter()

  const currentPage = computed({
    get() {
      if (!pageSize || ignoreQueryParams) return 1
      const page = Number(route.query.page)
      return page > 0 ? page : 1
    },
    set(val) {
      if (pageSize && !ignoreQueryParams) {
        updateQuery("page", val > 1 ? String(val) : undefined)
      }
    }
  })

  const limit = computed(() => pageSize || 100)
  const skip = computed(() => pageSize ? (currentPage.value - 1) * pageSize : 0)

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

  const updateQuery = (key: "search" | "filters" | "page", value: string | undefined) => {
    if (ignoreQueryParams) return

    const query = { ...route.query }

    if (value) {
      query[key] = value
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete query[key]
    }

    if (key !== "page" && query.page) {
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

  const articles = computed(() => data.value?.blogPostCollection?.items as BlogCardFragment[] | undefined)
  const total = computed(() => data.value?.blogPostCollection?.total || 0)
  const totalPages = computed(() => pageSize ? Math.ceil(total.value / pageSize) : 1)

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
    currentPage,
    totalPages,
    total,
    setFilter,
    isFilterSelected
  }
}

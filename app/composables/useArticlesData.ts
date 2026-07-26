export const useArticlesData = () => {
  const lang = useCurrentLang()
  const route = useRoute()
  const router = useRouter()

  const searchValue = ref("")
  const limit = ref(100)
  const skip = ref(0)

  const queryFilters = computed(() => {
    const rawQuery = route.query.filters

    if (!rawQuery) return null

    const filtersToArray = String(rawQuery)
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)

    return filtersToArray.length ? filtersToArray : null
  })

  const { data, pending, error } = useAsyncGql({
    operation: "blogPosts",
    variables: {
      locale: lang,
      searchValue,
      filters: queryFilters,
      limit,
      skip
    }
  })

  const articles = computed(() => data.value?.blogPostCollection?.items)

  const updateQuery = (key: "search" | "filters", value: string | undefined) => {
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

  const setFilter = (filter: string) => {
    if (!filter) return

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
    setFilter
  }
}

interface UseUrlSearchEngineOptions {
  pageSize?: number
  syncWithUrl?: boolean
}

export const useUrlSearchEngine = (options: UseUrlSearchEngineOptions = {}) => {
  const { pageSize, syncWithUrl = true } = options

  const route = useRoute()
  const router = useRouter()

  const updateQuery = (key: string, value: string | undefined) => {
    if (!syncWithUrl) return

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

  // --- Search ---
  const searchQuery = computed({
    get() {
      if (!syncWithUrl) return ""
      return route.query.search ? String(route.query.search) : ""
    },
    set(val) {
      updateQuery("search", val || undefined)
    }
  })

  // --- Filters ---
  const activeFilters = computed<string[]>(() => {
    if (!syncWithUrl) return []
    const raw = route.query.filters
    if (!raw) return []
    return String(raw).split(",").map(s => s.trim()).filter(Boolean)
  })

  const isFilterSelected = (filter: string | null | undefined) => {
    return activeFilters.value.includes(filter?.toLowerCase() || "")
  }

  const toggleFilter = (filter: string) => {
    if (!syncWithUrl || !filter) return

    const filterLowCase = filter.toLowerCase()
    const current = [...activeFilters.value]
    const index = current.indexOf(filterLowCase)

    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(filterLowCase)
    }

    updateQuery("filters", current.length ? current.join(",") : undefined)
  }

  // --- Pagination ---
  const currentPage = computed({
    get() {
      if (!pageSize || !syncWithUrl) return 1
      const page = Number(route.query.page)
      return page > 0 ? page : 1
    },
    set(val) {
      if (pageSize) {
        updateQuery("page", val > 1 ? String(val) : undefined)
      }
    }
  })

  const limit = computed(() => pageSize || 100)
  const skip = computed(() => pageSize ? (currentPage.value - 1) * pageSize : 0)

  return {
    searchQuery,
    activeFilters,
    isFilterSelected,
    toggleFilter,
    currentPage,
    limit,
    skip
  }
}

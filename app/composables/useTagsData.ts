export const useTagsData = () => {
  const { data } = useAsyncGql({
    operation: "tags"
  })

  const tags = computed(() => data.value?.tagCollection?.items ?? [])

  return { tags }
}

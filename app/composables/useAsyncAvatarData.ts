export async function useAsyncAvatarData() {
  const { data } = await useAsyncGql({
    operation: "avatar",
    options: {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  })

  const src = computed(() => data.value.avatarCollection?.items[0]?.avatarImage?.url || "")
  const title = computed(() => data.value.avatarCollection?.items[0]?.avatarImage?.title || "")

  return { src, title }
}

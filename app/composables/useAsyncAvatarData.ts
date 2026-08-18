export async function useAsyncAvatarData() {
  const { data, error } = await useAsyncGql({
    operation: "avatar",
    options: {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
    }
  })

  if (error.value) {
    console.error("[useAsyncAvatarData] Failed to fetch avatar:", error.value)
  }

  const src = computed(() => data.value?.avatarCollection?.items?.[0]?.avatarImage?.url || "")
  const title = computed(() => data.value?.avatarCollection?.items?.[0]?.avatarImage?.title || "")

  return { src, title }
}

import type { InstagramReel } from "~~/types/instagram"

export const useInstagramReelData = (itemCount = ref(6)) => {
  const { data, pending } = useFetch<InstagramReel[]>("/api/instagram/reels", {
    query: {
      itemCount: itemCount.value
    },
    lazy: true
  })

  return {
    reels: data,
    isReelsDataLoading: pending
  }
}

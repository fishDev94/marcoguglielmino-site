import type { LightboxImage } from "@@/types/image-viewer"

export const useImageViewer = (imagesRef: Ref<LightboxImage[]>) => {
  const route = useRoute()
  const router = useRouter()

  const selectedImageId = computed(() => route.query.img_id as string | undefined)

  const selectedImage = computed(() =>
    imagesRef.value.find(img => img.id === selectedImageId.value)
  )

  const currentIndex = computed(() =>
    imagesRef.value.findIndex(img => img.id === selectedImageId.value)
  )

  const openViewer = (id: string) => {
    router.push({ query: { ...route.query, img_id: id } })
  }

  const closeViewer = () => {
    const query = { ...route.query }
    delete query.img_id
    router.replace({ query })
  }

  const nextImage = () => {
    if (currentIndex.value === -1 || imagesRef.value.length === 0) return

    const nextIdx = (currentIndex.value + 1) % imagesRef.value.length
    openViewer(imagesRef.value[nextIdx]?.id as string)
  }

  const prevImage = () => {
    if (currentIndex.value === -1 || imagesRef.value.length === 0) return
    const prevIdx = (currentIndex.value - 1 + imagesRef.value.length) % imagesRef.value.length
    openViewer(imagesRef.value[prevIdx]?.id as string)
  }

  onMounted(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImageId.value) return
      if (e.key === "Escape") closeViewer()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    onUnmounted(() => window.removeEventListener("keydown", handleKeyDown))
  })

  return {
    selectedImageId,
    selectedImage,
    currentIndex,
    openViewer,
    closeViewer,
    nextImage,
    prevImage
  }
}

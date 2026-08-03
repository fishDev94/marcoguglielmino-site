import type { InstagramReel } from "~~/types/instagram"

/**
 * Composable that handles shared logic for the Reel viewer components:
 * - Route-based reel selection via `r_id` query param
 * - Video playback controls (play/pause, mute, seek, progress)
 * - ESC key to close
 * - Body scroll lock when viewer is open
 */
export const useReelViewer = (reels: Ref<InstagramReel[] | null | undefined>) => {
  const route = useRoute()

  // --- State ---
  const isPaused = ref(false)
  const isMuted = ref(true)
  const videoProgress = ref(0)
  const currentTime = ref(0)
  const duration = ref(0)
  const _selectedReelId = ref<string | undefined>(route.query.r_id as string | undefined)

  // --- Computed ---
  const selectedReelId = computed(() => _selectedReelId.value)

  const selectedReel = computed(() =>
    reels.value?.find(r => r.id === selectedReelId.value)
  )

  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const formattedDuration = computed(() => formatTime(duration.value))

  // Sync URL → state (e.g. on page load with ?r_id=xxx, or browser back/forward)
  watch(
    () => route.query.r_id as string | undefined,
    (newId) => {
      _selectedReelId.value = newId
    }
  )

  // --- Actions ---
  const closeViewer = () => {
    _selectedReelId.value = undefined
    const url = new URL(window.location.href)
    url.searchParams.delete("r_id")
    window.history.replaceState({}, "", url.toString())
  }

  const togglePlayPause = (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return
    if (videoEl.paused) {
      videoEl.play()
      isPaused.value = false
    } else {
      videoEl.pause()
      isPaused.value = true
    }
  }

  const toggleMute = (videoEl?: HTMLVideoElement | null) => {
    isMuted.value = !isMuted.value
    if (videoEl) {
      videoEl.muted = isMuted.value
    }
  }

  const onTimeUpdate = (videoEl: HTMLVideoElement) => {
    currentTime.value = videoEl.currentTime
    if (duration.value > 0) {
      videoProgress.value = (currentTime.value / duration.value) * 100
    }
  }

  const onLoadedMetadata = (videoEl: HTMLVideoElement) => {
    duration.value = videoEl.duration
  }

  const seekVideo = (event: MouseEvent, videoEl: HTMLVideoElement | null) => {
    if (!videoEl || !duration.value) return
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration.value

    videoEl.currentTime = newTime
    currentTime.value = newTime
    videoProgress.value = percentage * 100
  }

  /**
   * Safely attempts to play a video element.
   * Falls back to muted playback if browser blocks autoplay with sound.
   */
  const attemptPlay = (video: HTMLVideoElement) => {
    video.muted = isMuted.value

    if (!video.paused && video.readyState >= 2) return

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPaused.value = false
        })
        .catch(() => {
          video.muted = true
          isMuted.value = true
          video.play()
            .then(() => { isPaused.value = false })
            .catch(() => { isPaused.value = true })
        })
    }
  }

  // --- ESC key handler ---
  const onEscKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && selectedReelId.value) {
      closeViewer()
    }
  }

  // --- Listen for reel open events from ReelCard ---
  const onReelOpen = (e: Event) => {
    const reelId = (e as CustomEvent).detail as string
    _selectedReelId.value = reelId
  }

  onMounted(() => {
    window.addEventListener("keydown", onEscKeydown)
    window.addEventListener("reel-open", onReelOpen)
  })

  onUnmounted(() => {
    window.removeEventListener("keydown", onEscKeydown)
    window.removeEventListener("reel-open", onReelOpen)
  })

  // --- Body scroll lock + invalid ID cleanup ---
  watch(
    selectedReelId,
    (newId) => {
      if (!import.meta.client) return
      if (newId) {
        // If the ID doesn't match any reel, remove it from the URL
        const exists = reels.value?.some(r => r.id === newId)
        if (!exists) {
          closeViewer()
          return
        }
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    },
    { immediate: true }
  )

  return {
    // State
    isPaused,
    isMuted,
    videoProgress,
    currentTime,
    duration,

    // Computed
    selectedReelId,
    selectedReel,
    formattedCurrentTime,
    formattedDuration,

    // Actions
    closeViewer,
    togglePlayPause,
    toggleMute,
    onTimeUpdate,
    onLoadedMetadata,
    seekVideo,
    attemptPlay
  }
}

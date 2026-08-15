<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedReelId"
          class="mg-reel-mobile"
        >
          <div class="mg-reel-mobile__header">
            <span class="mg-reel-mobile__title">{{ $t('reel_viewer.reels') }}</span>

            <div class="mg-reel-mobile__header-actions">
              <button
                type="button"
                :aria-label="muteButtonConfig.ariaLabel"
                class="mg-reel-mobile__header-btn"
                @click="handleToggleMute"
              >
                <UIcon
                  :key="muteButtonConfig.iconName"
                  :name="muteButtonConfig.iconName"
                  class="size-6"
                />
              </button>

              <button
                type="button"
                :aria-label="$t('reel_viewer.close_reel')"
                class="mg-reel-mobile__header-btn"
                @click="closeViewer"
              >
                <UIcon
                  name="i-material-symbols-close"
                  class="size-7"
                />
              </button>
            </div>
          </div>

          <div
            ref="containerRef"
            class="mg-reel-mobile__scroll-container"
            @scroll.passive="onScroll"
          >
            <div
              v-for="reel in orderedReels"
              :key="reel.id"
              :data-id="reel.id"
              class="mg-reel-mobile__slide"
            >
              <InstagramReelPlayer
                v-if="reel.video_src"
                :ref="(el: any) => setPlayerRef(el, reel.id)"
                :src="proxyVideoUrl(reel.id, reel.video_src)"
                :muted="isMuted"
                :autoplay="isActiveReel(reel.id)"
                :preload="isActiveReel(reel.id) ? 'auto' : 'none'"
                :progress="isActiveReel(reel.id) ? videoProgress : 0"
                :is-paused="isPaused && isActiveReel(reel.id)"
                variant="mobile"
                @click="handleSlideTogglePlayPause"
                @timeupdate="(video: HTMLVideoElement) => handleMobileTimeUpdate(video, reel.id)"
              />

              <!-- Fallback: thumbnail + CTA when media_url is not available (copyrighted audio) -->
              <div
                v-else
                class="mg-reel-mobile__fallback"
                @click.stop="openInstagram(reel)"
              >
                <img
                  v-if="reel.thumbnail_url"
                  :src="reel.thumbnail_url"
                  :alt="reel.caption || 'Reel thumbnail'"
                  class="mg-reel-mobile__fallback-img"
                >
                <div class="mg-reel-mobile__fallback-overlay">
                  <UIcon
                    name="i-material-symbols-play-circle-outline"
                    class="mg-reel-mobile__fallback-icon"
                  />
                  <span class="mg-reel-mobile__fallback-label">{{ $t('reel_viewer.view_on_instagram') }}</span>
                </div>
              </div>

              <InstagramReelInfo
                :caption="reel.caption || ''"
                :timestamp="reel.timestamp"
                variant="mobile"
                @open-instagram="openInstagram(reel)"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { INIT_REF_NUMBER } from "~/constants"
import type { InstagramReel } from "~~/types/instagram"

const props = defineProps<{
  reels: InstagramReel[]
}>()

const reelsRef = toRef(props, "reels")

const {
  selectedReelId,
  isPaused,
  isMuted,
  videoProgress,
  closeViewer,
  attemptPlay
} = useReelViewer(reelsRef)

// --- Mobile-specific state ---
const containerRef = useTemplateRef<HTMLElement>("containerRef")
const playerRefs = new Map<string, { videoEl: HTMLVideoElement | null }>()
const activeReelId = ref<string | undefined>(undefined)
const orderedReels = ref<InstagramReel[]>([])

const isActiveReel = (id: string) => activeReelId.value === id

// :aria-label="isMuted ? $t('reel_viewer.unmute') : $t('reel_viewer.mute')"
// :name="isMuted ? 'i-material-symbols-volume-off-rounded' : 'i-material-symbols-volume-up-rounded'"
const muteButtonConfig = computed(() => {
  const muted = {
    ariaLabel: $t("reel_viewer.unmute"),
    iconName: "i-material-symbols-volume-off-rounded"
  }

  const unMuted = {
    ariaLabel: $t("reel_viewer.mute"),
    iconName: "i-material-symbols-volume-up-rounded"
  }

  return isMuted.value ? muted : unMuted
})

let urlDebounceTimer: ReturnType<typeof setTimeout> | null = null

// Override muted default for mobile (start unmuted)
isMuted.value = false

// --- Player ref management ---
const setPlayerRef = (el: { videoEl: HTMLVideoElement | null } | null, id: string) => {
  if (el) {
    playerRefs.set(id, el)
  } else {
    playerRefs.delete(id)
  }
}

const getVideoEl = (id: string) => playerRefs.get(id)?.videoEl ?? null

// --- Mobile mute toggles all videos ---
const handleToggleMute = () => {
  isMuted.value = !isMuted.value
  playerRefs.forEach((player) => {
    if (player.videoEl) {
      player.videoEl.muted = isMuted.value
    }
  })
}

// --- Play a specific video, pause all others ---
const playVideo = (id: string) => {
  activeReelId.value = id
  videoProgress.value = INIT_REF_NUMBER

  playerRefs.forEach((player, videoId) => {
    const video = player.videoEl
    if (!video) return

    if (videoId === id) {
      video.currentTime = INIT_REF_NUMBER
      attemptPlay(video)
    } else {
      video.pause()
    }
  })
}

// --- Order reels so selected reel is first ---
const prepareReelsOrder = (targetId: string) => {
  if (!props.reels || props.reels.length === INIT_REF_NUMBER) return

  const targetIndex = props.reels.findIndex(r => r.id === targetId)

  if (targetIndex <= INIT_REF_NUMBER) {
    orderedReels.value = [...props.reels]
  } else {
    orderedReels.value = [
      ...props.reels.slice(targetIndex),
      ...props.reels.slice(INIT_REF_NUMBER, targetIndex)
    ]
  }
}

// --- Init on reel selection ---
watch(
  selectedReelId,
  async (newId) => {
    if (!import.meta.client) return

    if (newId) {
      prepareReelsOrder(newId)
      activeReelId.value = newId

      await nextTick()

      if (containerRef.value) {
        containerRef.value.scrollTop = INIT_REF_NUMBER
      }

      const video = getVideoEl(newId)
      if (video) {
        playVideo(newId)
      } else {
        setTimeout(() => {
          if (getVideoEl(newId)) playVideo(newId)
        }, 50)
      }
    } else {
      activeReelId.value = undefined
      orderedReels.value = []
      playerRefs.forEach((player) => {
        player.videoEl?.pause()
      })
    }
  },
  { immediate: true }
)

// --- Scroll snap handler ---
const onScroll = () => {
  if (!containerRef.value || orderedReels.value.length === INIT_REF_NUMBER) return

  const container = containerRef.value
  const slideHeight = container.clientHeight
  if (!slideHeight) return

  const currentIndex = Math.round(container.scrollTop / slideHeight)
  const currentReel = orderedReels.value[currentIndex]

  if (currentReel && currentReel.id !== activeReelId.value) {
    playVideo(currentReel.id)

    if (urlDebounceTimer) clearTimeout(urlDebounceTimer)
    urlDebounceTimer = setTimeout(() => {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("r_id", currentReel.id)
      window.history.replaceState({}, "", newUrl.toString())
    }, 200)
  }
}

// --- Toggle play/pause on active video ---
const handleSlideTogglePlayPause = () => {
  if (!activeReelId.value) return
  const video = getVideoEl(activeReelId.value)
  if (!video) return

  if (video.paused) {
    video.play()
    isPaused.value = false
  } else {
    video.pause()
    isPaused.value = true
  }
}

// --- Time update for the active video ---
const handleMobileTimeUpdate = (video: HTMLVideoElement, id: string) => {
  if (id !== activeReelId.value) return
  if (video?.duration) {
    videoProgress.value = (video.currentTime / video.duration) * 100
  }
}

// --- Open Instagram link ---
const openInstagram = (reel: InstagramReel) => {
  const url = reel.permalink || `https://instagram.com/reel/${reel.id}`
  window.open(url, "_blank", "noopener,noreferrer")
}
</script>

<style lang="scss" scoped>
.mg-reel-mobile {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: var(--mg-color-secondary);
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: linear-gradient(to bottom, color-mix(in srgb, var(--mg-color-secondary) 70%, transparent), transparent);
    pointer-events: none;
  }

  &__title {
    @include body(3);

    color: var(--mg-btn-text-primary);
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
  }

  &__header-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mg-btn-text-primary);
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: color-mix(in srgb, var(--mg-btn-text-primary) 10%, transparent);
    }
  }

  &__scroll-container {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;

    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  &__slide {
    height: 100dvh;
    width: 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--mg-color-secondary);
    cursor: pointer;
  }

  &__fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__fallback-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: color-mix(in srgb, var(--mg-color-secondary) 40%, transparent);
  }

  &__fallback-icon {
    width: 64px;
    height: 64px;
    color: var(--mg-btn-text-primary);
    opacity: 0.9;
  }

  &__fallback-label {
    @include body(3);

    color: var(--mg-btn-text-primary);
    font-style: italic;
    opacity: 0.9;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

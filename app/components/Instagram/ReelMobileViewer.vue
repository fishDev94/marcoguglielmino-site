<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedReelId"
          class="mg-reel-mobile"
        >
          <!-- Fixed header -->
          <div class="mg-reel-mobile__header">
            <span class="mg-reel-mobile__title">{{ $t('reel_viewer.reels') }}</span>

            <div class="mg-reel-mobile__header-actions">
              <button
                type="button"
                :aria-label="isMuted ? $t('reel_viewer.unmute') : $t('reel_viewer.mute')"
                class="mg-reel-mobile__header-btn"
                @click="handleToggleMute"
              >
                <UIcon
                  :name="isMuted ? 'i-material-symbols-volume-off-rounded' : 'i-material-symbols-volume-up-rounded'"
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

          <!-- Scroll-snap container -->
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
              @click="handleSlideTogglePlayPause"
            >
              <!-- Video -->
              <video
                :ref="(el: HTMLVideoElement) => setVideoRef(el, reel.id)"
                :src="reel.media_url"
                loop
                autoplay
                :muted="isMuted"
                playsinline
                webkit-playsinline
                preload="auto"
                aria-label="Instagram Reel Video"
                class="mg-reel-mobile__video"
                @timeupdate="handleMobileTimeUpdate($event, reel.id)"
              >
                <track
                  kind="descriptions"
                  label="Descrizione video"
                  default
                >
              </video>

              <!-- Pause/Play feedback -->
              <Transition name="scale">
                <div
                  v-if="isPaused && activeReelId === reel.id"
                  class="mg-reel-mobile__play-feedback"
                >
                  <UIcon
                    name="i-material-symbols-play-arrow-rounded"
                    class="size-12"
                  />
                </div>
              </Transition>

              <!-- Caption + CTA -->
              <div class="mg-reel-mobile__bottom">
                <InstagramReelCaption
                  :text="reel.caption || ''"
                  class="mg-reel-mobile__caption"
                />

                <span
                  v-if="reel.timestamp"
                  class="mg-reel-mobile__time-ago"
                >
                  {{ formatTimeAgo(reel.timestamp, $t) }}
                </span>

                <div class="mg-reel-mobile__cta">
                  <UIButton
                    type="primary"
                    :is-strong="true"
                    class="mg-reel-mobile__cta-btn"
                    @click.stop="openInstagram(reel)"
                  >
                    <UIcon
                      name="i-material-symbols-video-library-rounded"
                      class="size-5"
                    />
                    <span>{{ $t('reel_viewer.view_on_instagram') }}</span>
                  </UIButton>
                </div>
              </div>

              <!-- Progress bar -->
              <div
                v-show="activeReelId === reel.id"
                class="mg-reel-mobile__progress"
              >
                <div
                  class="mg-reel-mobile__progress-fill"
                  :style="{ width: `${videoProgress}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
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
const containerRef = ref<HTMLElement | null>(null)
const videoRefs = new Map<string, HTMLVideoElement>()
const activeReelId = ref<string | undefined>(undefined)
const orderedReels = ref<InstagramReel[]>([])

let urlDebounceTimer: ReturnType<typeof setTimeout> | null = null

// Override muted default for mobile (start unmuted)
isMuted.value = false

// --- Video ref management ---
const setVideoRef = (el: HTMLVideoElement | null, id: string) => {
  if (el) {
    videoRefs.set(id, el)
  } else {
    videoRefs.delete(id)
  }
}

// --- Mobile mute toggles all videos ---
const handleToggleMute = () => {
  isMuted.value = !isMuted.value
  videoRefs.forEach((video) => {
    video.muted = isMuted.value
  })
}

// --- Play a specific video, pause all others ---
const playVideo = (id: string) => {
  activeReelId.value = id
  videoProgress.value = 0

  videoRefs.forEach((video, videoId) => {
    if (videoId === id) {
      video.currentTime = 0
      attemptPlay(video)
    } else {
      video.pause()
    }
  })
}

// --- Order reels so selected reel is first ---
const prepareReelsOrder = (targetId: string) => {
  if (!props.reels || props.reels.length === 0) return

  const targetIndex = props.reels.findIndex(r => r.id === targetId)

  if (targetIndex <= 0) {
    orderedReels.value = [...props.reels]
  } else {
    orderedReels.value = [
      ...props.reels.slice(targetIndex),
      ...props.reels.slice(0, targetIndex)
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
        containerRef.value.scrollTop = 0
      }

      const targetVideo = videoRefs.get(newId)
      if (targetVideo) {
        playVideo(newId)
      } else {
        setTimeout(() => {
          const v = videoRefs.get(newId)
          if (v) playVideo(newId)
        }, 50)
      }
    } else {
      activeReelId.value = undefined
      orderedReels.value = []
      videoRefs.forEach(v => v.pause())
    }
  },
  { immediate: true }
)

// --- Scroll snap handler ---
const onScroll = () => {
  if (!containerRef.value || orderedReels.value.length === 0) return

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
  const video = videoRefs.get(activeReelId.value)
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
const handleMobileTimeUpdate = (event: Event, id: string) => {
  if (id !== activeReelId.value) return
  const video = event.target as HTMLVideoElement
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

  &__video {
    height: 100%;
    width: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  &__play-feedback {
    position: absolute;
    z-index: 20;
    padding: 16px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--mg-color-secondary) 50%, transparent);
    color: var(--mg-btn-text-primary);
    backdrop-filter: blur(4px);
    pointer-events: none;
  }

  &__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    padding: 24px;
    padding-bottom: 24px;
    background: linear-gradient(to top, var(--mg-color-secondary), color-mix(in srgb, var(--mg-color-secondary) 80%, transparent), transparent);
    color: var(--mg-btn-text-primary);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__caption {
    @include body(3);

    line-height: 1.5;
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    :deep(.mg-reel-hashtag) {
      color: var(--mg-color-accent);
    }
  }

  &__time-ago {
    @include body(4);

    color: color-mix(in srgb, var(--mg-btn-text-primary) 70%, transparent);
    font-weight: 300;
  }

  &__cta {
    padding-top: 4px;
    pointer-events: auto;
    margin-bottom: 16px;
  }

  &__cta-btn {
    @include body(4);

    display: inline-flex;
    align-items: center;
    gap: 10px;
    border-radius: 6px !important;
    text-transform: uppercase;
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    height: 4px;
    width: 100%;
    background-color: color-mix(in srgb, var(--mg-btn-text-primary) 20%, transparent);
    overflow: hidden;
    pointer-events: none;
  }

  &__progress-fill {
    height: 100%;
    background-color: var(--mg-color-primary);
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

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.6);
  opacity: 0;
}
</style>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedReel"
          class="mg-reel-desktop"
          @click.self="closeViewer"
        >
          <div class="mg-reel-desktop__modal">
            <button
              type="button"
              :aria-label="$t('reel_viewer.close')"
              class="mg-reel-desktop__close"
              @click="closeViewer"
            >
              <UIcon
                name="i-material-symbols-close"
                class="size-8"
              />
            </button>

            <InstagramReelPlayer
              ref="playerRef"
              :src="proxyVideoUrl(selectedReel.id)"
              :muted="isMuted"
              :progress="videoProgress"
              :is-paused
              :formatted-current-time
              :formatted-duration
              variant="desktop"
              @click="handleTogglePlayPause"
              @toggle-play-pause="handleTogglePlayPause"
              @toggle-mute="handleToggleMute"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
              @seek="handleSeek"
            />

            <InstagramReelInfo
              :caption="selectedReel.caption || ''"
              :timestamp="selectedReel.timestamp"
              variant="desktop"
              @open-instagram="openInstagram"
            />
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
  selectedReel,
  isPaused,
  isMuted,
  videoProgress,
  formattedCurrentTime,
  formattedDuration,
  closeViewer,
  togglePlayPause,
  toggleMute,
  onTimeUpdate,
  onLoadedMetadata,
  seekVideo,
  attemptPlay
} = useReelViewer(reelsRef)

const playerRef = useTemplateRef<{ videoEl: HTMLVideoElement | null }>("playerRef")

const getVideoEl = () => playerRef.value?.videoEl ?? null

const handleTogglePlayPause = () => {
  togglePlayPause(getVideoEl())
}

const handleToggleMute = () => {
  toggleMute(getVideoEl())
}

const handleSeek = (event: MouseEvent) => {
  seekVideo(event, getVideoEl())
}

const openInstagram = () => {
  if (!selectedReel.value) return
  const url = selectedReel.value.permalink || `https://instagram.com/reel/${selectedReel.value.id}`
  window.open(url, "_blank", "noopener,noreferrer")
}

// Autoplay when reel changes
watch(
  selectedReel,
  async (reel) => {
    if (!import.meta.client) return

    if (!reel) {
      getVideoEl()?.pause()
      return
    }

    await nextTick()
    const video = getVideoEl()
    if (video) {
      video.currentTime = 0
      attemptPlay(video)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.mg-reel-desktop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(12px) brightness(0.3);
  user-select: none;

  @include start-from(tablet) {
    padding: 32px;
  }

  &__close {
    position: absolute;
    top: 24px;
    right: 24px;
    color: var(--mg-btn-text-primary);
    z-index: 110;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--mg-color-accent);
    }
  }

  &__modal {
    position: relative;
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    background-color: var(--mg-color-secondary);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px color-mix(in srgb, var(--mg-color-on-surface) 50%, transparent);
    border: 1px solid color-mix(in srgb, var(--mg-btn-text-primary) 10%, transparent);

    @include start-from(tablet) {
      flex-direction: row;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div
    class="mg-reel-player"
    :class="[`mg-reel-player--${variant}`, { group: variant === 'desktop' }]"
    @click="$emit('click')"
  >
    <video
      ref="videoRef"
      :src
      loop
      :autoplay
      :muted
      playsinline
      webkit-playsinline
      :preload
      aria-label="Instagram Reel Video"
      class="mg-reel-player__video"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
    >
      <track
        kind="descriptions"
        label="Descrizione video"
        default
      >
    </video>

    <div
      v-if="!isMobile"
      class="mg-reel-player__gradient"
    >
      <div
        class="mg-reel-player__progress-bar"
        @click.stop="handleSeek"
      >
        <div
          class="mg-reel-player__progress-fill"
          :style="{ width: `${displayProgress}%` }"
        />
      </div>

      <div class="mg-reel-player__controls">
        <div class="mg-reel-player__controls-left">
          <button
            type="button"
            :aria-label="isPaused ? $t('reel_viewer.play') : $t('reel_viewer.pause')"
            class="mg-reel-player__control-btn"
            @click.stop="$emit('toggle-play-pause')"
          >
            <UIcon
              :name="isPaused ? 'i-material-symbols-play-arrow-rounded' : 'i-material-symbols-pause-rounded'"
              class="size-8"
            />
          </button>
          <div class="mg-reel-player__time">
            {{ formattedCurrentTime }} / {{ formattedDuration }}
          </div>
        </div>

        <button
          type="button"
          :aria-label="muted ? $t('reel_viewer.unmute') : $t('reel_viewer.mute')"
          class="mg-reel-player__control-btn"
          @click.stop="$emit('toggle-mute')"
        >
          <UIcon
            :name="mutedIcon"
            class="size-6"
          />
        </button>
      </div>
    </div>

    <div
      v-if="isMobile"
      class="mg-reel-player__progress-mobile"
    >
      <div
        class="mg-reel-player__progress-fill"
        :style="{ width: `${displayProgress}%` }"
      />
    </div>

    <Transition name="scale">
      <div
        v-if="isPaused"
        class="mg-reel-player__play-overlay"
        :class="`mg-reel-player__play-overlay--${variant}`"
      >
        <div
          v-if="!isMobile"
          class="mg-reel-player__play-icon"
        >
          <UIcon
            name="i-material-symbols-play-arrow-rounded"
            class="size-12"
          />
        </div>
        <UIcon
          v-else
          name="i-material-symbols-play-arrow-rounded"
          class="size-12"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  muted?: boolean
  autoplay?: boolean
  preload?: "auto" | "metadata" | "none"
  progress?: number
  isPaused?: boolean
  formattedCurrentTime?: string
  formattedDuration?: string
  variant?: "desktop" | "mobile"
}

const {
  muted = true,
  autoplay = true,
  preload = "auto",
  progress = 0,
  isPaused = false,
  formattedCurrentTime = "00:00",
  formattedDuration = "00:00",
  variant = "desktop"
} = defineProps<Props>()

const emit = defineEmits<{
  click: []
  "toggle-play-pause": []
  "toggle-mute": []
  timeupdate: [video: HTMLVideoElement]
  loadedmetadata: [video: HTMLVideoElement]
  seek: [event: MouseEvent]
}>()

const videoRef = useTemplateRef<HTMLVideoElement>("videoRef")
const internalProgress = ref(0)
const isMobile = computed(() => variant === "mobile")
const mutedIcon = computed(() => muted ? "i-material-symbols-volume-off-rounded" : "i-material-symbols-volume-up-rounded")

// Use internal progress for immediate updates (no prop round-trip lag)
const displayProgress = computed(() =>
  !isMobile.value ? internalProgress.value : progress
)

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  const video = videoRef.value
  if (video.duration) {
    internalProgress.value = (video.currentTime / video.duration) * 100
  }
  emit("timeupdate", video)
}

const handleLoadedMetadata = () => {
  if (videoRef.value) emit("loadedmetadata", videoRef.value)
}

const handleSeek = (event: MouseEvent) => {
  emit("seek", event)
}

defineExpose({
  videoEl: videoRef
})
</script>

<style lang="scss" scoped>
.mg-reel-player {
  position: relative;
  background-color: var(--mg-color-secondary);
  cursor: pointer;

  &--desktop {
    width: 100%;
    aspect-ratio: 9 / 16;
    flex-shrink: 0;

    @include start-from(tablet) {
      width: 450px;
    }
  }

  &--mobile {
    height: 100%;
    width: 100%;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
    gap: 16px;
    pointer-events: none;
    background: linear-gradient(
      0deg,
      color-mix(in srgb, var(--mg-color-secondary) 85%, transparent) 0%,
      transparent 40%
    );
  }

  &__progress-bar {
    width: 100%;
    height: 6px;
    background-color: color-mix(in srgb, var(--mg-btn-text-primary) 20%, transparent);
    border-radius: 9999px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    pointer-events: auto;
  }

  &__progress-mobile {
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
    border-radius: 9999px;
    transition: width 250ms linear;
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--mg-btn-text-primary);
    pointer-events: auto;
  }

  &__controls-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__control-btn {
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--mg-color-primary);
    }
  }

  &__time {
    @include body(4);

    font-family: monospace;
  }

  &__play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    &--mobile {
      z-index: 20;
      inset: unset;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 16px;
      border-radius: 50%;
      background-color: color-mix(in srgb, var(--mg-color-secondary) 50%, transparent);
      color: var(--mg-btn-text-primary);
      backdrop-filter: blur(4px);
    }
  }

  &__play-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--mg-color-primary) 20%, transparent);
    backdrop-filter: blur(4px);
    border: 1px solid var(--mg-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mg-btn-text-primary);
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
</style>

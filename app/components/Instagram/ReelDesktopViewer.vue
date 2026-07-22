<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedReel"
          class="mg-reel-desktop"
          @click.self="closeViewer"
        >
          <!-- Close button -->
          <button
            type="button"
            :aria-label="$t('reel_viewer.close')"
            class="mg-reel-desktop__close"
            @click="closeViewer"
          >
            <UIcon
              name="i-material-symbols-close"
              class="size-10"
            />
          </button>

          <!-- Modal container -->
          <div class="mg-reel-desktop__modal">
            <!-- Left side: Video Player (9:16) -->
            <div
              class="mg-reel-desktop__video-container group"
              @click="togglePlayPause(videoRef)"
            >
              <video
                ref="videoRef"
                :src="selectedReel.media_url"
                loop
                autoplay
                :muted="isMuted"
                playsinline
                webkit-playsinline
                preload="auto"
                aria-label="Instagram Reel Video"
                class="mg-reel-desktop__video"
                @timeupdate="handleTimeUpdate"
                @loadedmetadata="handleLoadedMetadata"
              >
                <track
                  kind="descriptions"
                  label="Descrizione video"
                  default
                >
              </video>

              <!-- Gradient overlay -->
              <div class="mg-reel-desktop__gradient">
                <!-- Progress bar -->
                <div
                  class="mg-reel-desktop__progress-bar"
                  @click.stop="handleSeek"
                >
                  <div
                    class="mg-reel-desktop__progress-fill"
                    :style="{ width: `${videoProgress}%` }"
                  />
                </div>

                <!-- Video controls -->
                <div class="mg-reel-desktop__controls">
                  <div class="mg-reel-desktop__controls-left">
                    <button
                      type="button"
                      :aria-label="isPaused ? $t('reel_viewer.play') : $t('reel_viewer.pause')"
                      class="mg-reel-desktop__control-btn"
                      @click.stop="togglePlayPause(videoRef)"
                    >
                      <UIcon
                        :name="isPaused ? 'i-material-symbols-play-arrow-rounded' : 'i-material-symbols-pause-rounded'"
                        class="size-8"
                      />
                    </button>
                    <div class="mg-reel-desktop__time">
                      {{ formattedCurrentTime }} / {{ formattedDuration }}
                    </div>
                  </div>

                  <button
                    type="button"
                    :aria-label="isMuted ? $t('reel_viewer.unmute') : $t('reel_viewer.mute')"
                    class="mg-reel-desktop__control-btn"
                    @click.stop="toggleMute(videoRef)"
                  >
                    <UIcon
                      :name="isMuted ? 'i-material-symbols-volume-off-rounded' : 'i-material-symbols-volume-up-rounded'"
                      class="size-6"
                    />
                  </button>
                </div>
              </div>

              <!-- Play icon overlay when paused -->
              <Transition name="scale">
                <div
                  v-if="isPaused"
                  class="mg-reel-desktop__play-overlay"
                >
                  <div class="mg-reel-desktop__play-icon">
                    <UIcon
                      name="i-material-symbols-play-arrow-rounded"
                      class="size-12"
                    />
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Right side: Info panel -->
            <div class="mg-reel-desktop__info">
              <div>
                <!-- Header -->
                <div class="mg-reel-desktop__info-header">
                  <UBadge
                    variant="subtle"
                    :ui="{ base: 'rounded-full' }"
                    size="sm"
                    class="mg-reel-desktop__badge"
                  >
                    Marco Guglielmino
                  </UBadge>
                  <span
                    v-if="selectedReel.timestamp"
                    class="mg-reel-desktop__date"
                  >
                    {{ formatTimeAgo(selectedReel.timestamp, $t) }}
                  </span>
                </div>

                <!-- Caption -->
                <InstagramReelCaption
                  :text="selectedReel.caption || ''"
                  class="mg-reel-desktop__caption"
                />
              </div>

              <!-- CTA -->
              <div class="mg-reel-desktop__cta">
                <UIButton
                  type="primary"
                  :is-strong="true"
                  class="mg-reel-desktop__cta-btn"
                  @click="openInstagram"
                >
                  <UIcon
                    name="i-material-symbols-photo-camera-outline"
                    class="size-5"
                  />
                  <span>{{ $t('reel_viewer.view_on_instagram') }}</span>
                  <UIcon
                    name="i-material-symbols-arrow-forward-rounded"
                    class="size-5"
                  />
                </UIButton>
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

const videoRef = ref<HTMLVideoElement | null>(null)

const handleTimeUpdate = () => {
  if (videoRef.value) onTimeUpdate(videoRef.value)
}

const handleLoadedMetadata = () => {
  if (videoRef.value) onLoadedMetadata(videoRef.value)
}

const handleSeek = (event: MouseEvent) => {
  seekVideo(event, videoRef.value)
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
      videoRef.value?.pause()
      return
    }

    await nextTick()
    if (videoRef.value) {
      videoRef.value.currentTime = 0
      attemptPlay(videoRef.value)
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

    @include start-from(tablet) {
      top: 40px;
      right: 40px;
    }

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

  &__video-container {
    position: relative;
    width: 100%;
    aspect-ratio: 9 / 16;
    background-color: var(--mg-color-secondary);
    flex-shrink: 0;
    cursor: pointer;

    @include start-from(tablet) {
      width: 450px;
    }
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

  &__progress-fill {
    position: absolute;
    inset: 0;
    right: auto;
    height: 100%;
    background-color: var(--mg-color-primary);
    border-radius: 9999px;
    transition: width 75ms linear;
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

  &__info {
    flex-grow: 1;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--mg-color-secondary);
    color: var(--mg-btn-text-primary);

    @include start-from(tablet) {
      padding: 48px;
    }
  }

  &__info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__badge {
    --ui-primary: var(--mg-color-accent);

    @include body(4);

    padding: 4px 12px;
    font-size: 10px;
    text-transform: uppercase;
  }

  &__date {
    @include body(4);

    color: color-mix(in srgb, var(--mg-btn-text-primary) 40%, transparent);
    text-transform: uppercase;
  }

  &__caption {
    @include body(2);

    color: color-mix(in srgb, var(--mg-btn-text-primary) 80%, transparent);
    margin-bottom: 32px;

    :deep(.mg-reel-hashtag) {
      color: var(--mg-color-accent);
    }
  }

  &__cta {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__cta-btn {
    width: 100%;
    justify-content: center;
    gap: 8px;
    padding: 16px 24px;
    border-radius: 8px !important;
    font-style: italic;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
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
  transform: scale(0.7);
  opacity: 0;
}
</style>

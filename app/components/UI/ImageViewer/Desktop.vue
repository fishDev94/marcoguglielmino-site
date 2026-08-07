<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedImage"
          class="mg-image-desktop"
          @click.self="closeViewer"
        >
          <button
            type="button"
            :aria-label="$t('article.gallery.image_viewer.close')"
            class="mg-image-desktop__close"
            @click="closeViewer"
          >
            <UIcon
              name="i-material-symbols-close"
              class="size-8"
            />
          </button>
          <button
            v-if="images.length > 1"
            type="button"
            :aria-label="$t('article.gallery.image_viewer.previous')"
            class="mg-image-desktop__nav mg-image-desktop__nav--prev"
            @click="prevImage"
          >
            <UIcon
              name="i-material-symbols-arrow-back-ios-new-rounded"
              class="size-8"
            />
          </button>

          <div class="mg-image-desktop__content">
            <NuxtImg
              :key="selectedImage.id"
              :src="selectedImage.url || ''"
              format="webp"
              quality="90"
              sizes="md:80vw lg:1200px"
              densities="x1 x2"
              class="mg-image-desktop__img"
            />
          </div>

          <button
            v-if="images.length > 1"
            type="button"
            :aria-label="$t('article.gallery.image_viewer.next')"
            class="mg-image-desktop__nav mg-image-desktop__nav--next"
            @click="nextImage"
          >
            <UIcon
              name="i-material-symbols-arrow-forward-ios-rounded"
              class="size-8"
            />
          </button>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { LightboxImage } from "@@/types/image-viewer"

const props = defineProps<{
  images: LightboxImage[]
}>()

const imagesRef = toRef(props, "images")
const { selectedImage, closeViewer, nextImage, prevImage } = useImageViewer(imagesRef)
</script>

<style lang="scss" scoped>
.mg-image-desktop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  backdrop-filter: blur(12px) brightness(0.3);
  user-select: none;

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

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 110;
    color: var(--mg-btn-text-primary);
    background-color: color-mix(in srgb, var(--mg-color-secondary) 40%, transparent);
    padding: 12px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
      background-color: color-mix(in srgb, var(--mg-color-secondary) 80%, transparent);
      transform: translateY(-50%) scale(1.05);
    }

    &--prev {
      left: 24px;
    }

    &--next {
      right: 24px;
    }
  }

  &__content {
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 25px 50px -12px color-mix(in srgb, var(--mg-color-on-surface) 50%, transparent);
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

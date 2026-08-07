<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedImageId"
          class="mg-image-mobile"
        >
          <div class="mg-image-mobile__header">
            <span class="mg-image-mobile__counter">
              {{ currentIndex + 1 }} / {{ images.length }}
            </span>

            <button
              type="button"
              :aria-label="$t('article.gallery.image_viewer.close')"
              class="mg-image-mobile__close-btn"
              @click="closeViewer"
            >
              <UIcon
                name="i-material-symbols-close"
                class="size-7"
              />
            </button>
          </div>

          <div
            ref="containerRef"
            class="mg-image-mobile__scroll-container"
            @scroll.passive="onScroll"
          >
            <div
              v-for="img in images"
              :key="img.id"
              :data-id="img.id"
              class="mg-image-mobile__slide"
            >
              <NuxtImg
                :src="img.url || ''"
                format="webp"
                quality="85"
                sizes="xs:100vw sm:100vw"
                densities="x1 x2"
                class="mg-image-mobile__img"
              />
            </div>
          </div>
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
const { selectedImageId, currentIndex, closeViewer } = useImageViewer(imagesRef)

const containerRef = useTemplateRef<HTMLElement>("containerRef")
const router = useRouter()
const route = useRoute()
let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null
let isScrollTriggered = false

const scrollToImage = (imageId: string) => {
  if (!containerRef.value) return
  const targetIndex = props.images.findIndex(img => img.id === imageId)
  if (targetIndex !== -1) {
    const slideWidth = containerRef.value.clientWidth
    containerRef.value.scrollLeft = slideWidth * targetIndex
  }
}

watch(
  selectedImageId,
  async (newId) => {
    if (!import.meta.client || !newId) return

    // Skip programmatic scroll if the change came from user scrolling
    if (isScrollTriggered) {
      isScrollTriggered = false
      return
    }

    await nextTick()
    scrollToImage(newId)
  }
)

// Handle initial scroll when viewer opens (including page reload with img_id in URL)
watch(containerRef, (el) => {
  if (el && selectedImageId.value) {
    nextTick(() => scrollToImage(selectedImageId.value!))
  }
})

const onScroll = () => {
  if (!containerRef.value || props.images.length === 0) return

  const container = containerRef.value
  const slideWidth = container.clientWidth
  if (!slideWidth) return

  const newIndex = Math.round(container.scrollLeft / slideWidth)
  const currentImg = props.images[newIndex]

  if (currentImg && currentImg.id !== selectedImageId.value) {
    if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer)
    scrollDebounceTimer = setTimeout(() => {
      isScrollTriggered = true
      router.replace({ query: { ...route.query, img_id: currentImg.id } })
    }, 150)
  }
}
</script>

<style lang="scss" scoped>
.mg-image-mobile {
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
    background: linear-gradient(to bottom, color-mix(in srgb, var(--mg-color-secondary) 80%, transparent), transparent);
  }

  &__counter {
    @include body(3);

    color: var(--mg-btn-text-primary);
    font-weight: 500;
  }

  &__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mg-btn-text-primary);
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
  }

  &__scroll-container {
    height: 100%;
    width: 100%;
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  &__slide {
    flex: 0 0 100vw;
    height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  &__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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

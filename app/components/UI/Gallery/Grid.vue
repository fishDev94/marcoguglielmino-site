<template>
  <div class="mg-gallery-mosaic">
    <div
      v-for="(image, index) in visibleImages"
      :key="image.id || index"
      class="mg-gallery-mosaic__item"
      :class="getBentoClass(index)"
      @click="handleSelect(image.id)"
    >
      <NuxtImg
        :src="image.url || ''"
        :alt="image.title || 'Gallery image'"
        provider="contentful"
        loading="lazy"
        format="webp"
        quality="80"
        sizes="sm:100vw md:400px lg:500px"
        densities="x1 x2"
        :placeholder="`data:image/svg+xml;base64,${toBase64(shimmer(image.width || 600, image.height || 400))}`"
        class="mg-gallery-mosaic__img"
      />
    </div>

    <div
      v-if="hasMore"
      ref="sentinelRef"
      class="mg-gallery-mosaic__sentinel"
      aria-hidden="true"
    />

    <UIImageViewerDesktop
      v-if="isDesktop"
      :images
    />
    <UIImageViewerMobile
      v-else
      :images
    />
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints, useIntersectionObserver } from "@vueuse/core"

import type { LightboxImage } from "@@/types/image-viewer"

interface Props {
  images: Array<{ width: number, height: number } & LightboxImage>
}

const BATCH_SIZE = 10

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual("md")
const { images } = defineProps<Props>()

const { openViewer } = useImageViewer(toRef(() => images))

const emit = defineEmits<{
  (e: "select", id: string): void
}>()

const visibleCount = ref(BATCH_SIZE)
const sentinelRef = ref<HTMLElement | null>(null)

const visibleImages = computed(() => images.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < images.length)

const loadMore = () => {
  if (hasMore.value) {
    visibleCount.value = Math.min(visibleCount.value + BATCH_SIZE, images.length)
  }
}

useIntersectionObserver(
  sentinelRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      loadMore()
    }
  },
  { rootMargin: "200px" }
)

const handleSelect = (id?: string) => {
  if (id) {
    emit("select", id)
    openViewer(id)
  }
}

const getBentoClass = (index: number): string => {
  const patternIndex = index % 5
  return `mg-gallery-mosaic__item--bento-${patternIndex + 1}`
}
</script>

<style lang="scss" scoped>
.mg-gallery-mosaic {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 220px;
    gap: 16px;
  }

  &__sentinel {
    height: 1px;
    width: 100%;

    @media (min-width: 768px) {
      grid-column: span 12;
    }
  }

  &__item {
    position: relative;
    width: 100%;
    height: 260px;
    border-radius: 0.25rem;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(193, 198, 215, 0.3);
    background-color: var(--mg-color-surface-alt);
    transition:
      transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

    @media (min-width: 768px) {
      height: 100%;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px -10px rgba(0, 122, 255, 0.3);

      .mg-gallery-mosaic__img {
        transform: scale(1.05);
      }

      .mg-gallery-mosaic__overlay {
        opacity: 1;
      }
    }

    @include start-from(tablet) {
      &--bento-1 {
        grid-column: span 4;
        grid-row: span 3;
      }

      &--bento-2 {
        grid-column: span 8;
        grid-row: span 2;
      }

      &--bento-3 {
        grid-column: span 4;
        grid-row: span 2;
      }

      &--bento-4 {
        grid-column: span 4;
        grid-row: span 2;
      }

      &--bento-5 {
        grid-column: span 12;
        grid-row: span 2;
      }
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      0deg,
      rgba(15, 23, 42, 0.6) 0%,
      rgba(15, 23, 42, 0) 60%
    );
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 1.25rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &__icon {
    font-family: "Material Symbols Outlined", sans-serif;
    color: var(--mg-color-accent);
    font-size: 2rem;
    user-select: none;
  }
}
</style>

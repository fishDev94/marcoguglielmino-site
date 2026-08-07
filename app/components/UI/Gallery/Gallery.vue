<template>
  <section class="mg-gallery-section">
    <h2
      v-if="title"
      class="mg-gallery-section__title"
    >
      {{ title }}
    </h2>

    <UIGalleryMosaic
      :images
      @select="openViewer"
    />

    <div class="mg-gallery-section__desktop-carousel">
      <UICarousel :carousel-item-size="carouselItemSize">
        <div
          v-for="(image, index) in images"
          :key="`gallery-image-desktop-${image.id || index}`"
          class="mg-gallery-section__carousel-item"
        >
          <NuxtImg
            :src="image.url || ''"
            :alt="image.title || ''"
            provider="contentful"
            loading="lazy"
            format="webp"
            quality="75"
            sizes="md:320px lg:320px"
            width="320"
            height="240"
            densities="x1 x2"
            :placeholder="`data:image/svg+xml;base64,${toBase64(shimmer(320, 240))}`"
            class="mg-gallery-section__img"
            @click="openViewer(image.id)"
          />
        </div>
      </UICarousel>
    </div>

    <UIImageViewerDesktop
      v-if="isDesktop"
      :images="images"
    />
    <UIImageViewerMobile
      v-else
      :images="images"
    />
  </section>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import type { LightboxImage } from "@@/types/image-viewer"

interface Props {
  title?: string
  images?: LightboxImage[]
  carouselItemSize?: string
}

const {
  title,
  images = [],
  carouselItemSize = "320px"
} = defineProps<Props>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual("md")

const imagesRef = toRef(() => images)
const { openViewer } = useImageViewer(imagesRef)
</script>

<style lang="scss" scoped>
.mg-gallery-section {
  margin-bottom: 1.5rem;

  &__title {
    @include heading(3);

    margin-bottom: 16px;
  }

  &__desktop-carousel {
    display: none;

    @include start-from(medium-desktop) {
      display: block;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  &__carousel-item {
    width: var(--carousel-item-size, 320px);
    height: 240px;
    border-radius: 0.75rem;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;

    @include start-from(medium-desktop) {
      &:hover {
        .mg-gallery-section__img {
          transform: scale(1.08);
        }
      }
    }
  }
}
</style>

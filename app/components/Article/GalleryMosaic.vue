<template>
  <div class="mg-gallery-mosaic">
    <div
      v-for="(image, index) in images"
      :key="`gallery-image-mosaic-${image.id || index}`"
      class="mg-gallery-mosaic__item"
    >
      <NuxtImg
        :src="image.url || ''"
        loading="lazy"
        format="webp"
        quality="75"
        sizes="xs:50vw sm:50vw"
        width="360"
        height="160"
        densities="x1 x2"
        :placeholder="`data:image/svg+xml;base64,${toBase64(shimmer(360, 160))}`"
        class="mg-gallery-mosaic__img"
        @click="emit('select', image.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LightboxImage } from "@/composables/useImageViewer"

defineProps<{
  images: LightboxImage[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<style lang="scss" scoped>
.mg-gallery-mosaic {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  grid-auto-rows: 76px;

  @include start-from(medium-desktop) {
    display: none;
  }

  &__item {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;

    &:nth-child(3n + 1) {
      grid-row: span 2;
      height: 160px;
    }

    &:nth-child(3n + 2),
    &:nth-child(3n + 3) {
      height: 76px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>

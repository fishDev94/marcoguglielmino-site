<template>
  <div class="mg-reel-card-skeleton">
    <div class="overlay-gradient" />
    <div class="mg-reel-card-skeleton__shimmer">
      <img
        :src="`data:image/svg+xml;base64,${toBase64(reelShimmer(320, 500))}`"
        alt=""
        aria-hidden="true"
      >
    </div>
    <div class="mg-reel-card-skeleton__description">
      <USkeleton class="size-9 rounded-full" />
      <USkeleton class="h-4 w-[70%]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toBase64 } from "~/utils/shimmer"

const reelShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1e293b" offset="20%" />
      <stop stop-color="#334155" offset="50%" />
      <stop stop-color="#1e293b" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1e293b" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`
</script>

<style lang="scss" scoped>
.mg-reel-card-skeleton {
  width: 320px;
  height: 500px;
  border-radius: 0.75rem;
  position: relative;
  overflow: hidden;
  margin-block: 4px;

  @include start-from(tablet) {
    width: 280px;
  }

  &__shimmer {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__description {
    position: absolute;
    bottom: 0;
    padding-bottom: 24px;
    padding-left: 24px;
    padding-right: 24px;
    width: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.overlay-gradient {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  background-image: linear-gradient(
    to top,
    color-mix(in srgb, var(--mg-color-secondary) 80%, transparent) 0%,
    transparent 50%,
    transparent 80%
  );
}
</style>

<template>
  <NuxtLink
    :to="{ query: { ...$route.query, r_id: reel.id } }"
    class="mg-reel-card block"
  >
    <div class="overlay-gradient" />
    <NuxtImg
      class="mg-reel-card__thumbnail"
      :src="reel.thumbnail_url"
    />
    <div class="mg-reel-card__description">
      <UIcon
        class="mg-reel-card__play-icon size-9"
        name="i-material-symbols-play-circle-outline"
      />
      <p>
        {{ reel.caption }}
      </p>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { InstagramReel } from "~~/types/instagram"

interface Props {
  reel: InstagramReel
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-reel-card {
  width: 320px;
  height: 500px;
  background-color: color-mix(
    in srgb,
    var(--mg-color-on-surface) 10%,
    transparent
  );
  border-radius: 0.75rem; /* 12px */
  position: relative;
  overflow: hidden;
  margin-block: 4px;
  cursor: pointer;

  @include start-from(tablet) {
    width: 280px;
  }

  &:hover {
    .mg-reel-card__thumbnail {
      transform: scale(1.1);
    }
  }

  &__thumbnail {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    /* bg-contain bg-center */
    object-fit: contain;
    object-position: center;

    /* transition-transform duration-500 */
    transition-property: transform;
    transition-duration: 500ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__description {
    position: absolute;
    bottom: 0;
    color: var(--mg-btn-text-primary);
    padding-bottom: 24px;
    padding-left: 24px;
    padding-right: 24px;
    width: 100%;
    z-index: 2;

    p {
      @include body(3);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 90%;
    }
  }

  &__play-icon {
    margin-bottom: 2px;
  }
}
.truncate-single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
}

.overlay-gradient {
  /* absolute inset-0 */
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;

  /* bg-gradient-to-t from-black/80 via-transparent to-transparent */
  background-image: linear-gradient(
    to top,
    color-mix(in srgb, var(--mg-color-secondary) 80%, transparent) 0%,
    transparent 50%,
    transparent 80%
  );
}
</style>

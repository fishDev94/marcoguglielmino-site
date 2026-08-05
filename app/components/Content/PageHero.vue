<template>
  <div class="mg-content-page-hero">
    <div
      v-if="heroImage"
      class="mg-content-page-hero__cover"
    >
      <NuxtImg
        provider="contentful"
        :src="heroImage.url || ''"
        class="mg-content-page-hero__cover-img"
        sizes="100vw sm:500px lg:800px xl:1200px"
        :width="heroImage?.width || 800"
        :height="heroImage?.height || 500"
        format="webp"
        quality="75"
        loading="eager"
        fetchpriority="high"
        alt="Hero Page cover"
        :placeholder="`data:image/svg+xml;base64,${toBase64(shimmer())}`"
      />
      <div class="mg-content-page-hero__cover-overlay" />
    </div>
    <div
      :class="['mg-content-page-hero__text-content', { 'mg-content-page-hero__text-content--with-cover': heroImage }]"
    >
      <p
        v-if="pageData.label"
        class="mg-content-page-hero__label"
      >
        <span class="mg-content-page-hero__line hidden md:block" />
        {{ pageData.label }}
      </p>
      <h1 class="mg-content-page-hero__title">
        {{ pageData.title }}
      </h1>
      <p class="mg-content-page-hero__description">
        {{ pageData.subTitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentPageDataFragment } from "#gql"

const { pageData } = defineProps<{
  pageData: ContentPageDataFragment
}>()

const heroImage = computed(() => {
  return pageData?.hero
})
</script>

<style lang="scss" scoped>
.mg-content-page-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @include start-from(tablet) {
    gap: 16px;
  }

  &__cover {
    position: relative;
    overflow: hidden;
    height: 35dvh;
    width: 100%;
    background-color: var(--mg-color-secondary);
  }

  &__cover-img {
    display: block;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  &__cover-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: linear-gradient(90deg,
        rgba(15, 23, 42, 0.92) 0%,
        rgba(15, 23, 42, 0.7) 52%,
        rgba(15, 23, 42, 0) 100%);
  }

  &__text-content {
    padding: 36px;

    @include start-from(tablet) {
      padding-inline: 64px;
      padding-block: 36px;
    }

    &--with-cover {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      color: var(--mg-btn-text-primary);
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      pointer-events: none;
    }
  }

  &__line {
    background-color: var(--mg-color-primary);
    height: 2px;
    width: 36px;
  }

  &__label {
    @include body(2);

    display: none;
    color: var(--mg-color-primary);
    font-weight: 600;

    @include start-from(tablet) {
      display: flex;
      gap: 8px;
      align-items: center;
      text-transform: uppercase;
    }
  }

  &__title {
    @include heading(2);

    @include start-from(tablet) {
      @include heading(1);
    }
  }

  &__description {
    @include body(2);

    @include start-from(tablet) {
      @include body(1);

      width: 50%;
    }
  }
}
</style>

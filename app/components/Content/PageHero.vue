<template>
  <div class="mg-content-page-hero">
    <div
      v-if="hasHeroBackground"
      class="mg-content-page-hero__cover"
      :style="coverStyle"
    >
      <NuxtImg
        v-if="hasHeroImage"
        :provider="heroProvider"
        :src="heroImageSrc"
        class="mg-content-page-hero__cover-img"
        sizes="100vw sm:500px lg:800px xl:1200px"
        :width="contentfulHeroImage?.width || 800"
        :height="contentfulHeroImage?.height || 500"
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
      :class="['mg-content-page-hero__text-content', { 'mg-content-page-hero__text-content--with-cover': hasHeroBackground }]"
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

const { pageData, heroImage, heroColor } = defineProps<{
  pageData: ContentPageDataFragment
  heroImage?: string
  heroColor?: string
}>()

const contentfulHeroImage = computed(() => {
  return pageData?.hero
})

const sanitizedHeroColor = computed(() => {
  const color = heroColor?.trim()

  if (!color) return ""

  const isHexColor = /^#(?:[\da-fA-F]{3}|[\da-fA-F]{6}|[\da-fA-F]{8})$/.test(color)
  const isCssVarColor = /^var\(--[\w-]+\)$/.test(color)
  return isHexColor || isCssVarColor ? color : ""
})

const heroImageSrc = computed(() => {
  return contentfulHeroImage.value?.url || heroImage || ""
})

const hasHeroImage = computed(() => Boolean(heroImageSrc.value))
const hasHeroColor = computed(() => !hasHeroImage.value && Boolean(sanitizedHeroColor.value))
const hasHeroBackground = computed(() => hasHeroImage.value || hasHeroColor.value)

const heroProvider = computed(() => {
  return contentfulHeroImage.value?.url ? "contentful" : undefined
})

const coverStyle = computed(() => {
  if (!hasHeroColor.value) return undefined

  return {
    backgroundColor: sanitizedHeroColor.value
  }
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
    height: 30dvh;
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
    padding: 24px;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;

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

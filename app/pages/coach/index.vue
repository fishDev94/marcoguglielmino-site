<template>
  <NuxtLayout
    name="default-page"
    hero-color="var(--mg-color-secondary)"
    with-block-padding
    with-aside-layout
    mobile-side-position="top"
  >
    <template #side>
      <NuxtImg
        v-if="ogImage?.url"
        provider="contentful"
        :src="ogImage.url"
        :width="ogImage.width || 1200"
        :height="ogImage.height || 800"
        :alt="ogImage.title || 'Coach image'"
        class="mg-coach__side-image"
        sizes="100vw md:50vw lg:33vw"
        format="webp"
        quality="80"
        loading="lazy"
      />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { seoData } = await useAsyncContentPageData()

const ogImage = useState("coach-og-image", () => seoData.value?.ogImage || null)

watchEffect(() => {
  ogImage.value = seoData.value?.ogImage || null
})
</script>

<style scoped lang="scss">
.mg-coach {
  &__side-image {
    display: block;
    width: 128px;
    height: 128px;
    margin-inline: auto;
    object-fit: cover;
    object-position: center 18%;
    border-radius: 9999px;

    @include start-from(medium-desktop) {
      width: 100%;
      height: auto;
      object-position: center;
      border-radius: 0.75rem;
    }
  }
}
</style>

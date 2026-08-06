<template>
  <NuxtLayout name="default-page">
    <section class="mg-gallery-page">
      <UIGalleryGrid :images />
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { LightboxImage } from "@@/types/image-viewer"

const lang = useCurrentLang()
const { data } = await useAsyncGql("getGalleryAssets", {
  locale: lang
})

const images = computed(() => {
  return data.value?.assetCollection?.items.map(asset => ({
    id: asset?._id,
    url: asset?.url,
    alt: asset?.title || "",
    width: asset?.width || 0,
    height: asset?.height || 0
  })) as Array<{ width: number, height: number } & LightboxImage> || []
})
</script>

<style lang="scss" scoped>
.mg-gallery-page {
  padding: 36px 0;

  @include start-from(tablet) {
    padding: 64px 0;
  }
}
</style>

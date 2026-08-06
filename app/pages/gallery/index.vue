<template>
  <NuxtLayout name="default-page">
    <section class="mg-gallery-page">
      <div
        v-if="pending"
        class="mg-gallery-loading"
      >
        <span class="mg-gallery-spinner" />
      </div>
      <UIGalleryGrid
        v-else
        :images
      />
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { LightboxImage } from "@@/types/image-viewer"

const lang = useCurrentLang()
const { data, pending } = useAsyncData(
  "gallery-assets",
  () => GqlGetGalleryAssets({ locale: lang }),
  { lazy: true }
)

const images = computed(() => {
  return (
    (data.value?.assetCollection?.items.map(asset => ({
      id: asset?._id,
      url: asset?.url,
      alt: asset?.title || "",
      width: asset?.width || 0,
      height: asset?.height || 0
    })) as Array<{ width: number, height: number } & LightboxImage>) || []
  )
})
</script>

<style lang="scss" scoped>
.mg-gallery-page {
  padding: 36px 0;

  @include start-from(tablet) {
    padding: 64px 0;
  }
}

.mg-gallery-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.mg-gallery-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <NuxtLayout name="default-page">
    <h1>test</h1>
    <UIGallery
      :images
    />
  </NuxtLayout>
</template>

<script lang="ts" setup>
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
  })) || []
})
</script>

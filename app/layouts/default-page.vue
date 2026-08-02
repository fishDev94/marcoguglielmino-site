<template>
  <NuxtLayout name="content-wrapper">
    <ContentPageHero :page-data />
    <RichTextRenderer
      v-if="richTextField"
      :custom-rich-text-json="richTextField"
    />
    <slot />
  </NuxtLayout>
</template>

<script setup lang="ts">
const {
  pageData,
  seoData,
  richTextField
} = await useAsyncContentPageData()

useSeoMeta({
  title: seoData.value?.title,
  description: seoData.value?.description,
  ogTitle: seoData.value?.title,
  ogDescription: seoData.value?.description,
  ogImage: seoData.value?.ogImage?.url,
  ogImageAlt: seoData.value?.ogImage?.title,
  ogImageWidth: seoData.value?.ogImage?.width,
  ogImageHeight: seoData.value?.ogImage?.height,
  twitterCard: "summary_large_image",
  twitterTitle: seoData.value?.title,
  twitterDescription: seoData.value?.description,
  twitterImage: seoData.value?.ogImage?.url,
  twitterImageAlt: seoData.value?.ogImage?.title,
  robots: seoData.value?.noIndex ? "noindex" : undefined
})

useHead({
  title: seoData.value?.title
})
</script>

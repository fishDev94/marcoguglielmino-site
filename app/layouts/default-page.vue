<template>
  <main>
    <ContentPageHero
      v-if="pageData"
      :page-data
    />
    <NuxtLayout
      v-if="!withAsideLayout"
      name="content-wrapper"
    >
      <RichTextRenderer
        v-if="richTextField"
        :custom-rich-text-json="richTextField"
      />
      <slot />
    </NuxtLayout>
    <div
      v-else
      class="mg-default-page__content"
    >
      <NuxtLayout
        name="article-layout"
        :split
      >
        <template #main>
          <RichTextRenderer
            v-if="richTextField"
            :custom-rich-text-json="richTextField"
          />
          <slot name="main" />
        </template>
        <template #side>
          <slot name="side" />
        </template>
      </NuxtLayout>
    </div>
  </main>
</template>

<script setup lang="ts">
const { withAsideLayout = false } = defineProps<{
  withAsideLayout?: boolean
  split?: "8-4" | "50-50"
}>()

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

<style scoped lang="scss">
.mg-default-page {
  &__content {
    padding-block: calc(36px - 24px);

    @include start-from(tablet) {
      padding-block: calc(64px - 24px);
    }
  }
}
</style>

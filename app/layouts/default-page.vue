<template>
  <main>
    <ContentPageHero
      v-if="pageData"
      :page-data="pageData"
      :hero-image="props.heroImage"
      :hero-color="props.heroColor"
    />
    <NuxtLayout
      v-if="!props.withAsideLayout"
      name="content-wrapper"
    >
      <div :class="['mg-default-page__flow', { 'mg-default-page__flow--with-block-padding': props.withBlockPadding }]">
        <RichTextRenderer
          v-if="richTextField"
          :custom-rich-text-json="richTextField"
        />
        <slot />
      </div>
    </NuxtLayout>
    <div
      v-else
      class="mg-default-page__content"
    >
      <NuxtLayout
        name="article-layout"
        :split="props.split"
        :mobile-side-position="props.mobileSidePosition"
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
const props = withDefaults(defineProps<{
  withAsideLayout?: boolean
  split?: "8-4" | "50-50"
  mobileSidePosition?: "top" | "bottom"
  heroImage?: string
  heroColor?: string
  withBlockPadding?: boolean
}>(), {
  withAsideLayout: false,
  mobileSidePosition: "bottom",
  withBlockPadding: false
})

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
  robots: {
    index: !seoData.value?.noIndex,
    follow: true
  }
})

useHead({
  title: seoData.value?.title
})
</script>

<style scoped lang="scss">
.mg-default-page {
  &__flow {
    &--with-block-padding {
      padding-block: 36px;

      @include start-from(tablet) {
        padding-block: 64px;
      }
    }
  }

  &__content {
    padding-block: calc(36px - 24px);

    @include start-from(tablet) {
      padding-block: calc(64px - 24px);
    }
  }
}
</style>

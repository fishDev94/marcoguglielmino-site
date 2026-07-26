<template>
  <NuxtLayout name="article-layout">
    <template #main>
      <article class="mg-blog-post">
        <header class="mg-blog-post__header">
          <UBreadcrumb
            :items="breadcrumbItems"
            :ui="{ link: 'text-xs md:text-sm' }"
          />
          <div class="mg-blog-post__info-container">
            <UBadge
              v-if="isRecord"
              class="mg-blog-post__badge rounded-full uppercase"
              color="info"
            >
              {{ blogPostData.typeOfRecord }}
            </UBadge>
            <div class="mg-blog-post__location">
              <span>{{ formatDate(blogPostData.eventDate, useCurrentLang()) }} • {{ blogPostData.location }}</span>
            </div>
            <span
              v-if="blogPostData.publishedData"
              class="mg-blog-post__published"
            >
              {{ $t('article.published_on', { date: formatDate(blogPostData.publishedData, useCurrentLang()) }) }}
            </span>
          </div>
          <h1 class="mg-blog-post__title">
            {{ blogPostData.title }}
          </h1>
        </header>
        <RichTextRenderer
          v-if="bodyDescription"
          :custom-rich-text-json="bodyDescription.json"
          :links="bodyDescription.links"
          class="mg-blog-post__body-text"
        />
        <UIGallery
          :images="galleryData"
          :title="$t('article.gallery.title')"
        />
        <USeparator />
        <ArticlePaginator
          :prev="navigation.prev"
          :next="navigation.next"
        />
      </article>
    </template>
    <template #right-side>
      <UIEquipmentItemList
        v-if="equipmentCollection"
        :items="equipmentCollection"
      />
      <UIArticlePerformance
        :data="performance"
      />
      <ArticleSocialShare />
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui"

const route = useRoute()

const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: "Home",
    to: "/"
  },
  {
    label: "Blog",
    to: "/blog"
  },
  {
    label: route.params.slug as string,
    to: route.path
  }
]

definePageMeta({
  name: "blog-post-page"
})

const { slug } = route.params

const {
  blogPostData,
  galleryData,
  bodyDescription,
  equipmentCollection,
  performance,
  navigation
} = await useAsyncBlogPostData(String(slug))

const isRecord = computed(() => blogPostData.value.typeOfRecord !== "none")
const seoTitle = computed(() => blogPostData.value.seoTitle || blogPostData.value.title || "")
const seoDescription = computed(() => blogPostData.value.seoDescription || "")
const coverImageUrl = computed(() => blogPostData.value.coverImage?.url || "")
const coverImageAlt = computed(() => blogPostData.value.coverImage?.description || blogPostData.value.coverImage?.title || seoTitle.value)
const coverImageWidth = computed(() => blogPostData.value.coverImage?.width || 1200)
const coverImageHeight = computed(() => blogPostData.value.coverImage?.height || 630)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: coverImageUrl,
  ogImageAlt: coverImageAlt,
  ogImageWidth: coverImageWidth,
  ogImageHeight: coverImageHeight,
  ogType: "article",
  articlePublishedTime: blogPostData.value.publishedData || undefined,
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: coverImageUrl,
  twitterImageAlt: coverImageAlt
})

useHead({
  title: seoTitle,
  meta: (blogPostData.value.tags?.length
    ? [{ name: "keywords", content: blogPostData.value.tags.join(", ") }]
    : [])
})
</script>

<style lang="scss" scoped>
  .mg-blog-post {
    &__header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;

      @include start-from(medium-desktop) {
        gap: 16px;
        margin-bottom: 16px;
      }
    }

    &__info-container {
      display: flex;
      flex-direction: column;
      gap: 12px;

      @include start-from(medium-desktop) {
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }
    }

    &__location {
      @include body(3);

      color: var(--mg-color-on-surface-variant);
      opacity: 0.8;
    }

    &__published {
      @include body(4);

      color: var(--mg-color-neutral);
      opacity: 0.7;
    }

    &__badge {
      @include body(4);

      width: max-content;
      padding: 6px 12px;
      color: var(--mg-color-on-surface-variant);
    }

    &__title {
      @include heading(2);
    }

    &__body-text {
      margin-bottom: 24px;

      :deep(p) {
        margin-bottom: 24px;
      }
    }
  }
</style>

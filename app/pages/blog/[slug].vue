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
              {{ article.typeOfRecord }}
            </UBadge>
            <div class="mg-blog-post__location">
              <span>{{ formatDate(article.eventDate, useCurrentLang()) }} •
                {{ article.location }}</span>
            </div>
            <span
              v-if="article.publishedData"
              class="mg-blog-post__published"
            >
              {{
                $t("article.published_on", {
                  date: formatDate(
                    article.publishedData,
                    useCurrentLang()
                  )
                })
              }}
            </span>
          </div>
          <h1 class="mg-blog-post__title">
            {{ article.title }}
          </h1>
        </header>
        <RichTextRenderer
          v-if="bodyDescription"
          :custom-rich-text-json="bodyDescription.json"
          :links="bodyDescription.links"
          class="mg-blog-post__body-text"
        />
        <UIGallery
          v-if="galleryData.length"
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
    <template #side>
      <UIEquipmentItemList
        v-if="equipmentCollection"
        :items="equipmentCollection"
      />
      <UIArticlePerformance
        v-if="performance"
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
  article,
  galleryData,
  bodyDescription,
  equipmentCollection,
  performance,
  navigation,
  seoUtilities
} = await useAsyncArticleData(String(slug))

const {
  title,
  description,
  coverImageUrl,
  coverImageAlt,
  coverImageHeight,
  coverImageWidth,
  meta
} = seoUtilities()

const isRecord = computed(() => article.value.typeOfRecord !== "none")

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogSiteName: "Marco Guglielmino",
  ogDescription: description,
  ogUrl: useRequestURL().href,
  ogImage: coverImageUrl,
  ogImageAlt: coverImageAlt,
  ogImageWidth: coverImageWidth,
  ogImageHeight: coverImageHeight,
  ogType: "article",
  articlePublishedTime: article.value.publishedData || undefined,
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: coverImageUrl,
  twitterImageAlt: coverImageAlt,
  robots: { index: true, follow: true, maxImagePreview: "large" }
})

useHead({
  title,
  meta
})

useSchemaOrg([
  defineArticle({
    "@type": "BlogPosting",
    headline: title,
    description,
    image: coverImageUrl,
    datePublished: article.value.publishedData || undefined,
    author: {
      name: "Marco Guglielmino"
    }
  }),
  defineBreadcrumb({
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.to ? `https://www.marcoguglielmino.com${item.to}` : undefined
    }))
  })
])
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

    & > :deep(p) {
      margin-bottom: 24px;
    }
  }
}
</style>

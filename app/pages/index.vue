<template>
  <div class="mg-homepage">
    <Hero
      :src="homepageData?.heroBackground?.url || ''"
      :label="homepageData?.label || ''"
      :title="homepageData?.title || ''"
      :kicker="homepageData?.kicker || ''"
      :copy="homepageData?.copy || ''"
      :cta-buttons
    />
    <!-- Body Content-block from Contentful -->
    <ContentBlock
      v-for="(contentBlock, idx) in contentBlocks"
      :key="contentBlock?.slug || `${idx}+content-block-home`"
      :content-data="contentBlock"
    />
    <StravaLastActivities />
    <InstagramTopReels />
    <!-- Bottom Content-block from Contentful -->
    <ContentBlock
      v-for="(bottomBlock, idx) in bottomContentBlocks"
      :key="bottomBlock?.slug || `${idx}+content-block-home`"
      :content-data="bottomBlock"
    >
      <template v-if="bottomBlock.slug === 'latest-stories-section'">
        <ClientOnly>
          <ArticleWidget
            v-if="latestArticleSlug"
            :article-slug="latestArticleSlug"
          />
        </ClientOnly>
      </template>
    </ContentBlock>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "home"
})

const {
  homepageData,
  contentBlocks,
  bottomContentBlocks,
  ctaButtons
} = await useAsyncHomepageData()

const {
  articles
} = useArticlesData({ limit: ref(1), server: false })

useSeoMeta({
  title: $t("home.seo.title"),
  description: $t("home.seo.description"),
  ogTitle: $t("home.seo.title"),
  ogDescription: $t("home.seo.description"),
  ogUrl: useRequestURL().href,
  ogImage: homepageData.value?.heroBackground?.url,
  robots: { index: true, follow: true }
})

const latestArticleSlug = computed(() => articles.value?.at(0)?.slug || "")
</script>

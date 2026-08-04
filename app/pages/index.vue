<template>
  <div class="mg-homepage">
    <Hero
      :src="homepageData.heroBackground?.url || ''"
      :label="homepageData.label || ''"
      :title="homepageData.title || ''"
      :kicker="homepageData.kicker || ''"
      :copy="homepageData.copy || ''"
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
        <ArticleWidget
          v-if="latestArticle"
          :article="latestArticle"
        />
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

const { articles, isLoading } = useArticlesData({ limit: ref(1), server: false })

const latestArticle = computed(() => articles.value?.at(0))
</script>

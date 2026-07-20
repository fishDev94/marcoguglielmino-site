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
    <ContentBlock
      v-for="(contentBlock, idx) in contentBlocks"
      :key="contentBlock?.slug || `${idx}+content-block-home`"
      :content-data="contentBlock"
    />
    <StravaLastActivities />
    <InstagramTopReels />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "home"
})

const {
  homepageData,
  contentBlocks,
  ctaButtons
} = await useAsyncHomepageData()
</script>

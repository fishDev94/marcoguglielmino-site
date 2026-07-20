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
    <LazyStravaLastActivities />
  </div>
</template>

<script setup lang="ts">
import type { CtaButtonDataFragment } from "#gql"
import type { InstagramReel } from "~~/types/instagram"

const { data: reels, pending } = useFetch<InstagramReel[]>("/api/instagram/reels")

watch(pending, (val) => {
  if (!val) {
    console.log("reels", reels.value)
  }
})

const {
  homepageData,
  contentBlocks
} = await useAsyncHomepageData()

const ctaButtons = computed(() => homepageData.value.ctaButton?.items as CtaButtonDataFragment[])

definePageMeta({
  name: "home"
})
</script>

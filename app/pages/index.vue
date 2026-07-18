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
  </div>
</template>

<script setup lang="ts">
import type { CtaButtonDataFragment } from "#gql"

const {
  homepageData,
  contentBlocks
} = await useAsyncHomepageData()

const ctaButtons = computed(() => homepageData.value.ctaButton?.items as CtaButtonDataFragment[])

definePageMeta({
  name: "home"
})
</script>

<style lang="scss" scoped>
.mg-homepage {}

.button-content {
  display: flex;
  gap: 4px;
}
</style>

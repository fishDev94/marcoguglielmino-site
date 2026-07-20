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
    <TopSection
      section-name="strava"
      link-to="strava"
      :item-count="LAST_ACTIVITIES_PER_PAGE"
      :is-loading="isLoadingStravaData"
      background="default-white"
    >
      <StravaActivityCard
        v-for="(activity, i) in activities"
        :key="`activity-card-${activity.id}+${i}`"
        :activity
      />
    </TopSection>
    <TopSection
      section-name="instagram"
      :item-count="REEL_CARD_COUNT"
      :is-loading="isReelsDataLoading"
      :skeleton-card="InstagramReelCardSkeleton"
      background="secondary-dark"
      carousel-item-size="320px"
    >
      <InstagramReelCard
        v-for="reel in reels"
        :key="`${reel.id}+instagram-reel-card`"
        :reel
      />
    </TopSection>
  </div>
</template>

<script setup lang="ts">
import { LAST_ACTIVITIES_PER_PAGE, REEL_CARD_COUNT } from "~/constants"
import InstagramReelCardSkeleton from "~/components/Instagram/ReelCardSkeleton.vue"

import type { CtaButtonDataFragment } from "#gql"

definePageMeta({
  name: "home"
})

const { reels, isReelsDataLoading } = useInstagramReelData(ref(REEL_CARD_COUNT))
const { getActivities } = useStravaActivities()

const { data: activities, pending: isLoadingStravaData } = getActivities({ per_page: LAST_ACTIVITIES_PER_PAGE })

const {
  homepageData,
  contentBlocks
} = await useAsyncHomepageData()

const ctaButtons = computed(() => homepageData.value.ctaButton?.items as CtaButtonDataFragment[])
</script>

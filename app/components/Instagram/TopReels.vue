<template>
  <TopSection
    section-name="instagram"
    background="secondary-dark"
    carousel-item-size="320px"
  >
    <template v-if="isReelsDataLoading">
      <InstagramReelCardSkeleton
        v-for="n in REEL_CARD_COUNT"
        :key="`${n}+reel-skeleton`"
      />
    </template>
    <template v-else>
      <InstagramReelCard
        v-for="reel in reels"
        :key="`${reel.id}+instagram-reel-card`"
        :reel
      />
    </template>
  </TopSection>

  <!-- Reel Modal -->
  <InstagramReelViewer
    v-if="reels"
    :reels
  />
</template>

<script lang="ts" setup>
import { REEL_CARD_COUNT } from "~/constants"

const { reels, isReelsDataLoading } = useInstagramReelData(ref(REEL_CARD_COUNT))
</script>

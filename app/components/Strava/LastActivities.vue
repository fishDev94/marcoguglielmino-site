<template>
  <TopSection
    section-name="strava"
    link-to="strava"
    background="default-white"
  >
    <template v-if="isLoadingStravaData">
      <StravaActivityCardSkeleton
        v-for="n in LAST_ACTIVITIES_PER_PAGE"
        :key="`${n}+strava-skeleton`"
      />
    </template>
    <template v-else>
      <StravaActivityCard
        v-for="(activity, i) in activities"
        :key="`activity-card-${activity.id}+${i}`"
        :activity
      />
    </template>
  </TopSection>
</template>

<script lang="ts" setup>
import { LAST_ACTIVITIES_PER_PAGE } from "~/constants"

const { getActivities } = useStravaActivities()

const { data: activities, pending: isLoadingStravaData } = getActivities({ per_page: LAST_ACTIVITIES_PER_PAGE })
</script>

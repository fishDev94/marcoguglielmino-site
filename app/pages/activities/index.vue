<template>
  <div>
    <h1>strava</h1>
    <p v-if="isActivitiesLoading">
      Loading
    </p>
    <p v-else>
      Ready!
    </p>
    <div>
      <template v-if="isActivitiesLoading">
        <StravaActivityCardSkeleton
          v-for="n in 9"
          :key="`skeleton-card+${n}`"
        />
      </template>
      <template v-else>
        <UICarousel>
          <StravaActivityCard
            v-for="activity in activitiesList"
            :key="activity.id"
            :activity
          />
        </UICarousel>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: "strava"
})

const { getActivities } = useStravaActivities()
const { data: activities, pending: isActivitiesLoading } = getActivities()

const activitiesList = computed(() => activities.value)
</script>

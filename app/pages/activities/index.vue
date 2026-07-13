<template>
  <div>
    <h1>strava</h1>
    <p v-if="activitiesLoading">
      Loading
    </p>
    <p v-else>
      Ready!
    </p>
    <div>
      <StravaActivityCard
        v-for="activity in activitiesList"
        :key="activity.id"
        :activity
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: "strava"
})

const { getActivities, getActivity } = useStravaActivities()
const { data: activities, pending: activitiesLoading } = useAsyncData(() => getActivities())
// const { data: activity, pending: activityLoading } = useAsyncData(() => getActivity("19252195258"))
const activitiesList = computed(() => activities.value?.data.value)

watch(activitiesLoading, (newVal) => {
  if (!newVal) {
    console.log("finish call", activities.value)
  }
})
</script>

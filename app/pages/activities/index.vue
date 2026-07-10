<template>
  <h1>strava</h1>
</template>

<script lang="ts" setup>
definePageMeta({
  name: "strava"
})

const { getActivities, getActivity } = useStravaActivities()
const { data: activities } = await getActivities()
const { data: activity } = await getActivity("19252195258")

console.log("activities ===>", activities.value)
console.log("activity ===>", activity.value)
</script>

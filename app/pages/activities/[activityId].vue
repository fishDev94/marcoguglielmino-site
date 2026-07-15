<template>
  <div>
    <h1>Activity page</h1>
    <p v-if="pending">
      loading...
    </p>
    <p v-else>
      {{ activity?.name }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { getActivity } = useStravaActivities()

const { activityId } = route.params
const { data: activity, pending } = getActivity(String(activityId))

watch(pending, (val) => {
  if (!val) {
    console.log("activity_data:", activity.value)
  }
}, { immediate: true })

definePageMeta({
  name: "activity-page"
})
</script>

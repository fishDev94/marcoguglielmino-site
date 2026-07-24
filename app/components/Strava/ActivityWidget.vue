<template>
  <StravaActivityCard
    v-if="activity"
    :activity
    type="full"
  />
  <StravaActivityCardSkeleton
    v-else
    type="full"
  />
</template>

<script lang="ts" setup>
interface Props {
  activityId: string
}

const { activityId } = defineProps<Props>()

const { getActivity } = useStravaActivities()

const { data: activity } = getActivity(activityId)
</script>

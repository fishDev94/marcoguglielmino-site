<template>
  <StravaActivityCard :activity="data" />
</template>

<script lang="ts" setup>
interface Props {
  activityId: string
}

const { activityId } = defineProps<Props>()

const { getActivity } = useStravaActivities()

const { data } = getActivity(activityId)
</script>

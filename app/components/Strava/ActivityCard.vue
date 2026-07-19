<template>
  <NuxtLinkLocale
    class="strava-card"
    :class="{ 'is-gym': isWeightTraining }"
    :to="{
      name: 'activity-page',
      params: {
        activityId: activity.id
      }
    }"
  >
    <!-- Header -->
    <StravaHeader
      :activity-name="activity.name"
      :pr-count="activity.pr_count || 0"
      :is-weight-training
      :start-date-local="activity.start_date_local"
    />

    <!-- Main Content (Map or Heart Rate View) -->
    <div class="content-container">
      <StravaMap
        v-if="activity.map?.summary_polyline"
        :polyline-data="activity.map.summary_polyline"
      />
      <StravaInfo
        v-else
        :average-heartrate="activity.average_heartrate"
        :max-heartrate="activity.max_heartrate || 0"
      />
    </div>

    <!-- Metrics Grid -->
    <StravaMetricsGrid
      :is-weight-training
      :average-heartrate="activity.average_heartrate || 0"
      :average-speed="activity.average_speed"
      :moving-time="activity.moving_time"
      :suffer-score="activity.suffer_score || 0"
      :distance="activity.distance"
    />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { StravaActivityBase } from "@@/types/strava"

const { activity } = defineProps<{
  activity: StravaActivityBase
}>()

const isWeightTraining = computed(() => activity.type === "WeightTraining")
</script>

<style lang="scss" scoped>
.strava-card {
  display: block;
  background-color: #ffffff;
  border: 1px solid var(--mg-color-outline);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s ease;

  @include start-from(tablet) {
    width: 320px;
  }

  &:hover {
    transform: translateY(-2px);
  }

  .content-container {
    position: relative;
    width: 100%;
    height: 180px;
    background-color: var(--mg-color-surface-alt);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid var(--mg-color-outline);
  }
}

:deep(.leaflet-container) {
  height: 100% !important;
  width: 100% !important;
  background: var(--mg-color-surface-alt);
  z-index: 1;
}
</style>

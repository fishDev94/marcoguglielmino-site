<template>
  <div class="mg-disc-chart">
    <DisciplineChartMobile
      :discipline
      :items
    />
    <DisciplineChartDesktop
      :discipline
      :items
    />
  </div>
</template>

<script setup lang="ts">
import type { PerformanceCardDataFragment } from "#gql"

defineProps<{
  discipline: string
  items: (PerformanceCardDataFragment | null)[]
}>()
</script>

<style lang="scss" scoped>
.mg-disc-chart {
  width: 100%;
}
</style>

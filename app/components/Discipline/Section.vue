<template>
  <section class="mg-disc-section">
    <DisciplineHeader
      :discipline="disciplineName"
      :personal-best
      :season-best
      :icon
    />

    <div class="mg-disc-section__content">
      <DisciplineChart
        :discipline="disciplineName"
        :items="performance || []"
      />

      <PerformanceTable :discipline="disciplineName" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PerformanceCardDataFragment } from "#gql"

interface Props {
  performance: PerformanceCardDataFragment[]
  disciplineName: string
  icon?: string
}

const {
  performance,
  icon = "i-material-symbols:trending-down"
} = defineProps<Props>()

const personalBest = computed(() => {
  const pbItem = performance.find(item => item?.label === "Personal Best")
  return pbItem?.value || "-"
})

const seasonBest = computed(() => {
  const sbItem = performance.find(item => item?.label === "Season's Best")
  return sbItem?.value || "-"
})
</script>

<style lang="scss" scoped>
.mg-disc-section {
  margin-bottom: 2.5rem;

  @include start-from(tablet) {
    background-color: var(--mg-color-surface-lowest, #ffffff);
    border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 15%, transparent);
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    margin-bottom: 2.5rem;
  }

  &__content {
    padding: 0;

    @include start-from(tablet) {
      padding: 1.5rem;
    }
  }
}
</style>

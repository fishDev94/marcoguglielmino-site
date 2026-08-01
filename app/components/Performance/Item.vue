<template>
  <tr
    v-if="variant === 'desktop'"
    class="mg-performance-item mg-performance-item--desktop"
  >
    <td class="mg-performance-item__cell mg-performance-item__cell--date">
      <PerformanceDateBadge :date="item.date" />
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--event">
      <PerformanceEventInfo
        :location="item.location || ''"
        :title="item.title || ''"
      />
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--time">
      <PerformanceTime
        :value="item.value || ''"
        :label="item.label || ''"
        :is-pb="item.label === 'Personal Best'"
      />
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--trend">
      <PerformanceTrend :trend-data="trendData" />
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--action">
      <PerformanceReference :blog-reference="item.blogReference || ''" />
    </td>
  </tr>

  <div
    v-else-if="variant === 'mobile'"
    class="mg-performance-item mg-performance-item--mobile"
  >
    <div class="mg-performance-item__mobile-top">
      <div class="mg-performance-item__mobile-info">
        <PerformanceDateBadge :date="item.date" />
        <PerformanceEventInfo
          :location="item.location || ''"
          :title="item.title || ''"
        />
      </div>

      <div class="mg-performance-item__mobile-meta">
        <PerformanceTime
          :value="item.value || ''"
          :label="item.label || ''"
          :is-pb="item.label === 'Personal Best'"
        />
        <PerformanceTrend :trend-data="trendData" />
      </div>
    </div>

    <USeparator v-if="item.blogReference" />

    <div
      v-if="item.blogReference"
      class="mg-performance-item__mobile-footer"
    >
      <PerformanceReference :blog-reference="item.blogReference" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import type { PerformanceCardDataFragment } from "#gql"

const props = withDefaults(
  defineProps<{
    item: PerformanceCardDataFragment
    referenceValue?: string
  }>(),
  {
    referenceValue: undefined
  }
)

const breakpoints = useBreakpoints(breakpointsTailwind)

const variant = computed(() =>
  breakpoints.greaterOrEqual("md").value ? "desktop" : "mobile"
)

function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.trim().split(":")
  if (parts.length === 2) {
    const minutes = parseInt(parts[0] || "0")
    const seconds = parseFloat(parts[1] || "0")
    return minutes * 60 + seconds
  } else if (parts.length === 3) {
    const hours = parseInt(parts[0] || "0")
    const minutes = parseInt(parts[1] || "0")
    const seconds = parseFloat(parts[2] || "0")
    return hours * 3600 + minutes * 60 + seconds
  }
  return 0
}

function formatTimeDifference(diffSeconds: number): string {
  const sign = diffSeconds < 0 ? "-" : "+"
  const absDiff = Math.abs(diffSeconds)

  if (absDiff >= 60) {
    const minutes = Math.floor(absDiff / 60)
    const seconds = absDiff % 60
    const formatted = `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`
    return `${sign}${formatted}`
  }

  const formatted = absDiff.toFixed(2).replace(/\.?0+$/, "")
  return `${sign}${formatted}s`
}

const trendData = computed(() => {
  if (props.referenceValue?.trim() && props.item.value?.trim()) {
    const currentSeconds = parseTimeToSeconds(props.item.value)
    const refSeconds = parseTimeToSeconds(props.referenceValue)

    if (currentSeconds > 0 && refSeconds > 0) {
      const diff = currentSeconds - refSeconds

      if (diff !== 0) {
        return {
          text: formatTimeDifference(diff),
          isPositive: diff < 0
        }
      }
    }
  }

  return null
})
</script>

<style lang="scss" scoped>
.mg-performance-item {
  color: var(--mg-color-on-surface);

  &--desktop {
    border-bottom: 1px solid color-mix(in srgb, var(--mg-color-neutral) 10%, transparent);
    transition: background-color 0.2s ease;

    &:hover {
      background-color: color-mix(in srgb, var(--mg-color-primary) 8%, transparent);
    }
  }

  &--mobile {
    background-color: var(--mg-color-surface-lowest, #ffffff);
    border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 15%, transparent);
    border-radius: 0.75rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
  }

  &__cell {
    padding: 1rem;
    vertical-align: middle;
  }

  &__mobile-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__mobile-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  &__mobile-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  &__mobile-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>

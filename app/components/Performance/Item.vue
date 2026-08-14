<template>
  <tr
    v-if="isDesktop"
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
    v-else
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
          :is-pb
        />
        <PerformanceTrend :trend-data />
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
const isPb = computed(() => props.item.label === "Personal Best")

const variant = computed(() =>
  breakpoints.greaterOrEqual("md").value ? "desktop" : "mobile"
)
const isDesktop = computed(() => variant.value === "desktop")

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

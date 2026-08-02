<template>
  <div class="mg-perf-table">
    <div class="mg-perf-table__desktop">
      <div class="overflow-x-auto">
        <table class="mg-perf-table__table">
          <thead class="mg-perf-table__head">
            <tr>
              <th class="mg-perf-table__header-cell mg-perf-table__header-cell--date">
                {{ $t('performance.table.date') }}
              </th>
              <th class="mg-perf-table__header-cell mg-perf-table__header-cell--event">
                {{ $t('performance.table.event') }}
              </th>
              <th class="mg-perf-table__header-cell mg-perf-table__header-cell--time">
                {{ $t('performance.table.performance_time') }}
              </th>
              <th class="mg-perf-table__header-cell mg-perf-table__header-cell--trend">
                {{ $t('performance.table.trend') }}
              </th>
              <th class="mg-perf-table__header-cell mg-perf-table__header-cell--action">
                {{ $t('performance.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, i) in performanceItems"
              :key="i"
            >
              <tr
                v-if="item"
                class="mg-perf-table__body-row"
              >
                <td class="mg-perf-table__cell mg-perf-table__cell--date">
                  <PerformanceDateBadge :date="item.date" />
                </td>
                <td class="mg-perf-table__cell mg-perf-table__cell--event">
                  <PerformanceEventInfo
                    :location="item.location || ''"
                    :title="item.title || ''"
                  />
                </td>
                <td class="mg-perf-table__cell mg-perf-table__cell--time">
                  <PerformanceTime
                    :value="item.value || ''"
                    :label="item.label || ''"
                    :is-pb="item.label === 'Personal Best'"
                  />
                </td>
                <td class="mg-perf-table__cell mg-perf-table__cell--trend">
                  <PerformanceTrend :trend-data="getTrendDataForIndex(item, i)" />
                </td>
                <td class="mg-perf-table__cell mg-perf-table__cell--action">
                  <PerformanceReference :blog-reference="item.blogReference || ''" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mg-perf-table__mobile">
      <div class="mg-perf-table__mobile-list">
        <template
          v-for="(item, i) in performanceItems"
          :key="i"
        >
          <div
            v-if="item"
            class="mg-perf-table__mobile-card"
          >
            <div class="mg-perf-table__mobile-top">
              <div class="mg-perf-table__mobile-info">
                <div class="mg-perf-table__mobile-date-badge">
                  <span class="mg-perf-table__mobile-date-month">
                    {{ parseMonthDay(item.date).month }}
                  </span>
                  <span class="mg-perf-table__mobile-date-day">
                    {{ parseMonthDay(item.date).day }}
                  </span>
                  <span class="mg-perf-table__mobile-date-year">
                    {{ parseMonthDay(item.date).year }}
                  </span>
                </div>
                <div class="mg-perf-table__mobile-event">
                  <span class="mg-perf-table__mobile-event-title">
                    {{ item.location || item.title }}
                  </span>
                </div>
              </div>

              <div class="mg-perf-table__mobile-meta">
                <span
                  v-if="item.label && item.label !== 'none'"
                  class="mg-perf-table__mobile-label"
                >
                  {{ item.label }}
                </span>
                <span
                  class="mg-perf-table__mobile-time"
                  :class="{ 'mg-perf-table__mobile-time--pb': item.label === 'Personal Best' }"
                >
                  {{ item.value }}
                </span>
                <div
                  v-if="getTrendDataForIndex(item, i)"
                  class="mg-perf-table__mobile-trend"
                  :class="{
                    'mg-perf-table__mobile-trend--positive': getTrendDataForIndex(item, i)?.isPositive,
                    'mg-perf-table__mobile-trend--negative': !getTrendDataForIndex(item, i)?.isPositive
                  }"
                >
                  <UIcon
                    :name="
                      getTrendDataForIndex(item, i)?.isPositive
                        ? 'i-material-symbols:trending-down'
                        : 'i-material-symbols:trending-up'
                    "
                  />
                  <span>{{ getTrendDataForIndex(item, i)?.text }}</span>
                </div>
              </div>
            </div>

            <USeparator
              v-if="item.blogReference"
              class="my-2"
            />

            <div
              v-if="item.blogReference"
              class="mg-perf-table__mobile-footer"
            >
              <PerformanceReference :blog-reference="item.blogReference" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PerformanceCardDataFragment } from "#gql"

const props = withDefaults(
  defineProps<{
    discipline: string
  }>(),
  {}
)

const lang = useCurrentLang()

const { data } = await useAsyncGql("performanceCard", {
  locale: lang,
  discipline: props.discipline
})

const performanceItems = computed(() => {
  return data.value?.performanceCardCollection?.items ?? []
})

const personalBest = computed(() => {
  const pbItem = performanceItems.value.find(item => item?.label === "Personal Best")
  return pbItem?.value || ""
})

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
    const seconds = Math.round(absDiff % 60)
    const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}m`
    return formatted
  }

  const formatted = absDiff.toFixed(2).replace(/\.?0+$/, "")
  return `${sign}${formatted}s`
}

function getTrendData(item: PerformanceCardDataFragment, refValue?: string) {
  if (!refValue?.trim() || !item.value?.trim()) return null

  const currentSeconds = parseTimeToSeconds(item.value)
  const refSeconds = parseTimeToSeconds(refValue)

  if (currentSeconds > 0 && refSeconds > 0) {
    const diff = currentSeconds - refSeconds
    if (diff !== 0) {
      return {
        text: formatTimeDifference(diff),
        isPositive: diff < 0
      }
    }
  }

  return null
}

function getReferenceTrend(index: number) {
  if (index < performanceItems.value.length - 1) {
    const prevItem = performanceItems.value[index + 1]
    if (prevItem?.value) {
      return prevItem.value
    }
  }
  return personalBest.value || ""
}

function getTrendDataForIndex(item: PerformanceCardDataFragment, index: number) {
  if (index === performanceItems.value.length - 1) return null
  return getTrendData(item, getReferenceTrend(index))
}

function parseMonthDay(dateString: string) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return { month: "---", day: "--", year: "" }
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const day = d.getDate().toString().padStart(2, "0")
  const year = d.getFullYear().toString().slice(-2)
  return { month, day, year }
}
</script>

<style lang="scss" scoped>
.mg-perf-table {
  &__desktop {
    display: none;

    @include start-from(tablet) {
      display: block;
    }
  }

  &__mobile {
    display: block;

    @include start-from(tablet) {
      display: none;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__head {
    border-bottom: 1px solid color-mix(in srgb, var(--mg-color-neutral) 10%, transparent);
    background-color: color-mix(in srgb, var(--mg-color-primary) 5%, transparent);
  }

  &__header-cell {
    @include body(4);
    padding: 1rem;
    text-align: left;
    color: var(--mg-color-neutral);
    font-weight: 700;
    text-transform: uppercase;

    &--time {
      text-align: right;
    }

    &--trend {
      text-align: center;
    }

    &--action {
      text-align: right;
    }
  }

  &__body-row {
    border-bottom: 1px solid color-mix(in srgb, var(--mg-color-neutral) 10%, transparent);
    transition: background-color 0.2s ease;

    &:hover {
      background-color: color-mix(in srgb, var(--mg-color-primary) 8%, transparent);
    }
  }

  &__cell {
    padding: 1rem;
    vertical-align: middle;

    &--time {
      text-align: right;
    }

    &--trend {
      text-align: center;
    }

    &--action {
      text-align: right;
    }
  }

  &__mobile-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__mobile-card {
    background-color: var(--mg-color-surface-lowest, #ffffff);
    border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 15%, transparent);
    border-radius: 0.75rem;
    padding: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
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

  &__mobile-date-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background-color: color-mix(in srgb, var(--mg-color-primary) 10%, transparent);
    border-radius: 8px;
    color: var(--mg-btn-text-secondary);
    flex-shrink: 0;
  }

  &__mobile-date-month {
    @include body(4);
    text-transform: uppercase;
  }

  &__mobile-date-day {
    @include body(1);
    font-weight: 700;
    line-height: 1;
  }

  &__mobile-date-year {
    @include body(4);
    opacity: 0.55;
    line-height: 1.2;
  }

  &__mobile-event {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__mobile-event-title {
    @include body(3);
    color: var(--mg-color-secondary);
    font-weight: 700;
  }

  &__mobile-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  &__mobile-label {
    @include body(4);
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--mg-color-primary) 10%, transparent);
    color: var(--mg-color-primary);
  }

  &__mobile-time {
    @include heading(4);
    font-weight: 600;
    color: var(--mg-color-secondary);

    &--pb {
      color: var(--mg-color-primary);
    }
  }

  &__mobile-trend {
    @include body(4);
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.35rem;
    margin-top: 0.2rem;

    &--positive {
      color: var(--mg-color-accent);
    }

    &--negative {
      color: var(--mg-color-error);
    }
  }

  &__mobile-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

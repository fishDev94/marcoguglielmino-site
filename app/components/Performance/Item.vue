<script setup lang="ts">
import { formatDate } from "@/utils/contentful"
import type { PerformanceCardDataFragment } from "#gql"

const props = withDefaults(
  defineProps<{
    item: PerformanceCardDataFragment
    variant?: "desktop" | "mobile"
  }>(),
  {
    variant: "mobile"
  }
)

const isPositiveTrend = computed(() => {
  if (!props.item.comparisonText) return true
  const text = props.item.comparisonText.trim().toLowerCase()
  return text.startsWith("-") || text.includes("pb")
})

function parseMonthDay(dateString: string) {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return { month: "---", day: "--" }
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const day = date.getDate().toString().padStart(2, "0")
  return { month, day }
}
</script>

<template>
  <!-- 🖥️ DESKTOP VARIANT (Genera solo un <tr>) -->
  <tr
    v-if="variant === 'desktop'"
    class="mg-performance-item mg-performance-item--desktop"
  >
    <td class="mg-performance-item__cell mg-performance-item__cell--date">
      {{ formatDate(item.date) }}
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--event">
      <span class="mg-performance-item__title">{{ item.title }}</span>
      <span
        v-if="item.location"
        class="mg-performance-item__location"
      >
        • {{ item.location }}
      </span>
    </td>
    <td
      class="mg-performance-item__cell mg-performance-item__cell--time"
      :class="{ 'mg-performance-item__cell--pb': item.label === 'Personal Best' }"
    >
      {{ item.value }}
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--trend">
      <span
        v-if="item.comparisonText"
        class="mg-performance-item__trend-badge"
        :class="isPositiveTrend ? 'mg-performance-item__trend-badge--positive' : 'mg-performance-item__trend-badge--negative'"
      >
        <span class="material-symbols-outlined mg-performance-item__trend-icon">
          {{ isPositiveTrend ? 'arrow_drop_up' : 'arrow_drop_down' }}
        </span>
        {{ item.comparisonText }}
      </span>
      <span
        v-else
        class="mg-performance-item__empty-trend"
      >-</span>
    </td>
    <td class="mg-performance-item__cell mg-performance-item__cell--action">
      <NuxtLink
        v-if="item.blogReference?.slug"
        :to="`/blog/${item.blogReference.slug}`"
        class="mg-performance-item__link"
      >
        Read Post
      </NuxtLink>
      <span
        v-else
        class="mg-performance-item__no-link"
      >
        No Report
      </span>
    </td>
  </tr>

  <!-- 📱 MOBILE VARIANT (Genera solo un <div>) -->
  <div
    v-else-if="variant === 'mobile'"
    class="mg-performance-item mg-performance-item--mobile"
  >
    <div class="mg-performance-item__mobile-top">
      <div class="mg-performance-item__mobile-info">
        <div class="mg-performance-item__date-badge">
          <span class="mg-performance-item__date-month">{{ parseMonthDay(item.date).month }}</span>
          <span class="mg-performance-item__date-day">{{ parseMonthDay(item.date).day }}</span>
        </div>
        <div class="mg-performance-item__event-details">
          <span class="mg-performance-item__mobile-title">{{ item.title }}</span>
          <span
            v-if="item.location"
            class="mg-performance-item__mobile-location"
          >{{ item.location }}</span>
        </div>
      </div>

      <div class="mg-performance-item__mobile-time-wrapper">
        <span
          class="mg-performance-item__mobile-time"
          :class="{ 'mg-performance-item__mobile-time--pb': item.label === 'Personal Best' }"
        >
          {{ item.value }}
        </span>
        <div
          v-if="item.comparisonText"
          class="mg-performance-item__mobile-trend"
          :class="isPositiveTrend ? 'mg-performance-item__mobile-trend--positive' : 'mg-performance-item__mobile-trend--negative'"
        >
          <span class="material-symbols-outlined mg-performance-item__mobile-trend-icon">
            {{ isPositiveTrend ? 'trending_down' : 'trending_up' }}
          </span>
          <span>{{ item.comparisonText }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="item.typeOfRace || item.blogReference?.slug"
      class="mg-performance-item__mobile-footer"
    >
      <span
        v-if="item.typeOfRace"
        class="mg-performance-item__race-type"
      >
        {{ item.typeOfRace }}
      </span>
      <span v-else />

      <NuxtLink
        v-if="item.blogReference?.slug"
        :to="`/blog/${item.blogReference.slug}`"
        class="mg-performance-item__mobile-link"
      >
        READ POST <span class="material-symbols-outlined mg-performance-item__link-icon">arrow_forward</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* --- DESKTOP VIEW --- */
.mg-performance-item--desktop {
  border-bottom: 1px solid rgba(var(--color-split-gray-rgb, 128, 128, 128), 0.05);
  transition: background-color 0.2s ease;
}

.mg-performance-item--desktop:hover {
  background-color: rgba(var(--color-atletica-blue-rgb, 0, 122, 255), 0.05);
}

.mg-performance-item__cell {
  padding: 1rem;
}

.mg-performance-item__cell--date {
  font-weight: 700;
}

.mg-performance-item__title {
  font-weight: 500;
  color: var(--color-track-navy, #0f172a);
}

.mg-performance-item__location {
  color: rgba(var(--color-on-surface-variant-rgb, 100, 100, 100), 0.7);
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.mg-performance-item__cell--time {
  text-align: right;
  font-family: var(--font-data-mono, monospace);
  font-weight: 700;
  color: var(--color-on-surface, #1e293b);
}

.mg-performance-item__cell--pb {
  color: var(--color-atletica-blue, #007aff);
}

.mg-performance-item__cell--trend {
  text-align: center;
}

.mg-performance-item__trend-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
}

.mg-performance-item__trend-badge--positive {
  color: var(--color-velocity-cyan, #00e5ff);
}

.mg-performance-item__trend-badge--negative {
  color: var(--color-error, #ef4444);
}

.mg-performance-item__trend-icon {
  font-size: 16px;
}

.mg-performance-item__empty-trend {
  color: var(--color-split-gray, #94a3b8);
  font-size: 0.75rem;
}

.mg-performance-item__cell--action {
  text-align: right;
}

.mg-performance-item__link {
  color: var(--color-atletica-blue, #007aff);
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  text-decoration: none;
}

.mg-performance-item__link:hover {
  text-decoration: underline;
}

.mg-performance-item__no-link {
  color: rgba(var(--color-on-surface-variant-rgb, 100, 100, 100), 0.4);
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  cursor: not-allowed;
}

/* --- MOBILE VIEW --- */
.mg-performance-item--mobile {
  background-color: #ffffff;
  border: 1px solid rgba(var(--color-split-gray-rgb, 128, 128, 128), 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.mg-performance-item__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mg-performance-item__mobile-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mg-performance-item__date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--color-surface-container, #f1f5f9);
  border-radius: 0.5rem;
  color: var(--color-track-navy, #0f172a);
  flex-shrink: 0;
}

.mg-performance-item__date-month {
  font-weight: 700;
  font-size: 10px;
}

.mg-performance-item__date-day {
  font-family: var(--font-headline, sans-serif);
  font-size: 0.875rem;
  line-height: 1;
}

.mg-performance-item__event-details {
  display: flex;
  flex-direction: column;
}

.mg-performance-item__mobile-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-track-navy, #0f172a);
}

.mg-performance-item__mobile-location {
  font-size: 12px;
  color: var(--color-split-gray, #94a3b8);
}

.mg-performance-item__mobile-time-wrapper {
  text-align: right;
  flex-shrink: 0;
}

.mg-performance-item__mobile-time {
  display: block;
  font-family: var(--font-data-mono, monospace);
  font-weight: 700;
  color: var(--color-track-navy, #0f172a);
}

.mg-performance-item__mobile-time--pb {
  color: var(--color-atletica-blue, #007aff);
}

.mg-performance-item__mobile-trend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.125rem;
  font-size: 10px;
  font-weight: 700;
}

.mg-performance-item__mobile-trend--positive {
  color: var(--color-velocity-cyan, #00e5ff);
}

.mg-performance-item__mobile-trend--negative {
  color: var(--color-error, #ef4444);
}

.mg-performance-item__mobile-trend-icon {
  font-size: 14px;
}

.mg-performance-item__mobile-footer {
  padding-top: 0.5rem;
  border-top: 1px solid rgba(var(--color-split-gray-rgb, 128, 128, 128), 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
}

.mg-performance-item__race-type {
  color: var(--color-split-gray, #94a3b8);
  font-weight: 700;
  text-transform: uppercase;
}

.mg-performance-item__mobile-link {
  color: var(--color-atletica-blue, #007aff);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-transform: uppercase;
  text-decoration: none;
}

.mg-performance-item__mobile-link:hover {
  text-decoration: underline;
}

.mg-performance-item__link-icon {
  font-size: 14px;
}
</style>

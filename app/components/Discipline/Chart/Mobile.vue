<template>
  <div class="mg-disc-chart__mobile">
    <div class="mg-disc-chart__svg-wrapper">
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 100 40"
        class="mg-disc-chart__svg"
      >
        <defs>
          <linearGradient
            :id="gradientId"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#007AFF"
              stop-opacity="0.25"
            />
            <stop
              offset="100%"
              stop-color="#007AFF"
              stop-opacity="0.01"
            />
          </linearGradient>
        </defs>
        <path
          v-if="chartData.length >= 2"
          :d="buildFillPath(chartData)"
          :fill="`url(#${gradientId})`"
        />
        <path
          class="mg-disc-chart__curve"
          :d="buildCurvePath(chartData)"
          fill="none"
          stroke="#007AFF"
          stroke-width="1.5"
        />
      </svg>
      <div
        v-if="chartData.length > 0"
        class="mg-disc-chart__last-dot"
        :style="{
          left: `${getLastPoint(chartData).cx}%`,
          top: `${(getLastPoint(chartData).cy / 40) * 100}%`
        }"
      />
      <div class="mg-disc-chart__year-labels">
        <span
          v-if="chartData.length > 0"
          class="mg-disc-chart__year-label"
        >
          {{ new Date(chartData[0]?.date).getFullYear() }}
        </span>
        <span
          v-if="chartData.length > 0"
          class="mg-disc-chart__year-label"
        >
          {{ new Date(chartData[chartData.length - 1]?.date).getFullYear() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PerformanceCardDataFragment } from "#gql"

interface ChartPoint {
  date: string
  seconds: number
  originalTime: string
  label: string
}

const props = defineProps<{
  discipline: string
  items: (PerformanceCardDataFragment | null)[]
}>()

const gradientId = computed(() => `disc-chart-fill-${props.discipline.replace(/[^a-z0-9]/gi, "-")}`)

function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.trim().split(":")
  if (parts.length === 2) {
    const minutes = Number.parseInt(parts[0] || "0", 10)
    const seconds = Number.parseFloat(parts[1] || "0")
    return minutes * 60 + seconds
  }

  if (parts.length === 3) {
    const hours = Number.parseInt(parts[0] || "0", 10)
    const minutes = Number.parseInt(parts[1] || "0", 10)
    const seconds = Number.parseFloat(parts[2] || "0")
    return hours * 3600 + minutes * 60 + seconds
  }

  return 0
}

const chartData = computed(() => {
  return props.items
    .filter(item => item?.value)
    .map(item => ({
      date: item?.date,
      seconds: parseTimeToSeconds(item?.value || ""),
      originalTime: item?.value || "",
      label: item?.label || ""
    }))
    .toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

function makeSvgScalers(points: ChartPoint[]) {
  const minSec = Math.min(...points.map(p => p.seconds))
  const maxSec = Math.max(...points.map(p => p.seconds))
  const range = maxSec - minSec || 1
  const padX = 2
  const padTop = 5
  const padBottom = 12 // extra space at bottom to avoid overlapping year labels
  const svgX = (i: number) => padX + (i / Math.max(points.length - 1, 1)) * (100 - padX * 2)
  const svgY = (sec: number) => padTop + ((sec - minSec) / range) * (40 - padTop - padBottom)

  return { svgX, svgY }
}

function buildCurvePath(points: ChartPoint[]): string {
  if (points.length === 0) return "M0,20"
  const { svgX, svgY } = makeSvgScalers(points)
  if (points.length === 1) {
    return `M${svgX(0)},${svgY(points[0]?.seconds || 0)}`
  }

  let d = `M${svgX(0)},${svgY(points[0]?.seconds || 0)}`
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = svgX(i)
    const y0 = svgY(points[i]?.seconds || 0)
    const x1 = svgX(i + 1)
    const y1 = svgY(points[i + 1]?.seconds || 0)
    d += ` C${x0 + (x1 - x0) / 3},${y0} ${x1 - (x1 - x0) / 3},${y1} ${x1},${y1}`
  }

  return d
}

function buildFillPath(points: ChartPoint[]): string {
  if (points.length < 2) return ""
  const { svgX, svgY } = makeSvgScalers(points)
  const lastIdx = points.length - 1
  const fillBottom = 30 // stop fill above year labels area
  let d = `M${svgX(0)},${fillBottom} L${svgX(0)},${svgY(points[0]?.seconds || 0)}`
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = svgX(i)
    const y0 = svgY(points[i]?.seconds || 0)
    const x1 = svgX(i + 1)
    const y1 = svgY(points[i + 1]?.seconds || 0)
    d += ` C${x0 + (x1 - x0) / 3},${y0} ${x1 - (x1 - x0) / 3},${y1} ${x1},${y1}`
  }
  d += ` L${svgX(lastIdx)},${fillBottom} Z`
  return d
}

function getLastPoint(points: ChartPoint[]) {
  if (points.length === 0) return { cx: 98, cy: 5 }
  const { svgX, svgY } = makeSvgScalers(points)
  const last = points[points.length - 1]
  return { cx: svgX(points.length - 1), cy: svgY(last?.seconds || 0) }
}
</script>

<style lang="scss" scoped>
.mg-disc-chart {
  &__mobile {
    display: block;

    @include start-from(tablet) {
      display: none;
    }
  }

  &__svg-wrapper {
    position: relative;
    width: 100%;
    height: 6rem;
    background-color: color-mix(in srgb, var(--mg-color-primary) 6%, transparent);
    border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 15%, transparent);
    border-radius: 0.75rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  &__svg {
    width: 100%;
    height: 100%;
  }

  &__curve {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  &__last-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--mg-color-accent);
    border: 2px solid var(--mg-color-accent);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__year-labels {
    position: absolute;
    bottom: 0.375rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 0.375rem;
  }

  &__year-label {
    @include body(4);
    color: var(--mg-color-neutral);
    opacity: 0.6;
    font-weight: 600;
  }
}
</style>

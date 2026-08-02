<template>
  <div class="mg-disc-chart__desktop">
    <canvas
      ref="chartCanvasRef"
      class="mg-disc-chart__canvas"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    />
    <Transition name="tooltip">
      <div
        v-if="tooltip.visible"
        class="mg-disc-chart__tooltip"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y - 64}px` }"
      >
        <span class="mg-disc-chart__tooltip-time">{{ tooltip.time }}</span>
        <span class="mg-disc-chart__tooltip-date">{{ tooltip.date }}</span>
      </div>
    </Transition>
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

interface CanvasCoord {
  x: number
  y: number
  point: ChartPoint
}

const props = defineProps<{
  discipline: string
  items: (PerformanceCardDataFragment | null)[]
}>()

const chartCanvasRef = ref<HTMLCanvasElement | null>(null)
const tooltip = ref({ visible: false, x: 0, y: 0, time: "", date: "" })
const canvasCoords: CanvasCoord[] = []

function parseTimeToSeconds(timeString: string): number {
  const parts = (timeString?.trim() || "").split(":")
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

function drawCanvasChart(canvas: HTMLCanvasElement, points: ChartPoint[]): void {
  if (!canvas || points.length === 0) return
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  const W = rect.width
  const H = rect.height
  const padX = 48
  const padTop = 20
  const padBottom = 40
  const chartW = W - padX * 2
  const chartH = H - padTop - padBottom

  const minSec = Math.min(...points.map(p => p.seconds))
  const maxSec = Math.max(...points.map(p => p.seconds))
  const range = maxSec - minSec || 1

  const cx = (i: number) => padX + (i / Math.max(points.length - 1, 1)) * chartW
  const cy = (sec: number) => padTop + ((sec - minSec) / range) * chartH

  canvasCoords.length = 0
  points.forEach((p, i) => canvasCoords.push({ x: cx(i), y: cy(p.seconds), point: p }))

  ctx.clearRect(0, 0, W, H)

  ctx.strokeStyle = "rgba(0,0,0,0.05)"
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = padTop + (chartH / 4) * i
    ctx.beginPath()
    ctx.moveTo(padX, y)
    ctx.lineTo(W - padX, y)
    ctx.stroke()
  }

  const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH)
  grad.addColorStop(0, "rgba(0,122,255,0.15)")
  grad.addColorStop(1, "rgba(0,122,255,0.01)")

  ctx.beginPath()
  ctx.moveTo(cx(0), padTop + chartH)
  ctx.lineTo(cx(0), cy(points[0]?.seconds || 0))
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = cx(i)
    const y0 = cy(points[i]?.seconds || 0)
    const x1 = cx(i + 1)
    const y1 = cy(points[i + 1]?.seconds || 0)
    ctx.bezierCurveTo(x0 + (x1 - x0) / 3, y0, x1 - (x1 - x0) / 3, y1, x1, y1)
  }
  ctx.lineTo(cx(points.length - 1), padTop + chartH)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()

  ctx.strokeStyle = "#007AFF"
  ctx.lineWidth = 2.5
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(cx(0), cy(points[0]?.seconds || 0))
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = cx(i)
    const y0 = cy(points[i]?.seconds || 0)
    const x1 = cx(i + 1)
    const y1 = cy(points[i + 1]?.seconds || 0)
    ctx.bezierCurveTo(x0 + (x1 - x0) / 3, y0, x1 - (x1 - x0) / 3, y1, x1, y1)
  }
  ctx.stroke()

  points.forEach((p, i) => {
    const x = cx(i)
    const y = cy(p.seconds)
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = "#007aff"
    ctx.fill()
  })

  ctx.fillStyle = "rgba(0,0,0,0.4)"
  ctx.font = "11px system-ui, sans-serif"
  ctx.textAlign = "center"
  const seenYears = new Set<string>()
  points.forEach((p, i) => {
    const year = new Date(p.date).getFullYear().toString()
    if (!seenYears.has(year)) {
      seenYears.add(year)
      ctx.fillText(year, cx(i), H - 10)
    }
  })
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function handleMouseMove(event: MouseEvent): void {
  const canvas = chartCanvasRef.value
  if (!canvas || canvasCoords.length === 0) return

  const rect = canvas.getBoundingClientRect()
  const mx = event.clientX - rect.left
  const my = event.clientY - rect.top
  let nearest = canvasCoords[0]
  let minDist = Number.POSITIVE_INFINITY

  for (const coord of canvasCoords) {
    const dist = Math.hypot(mx - coord.x, my - coord.y)
    if (dist < minDist) {
      minDist = dist
      nearest = coord
    }
  }

  if (minDist < 32) {
    tooltip.value = {
      visible: true,
      x: nearest?.x || 0,
      y: nearest?.y || 0,
      time: nearest?.point?.originalTime || "",
      date: formatDateLabel(nearest?.point?.date || "")
    }
  } else {
    tooltip.value.visible = false
  }
}

function handleMouseLeave(): void {
  tooltip.value.visible = false
}

onMounted(() => {
  if (chartCanvasRef.value) {
    drawCanvasChart(chartCanvasRef.value, chartData.value)

    const observer = new ResizeObserver(() => {
      if (chartCanvasRef.value) {
        drawCanvasChart(chartCanvasRef.value, chartData.value)
      }
    })

    observer.observe(chartCanvasRef.value)
    onUnmounted(() => observer.disconnect())
  }
})

watch(chartData, () => {
  if (chartCanvasRef.value) {
    drawCanvasChart(chartCanvasRef.value, chartData.value)
  }
})
</script>

<style lang="scss" scoped>
.mg-disc-chart {
  &__desktop {
    display: none;

    @include start-from(tablet) {
      display: block;
      position: relative;
      width: 100%;
      height: 22rem;
      margin-bottom: 1.5rem;
    }
  }

  &__canvas {
    width: 100%;
    height: 100%;
    background-color: color-mix(in srgb, var(--mg-color-primary) 3%, transparent);
    border-radius: 0.75rem;
    cursor: crosshair;
  }

  &__tooltip {
    position: absolute;
    background-color: var(--mg-color-secondary);
    color: #ffffff;
    border-radius: 0.5rem;
    padding: 0.5rem 0.875rem;
    pointer-events: none;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-bottom: none;
      border-top-color: var(--mg-color-secondary);
    }
  }

  &__tooltip-time {
    @include body(3);
    font-weight: 700;
    font-family: "Courier New", monospace;
    color: var(--mg-color-accent);
  }

  &__tooltip-date {
    @include body(4);
    color: rgba(255, 255, 255, 0.65);
  }
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="map-shell">
    <div
      ref="mapEl"
      class="map-view"
    />
    <div class="overlay-badge">
      <StravaBadge type="technical">
        GPS TRACKED
      </StravaBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Map as LeafletMap, LatLngTuple } from "leaflet"
import polyline from "@mapbox/polyline"

const props = defineProps<{
  polylineData?: string
}>()

const mapEl = useTemplateRef("mapEl")
const { $L } = useNuxtApp()
let leafletMap: LeafletMap | null = null

const getHaversineDistance = (p1: LatLngTuple, p2: LatLngTuple): number => {
  const R = 6371e3
  const rad = Math.PI / 180

  const dLat = (p2[0] - p1[0]) * rad
  const dLng = (p2[1] - p1[1]) * rad

  const lat1 = p1[0] * rad
  const lat2 = p2[0] * rad

  const a
    = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

const cropPolyline = (
  coords: LatLngTuple[],
  startMetersCut = 500,
  endMetersCut = 0
): LatLngTuple[] => {
  if (coords.length < 2) return coords

  let accumulated = 0
  let startIndex = 0

  for (let i = 1; i < coords.length; i++) {
    accumulated += getHaversineDistance(coords[i - 1] as LatLngTuple, coords[i] as LatLngTuple)
    if (accumulated >= startMetersCut) {
      startIndex = i
      break
    }
  }

  let cropped = coords.slice(startIndex)

  if (endMetersCut > 0 && cropped.length > 2) {
    accumulated = 0
    let endIndex = cropped.length - 1

    for (let i = cropped.length - 2; i >= 0; i--) {
      accumulated += getHaversineDistance(cropped[i] as LatLngTuple, cropped[i + 1] as LatLngTuple)
      if (accumulated >= endMetersCut) {
        endIndex = i
        break
      }
    }

    cropped = cropped.slice(0, endIndex + 1)
  }

  return cropped
}

const initializeMap = () => {
  if (!mapEl.value || !props.polylineData) return

  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }

  try {
    const rawCoords: LatLngTuple[] = polyline
      .decode(props.polylineData)
      .map(([lat, lng]) => [lat, lng])

    const coords = cropPolyline(rawCoords, 500, 500)

    if (!coords.length) return

    leafletMap = $L
      .map(mapEl.value, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
      })
      .setView(coords[0] as LatLngTuple, 13)

    $L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap)

    const track = $L.polyline(coords, {
      color: "#007aff",
      weight: 4,
      opacity: 0.9
    }).addTo(leafletMap)

    leafletMap.fitBounds(track.getBounds(), { padding: [20, 20] })
  } catch (error) {
    console.error("Errore rendering Leaflet:", error)
  }
}

onMounted(() => {
  initializeMap()
})

watch(() => props.polylineData, () => {
  initializeMap()
})

onBeforeUnmount(() => {
  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }
})
</script>

<style lang="scss" scoped>
.map-shell {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-view {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 8;
}

:deep(.leaflet-container) {
  height: 100% !important;
  width: 100% !important;
  background: var(--mg-color-surface-alt);
  z-index: 1;
}
</style>

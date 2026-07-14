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

const initializeMap = () => {
  if (!mapEl.value || !props.polylineData) return

  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }

  try {
    const coords: LatLngTuple[] = polyline
      .decode(props.polylineData)
      .map(([lat, lng]) => [lat, lng])

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

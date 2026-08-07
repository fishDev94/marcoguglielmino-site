<template>
  <ClientOnly>
    <InstagramReelDesktopViewer
      v-if="isDesktop"
      :reels="reels"
    />
    <InstagramReelMobileViewer
      v-else
      :reels="reels"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import type { InstagramReel } from "~~/types/instagram"

defineProps<{
  reels: InstagramReel[]
}>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual("md")
</script>

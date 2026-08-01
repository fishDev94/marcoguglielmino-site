<template>
  <NuxtLayout name="content-wrapper">
    <h1>records</h1>

    <DisciplineSection
      v-for="discipline in disciplines"
      :key="discipline.value"
      :discipline="discipline.value"
      :icon="discipline.icon"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DISCIPLINE } from "@/constants"

const disciplineIcons: Record<string, string> = {
  [DISCIPLINE["800M"]]: "i-material-symbols:mode-fan-off",
  [DISCIPLINE["1000M"]]: "i-material-symbols:mode-fan-off",
  [DISCIPLINE["1500M"]]: "i-material-symbols:track-changes",
  [DISCIPLINE["5000M"]]: "i-material-symbols:track-changes",
  [DISCIPLINE["5kM"]]: "i-material-symbols:directions-run",
  [DISCIPLINE["10KM"]]: "i-material-symbols:map",
  [DISCIPLINE["Half Marathon"]]: "i-material-symbols:flag"
}

const disciplines = Object.values(DISCIPLINE).map(value => ({
  value,
  icon: disciplineIcons[value] ?? "i-material-symbols:directions-run"
}))
</script>

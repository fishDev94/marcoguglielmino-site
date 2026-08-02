<template>
  <NuxtLayout name="default-page">
    <DisciplineSection
      v-for="discipline in Object.values(DISCIPLINES)"
      :key="discipline.value"
      :discipline="discipline.value"
      :icon="discipline.icon || 'i-material-symbols:directions-run'"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DISCIPLINES } from "@/constants"
</script>

<template>
  <NuxtLayout name="default-page">
    <DisciplineSection
      v-for="performance in DISCIPLINES"
      :key="`discipline-${performance?.value}`"
      :performance="getPerformanceByDiscipline(performance.value || '')"
      :discipline-name="performance.value || ''"
      :icon="performance.icon"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { PerformanceCardDataFragment } from "#gql"
import { DISCIPLINES } from "@/constants"

const lang = useCurrentLang()

const { data } = await useAsyncGql("performanceCard", {
  locale: lang
})

const performanceItems = computed(() => {
  return data.value?.performanceCardCollection?.items ?? []
})

const getPerformanceByDiscipline = (discipline: string) => {
  return (
    performanceItems.value.filter(p => p?.discipline === discipline) as PerformanceCardDataFragment[] || []
  )
}
</script>

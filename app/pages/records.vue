<template>
  <NuxtLayout name="content-wrapper">
    <h1>records</h1>
    <PerformanceItem
      v-for="(item, i) in performanceItems"
      :key="i"
      :item="item || {}"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { DISCIPLINE } from "@/constants"

const lang = useCurrentLang()
const { data } = await useAsyncGql("performanceCard", {
  locale: lang,
  discipline: DISCIPLINE["1500M"]
})

const performanceItems = computed(() => {
  return data.value?.performanceCardCollection?.items ?? []
})
</script>

<template>
  <div class="mg-content-card-list">
    <UIContentCard
      v-for="(cardData, id) in data"
      :key="'about-card-data'+id"
      :title="cardData.cardTitle || ''"
      :description="cardData.cardDescription || ''"
      :icon="cardData.iconCard || ''"
      :type="cardData.type || 'dark'"
    />
  </div>
</template>

<script lang="ts" setup>
import type { AboutCardFragment } from "#gql"

defineProps<{
  data: Array<{ type: "dark" | "light" } & AboutCardFragment>
}>()
</script>

<style lang="scss" scoped>
    .mg-content-card-list {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
</style>

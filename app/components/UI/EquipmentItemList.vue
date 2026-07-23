<!-- components/EquipmentCard.vue -->
<template>
  <div class="mg-equipment-list">
    <h4 class="mg-equipment-list__title uppercase">
      <UIcon
        name="i-material-symbols-light-inventory-2"
        class=" mg-equipment-list__icon size-6"
      />
      {{ $t("article.equipment.title") }}
    </h4>

    <div class="mg-equipment-list__list">
      <UIEquipmentItem
        v-for="(item, index) in items"
        :key="`${item.name}+${index}`"
        :name="item.name || ''"
        :short-description="item.shortDescription || ''"
        :img-src="item.image?.url || ''"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EquipmentItemDataFragment } from "#gql"

interface Props {
  items?: EquipmentItemDataFragment[]
}

const { items = [] } = defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-equipment-list {
  background-color: #0F172A; // track-navy
  color: #FFFFFF;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  &__title {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #00E5FF; // velocity-cyan
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__icon {
    font-variation-settings: 'FILL' 1;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem; // Spaziatura se ci sono più item nella lista
  }
}
</style>

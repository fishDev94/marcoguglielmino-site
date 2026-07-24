<!-- components/EquipmentItem.vue -->
<template>
  <div class="mg-equipment-item">
    <div class="mg-equipment-item__image-wrapper">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="name"
        class="mg-equipment-item__image"
      >
      <span
        v-else
        class="material-symbols-outlined mg-equipment-item__placeholder-icon"
      >
        steps
      </span>
    </div>

    <div class="mg-equipment-item__info">
      <p class="mg-equipment-item__name">
        {{ name }}
      </p>
      <p
        v-if="shortDescription"
        class="mg-equipment-item__description"
      >
        {{ shortDescription }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  name?: string
  shortDescription?: string
  imgSrc?: string
}

const {
  name = "Item name",
  shortDescription = "",
  imgSrc = ""
} = defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-equipment-item {
  display: flex;
  align-items: center;
  gap: 1rem;

  &__image-wrapper {
    width: 4rem; // w-16
    height: 4rem; // h-16
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.5rem;
  }

  &__placeholder-icon {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.75rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.25;
    color: var(--mg-btn-text-primary);
  }

  &__description {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 0.25rem;
  }
}
</style>

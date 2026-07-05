<template>
  <UButton
    :ui="{ base: 'px-6' }"
    :class="{
      'mg-button-secondary': isSecondary,
      'font-extrabold': isStrong,
      'mg-button-outlined-light':
        isLight,
      'mg-button-outlined-light--strong': isLight && isStrong
    }"
    :variant
    :color
  >
    <slot>Button</slot>
  </UButton>
</template>

<script setup lang="ts">
const { type = 'primary', isStrong = false } = defineProps<{
  type?: 'primary' | 'secondary' | 'inverted' | 'outlined' | 'outlined-light'
  isStrong?: boolean
}>()

const isSecondary = computed(() => type === 'secondary')
const isOutlined = computed(() => type === 'outlined' || type === 'outlined-light')
const isLight = computed(() => type === 'outlined-light')
const variant = computed(() => (isOutlined.value ? 'outline' : 'solid'))
const color = computed(() => {
  switch (type) {
    case 'primary':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'inverted':
      return 'neutral'
    case 'outlined':
      return 'secondary' // Use secondary color for outlined variant
    case 'outlined-light':
      return 'primary'
    default:
      return 'primary'
  }
})
</script>

<style lang="scss" scoped>
.mg-button-secondary {
    background-color: var(--mg-btn-bg-secondary);
    color: var(--mg-btn-text-secondary);

    &:hover {
        background-color: var(--mg-btn-hover-secondary);
    }
}

.mg-button-outlined-light {
    box-shadow: inset 0 0 0 1px var(--mg-color-surface);
    color: var(--mg-color-surface);

    &--strong {
        box-shadow: inset 0 0 0 2px var(--mg-color-surface);
    }

    &:hover {
        background-color: var(--mg-color-surface);
        color: var(--mg-color-on-surface);
    }
}
</style>

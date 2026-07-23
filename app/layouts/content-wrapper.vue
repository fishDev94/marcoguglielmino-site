<template>
  <div :class="['mg-content-wrapper', { 'mg-content-wrapper--no-padding': disablePadding }]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  disablePadding?: boolean
}

const { disablePadding = false } = defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-content-wrapper {
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: 24px;
  position: relative;
  height: 100%;

  &--no-padding {
    padding: 0 !important;
  }

  @include start-from(tablet) {
    padding-inline: 32px;
  }
}
</style>

<template>
  <div class="mg-perf-event-info">
    <span class="mg-perf-event-info__text">{{ location || title }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    location?: string
    title?: string
  }>(),
  {
    location: undefined,
    title: undefined
  }
)
</script>

<style lang="scss" scoped>
.mg-perf-event-info {
  display: flex;
  flex-direction: column;
  min-width: 0;

  &__text {
    @include body(3);

    color: var(--mg-color-secondary);
    font-weight: 600;
  }
}
</style>

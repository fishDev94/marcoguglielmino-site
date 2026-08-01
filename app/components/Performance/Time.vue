<template>
  <div class="mg-perf-time">
    <span
      class="mg-perf-time__value"
      :class="{ 'mg-perf-time__value--pb': isPb }"
    >
      {{ value }}
    </span>
    <span
      v-if="label && label !== 'none'"
      class="mg-perf-time__label"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string
    label?: string
    isPb?: boolean
  }>(),
  {
    label: undefined,
    isPb: false
  }
)
</script>

<style lang="scss" scoped>
.mg-perf-time {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;

  @include start-from(tablet) {
    text-align: right;
  }

  &__value {
    @include heading(4);
    display: block;
    color: var(--mg-color-on-surface);
    font-weight: 700;

    &--pb {
      color: var(--mg-color-primary);
    }
  }

  &__label {
    @include body(4);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--mg-color-primary) 10%, transparent);
    color: var(--mg-color-primary);

    @include start-from(tablet) {
        display: none;
    }
  }
}
</style>

<template>
  <div class="mg-perf-trend">
    <span
      v-if="trendData"
      class="mg-perf-trend__badge"
      :class="
        trendData.isPositive
          ? 'mg-perf-trend__badge--positive'
          : 'mg-perf-trend__badge--negative'
      "
    >
      <UIcon
        :name="
          trendData.isPositive
            ? 'i-mdi:caret-down'
            : 'i-mdi:caret-up'
        "
        class="mg-perf-trend__icon"
      />
      <span>{{ trendData.text }}</span>
    </span>
    <span
      v-else
      class="mg-perf-trend__empty"
    >—</span>
  </div>
</template>

<script setup lang="ts">
interface TrendData {
  text: string
  isPositive: boolean
}

withDefaults(
  defineProps<{
    trendData?: TrendData | null
  }>(),
  {
    trendData: null
  }
)
</script>

<style lang="scss" scoped>
.mg-perf-trend {
  @include body(4);

  @include start-from(tablet) {
    text-align: center;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;

    &--positive {
      color: var(--mg-color-accent);
    }

    &--negative {
      color: var(--mg-color-error);
    }
  }

  &__icon {
    font-size: 16px;
  }

  &__empty {
    @include body(4);
    color: var(--mg-color-neutral);
  }
}
</style>

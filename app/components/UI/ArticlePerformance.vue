<template>
  <div class="mg-record-card">
    <div
      v-if="showBadge"
      class="mg-record-card__header"
    >
      <span class="mg-record-card__badge">
        {{ cardLabel }}
      </span>
    </div>

    <p class="mg-record-card__value">
      {{ cardValue }}
    </p>

    <p
      v-if="cardComparisonText"
      class="mg-record-card__comparison"
    >
      {{ cardComparisonText }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { PerformanceCardDataFragment } from "#gql"
import { computed } from "vue"

export type RecordBadgeLabel = "Personal Best" | "Seasonal's Best" | "none"

interface Props {
  data?: PerformanceCardDataFragment
}

const {
  data = {
    label: "",
    value: "--:--",
    comparisonText: ""
  }
} = defineProps<Props>()

const cardLabel = computed(() => data.label ?? data.label)
const cardValue = computed(() => data.value ?? data.value)
const cardComparisonText = computed(() => data.comparisonText ?? data.comparisonText)

const showBadge = computed(() => {
  return cardLabel.value && cardLabel.value !== "none"
})
</script>

<style lang="scss" scoped>
.mg-record-card {
  background-color: #E6E8F3;
  border: 1px solid rgba(0, 122, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.75rem;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  &__badge {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #0F172A;
    text-transform: uppercase;
  }

  &__value {
    @include heading(2);

    color: var(--mg-color-primary);
  }

  &__comparison {
    @include body(3);

    color: var(--mg-color-on-surface-variant);
    margin-top: 0.5rem;
    font-weight: 400;
    font-style: italic;
  }
}
</style>

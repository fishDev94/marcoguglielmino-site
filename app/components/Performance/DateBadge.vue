<template>
  <div class="mg-perf-date">
    <div class="mg-perf-date__desktop">
      {{ formatDate(date, lang) }}
    </div>
    <div class="mg-perf-date__mobile">
      <span class="mg-perf-date__month">{{ parseMonthDay(date).month }}</span>
      <span class="mg-perf-date__day">{{ parseMonthDay(date).day }}</span>
      <span class="mg-perf-date__year">{{ parseMonthDay(date).year }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/contentful"

defineProps<{
  date: string
}>()

const lang = useCurrentLang()
</script>

<style lang="scss" scoped>
.mg-perf-date {
  @include body(4);

  color: var(--mg-color-neutral);
  font-weight: 700;
  text-transform: uppercase;

  &__desktop {
    display: none;

    @include start-from(tablet) {
      display: block;
    }
  }

  &__mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background-color: color-mix(in srgb, var(--mg-color-primary) 10%, transparent);
    border-radius: 8px;
    color: var(--mg-btn-text-secondary);

    @include start-from(tablet) {
      display: none;
    }
  }

  &__month {
    @include body(4);

    text-transform: uppercase;
  }

  &__day {
    @include body(1);

    font-weight: 700;
    line-height: 1;
  }

  &__year {
    @include body(4);

    line-height: 0.8;
    font-weight: 500;
  }
}
</style>

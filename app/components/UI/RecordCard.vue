<template>
  <div class="mg-record-card">
    <p class="mg-record-card__race-type">
      {{ cardData.typeOfRace }}
    </p>
    <div class="mg-record-card__race-info">
      <h3 class="mg-record-card__race-title">
        {{ cardData.raceTitle }}
      </h3>
      <p class="mg-record-card__race-time">
        {{ cardData.time }}
      </p>
    </div>
    <USeparator />
    <p class="mg-record-card__race-date">
      <UIcon
        name="i-material-symbols-location-on-outline"
        class="size-3"
      /> {{ cardData.location }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { RecordCardDataFragment } from "#gql"

interface Props {
  cardData: RecordCardDataFragment
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-record-card {
  background-color: var(--mg-btn-bg-inverted);
  padding: 24px;
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 20%, transparent);
  transition-property: transform;
  transition-duration: 150ms;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
  align-items: center;
  text-align: center;

  @include start-from(tablet) {
    align-items: flex-start;
    text-align: left;
    margin: 8px 0;
  }

  &:hover {
    transform: translateY(-8px);
  }

  &__race-type {
    @include body(4);

    text-transform: uppercase;
    color: var(--mg-color-primary);
  }

  &__race-title {
    @include heading(2);

    font-weight: 900;
  }

  &__race-time {
    @include body(2);

    font-weight: 700;
    color: var(--mg-color-primary);
  }

  &__race-date {
    @include body(4);

    display: flex;
    align-content: center;
    gap: 6px;
    font-weight: 400;
  }
}
</style>

<template>
  <div class="mg-card-header">
    <div class="icon-container">
      <UIcon
        :name="activityIcon"
        class="size-5"
      />
    </div>
    <div class="header-content">
      <h3 class="activity-name">
        {{ activityName }}
      </h3>
      <p class="activity-date">
        {{ formattedDate }}
      </p>
    </div>
    <StravaBadge
      v-if="isPersonalBest"
      type="pb"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  activityName: string
  prCount: number
  isWeightTraining: boolean
  startDateLocal: string
}

const { isWeightTraining, prCount, startDateLocal } = defineProps<Props>()

const isPersonalBest = computed(() => prCount && prCount > 0)

const activityIcon = computed(() => {
  return isWeightTraining ? "i-material-symbols-fitness-center-rounded" : "i-mdi-run"
})
const formattedDate = computed(() => {
  const date = new Date(startDateLocal)
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome"
  }).format(date)
})
</script>

<style lang="scss" scoped>
.mg-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .icon-container {
      background-color: var(--mg-color-secondary);
      color: #ffffff;
      width: 40px;
      height: 40px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-content {
      flex: 1;

      .activity-name {
        @include heading(4);
        color: var(--mg-color-on-surface);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: -0.02em;
      }

      .activity-date {
        @include body(4);
        color: var(--mg-color-neutral);
        text-transform: capitalize;
        margin-top: 2px;
      }
    }
  }
</style>

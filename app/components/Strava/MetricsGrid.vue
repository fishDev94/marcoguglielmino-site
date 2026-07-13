<template>
  <div class="metrics-grid">
    <!-- Se è pesi, mostriamo Suffer Score invece di Distanza -->
    <div class="metric-item">
      <span class="label">{{ isWeightTraining ? 'SUFFER SCORE' : 'DISTANZA' }}</span>
      <p class="value">
        <span class="number">{{ isWeightTraining ? (sufferScore || 0) : formattedDistance(distance) }}</span>
        <span class="unit">{{ isWeightTraining ? '' : 'km' }}</span>
      </p>
    </div>

    <div class="divider" />

    <!-- Se è pesi, mostriamo Temp o Heartrate invece di Passo -->
    <div class="metric-item">
      <span class="label">{{ isWeightTraining ? 'BPM MEDI' : 'PASSO' }}</span>
      <p class="value">
        <span class="number">
          {{ isWeightTraining ? Math.round(averageHeartrate || 0) : formattedPace(averageSpeed) }}
        </span>
        <span class="unit">{{ isWeightTraining ? 'bpm' : '/km' }}</span>
      </p>
    </div>

    <div class="divider" />

    <div class="metric-item">
      <span class="label">TEMPO</span>
      <p class="value">
        <span class="number">{{ formattedMovingTime(movingTime) }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  isWeightTraining: boolean
  averageHeartrate: number
  averageSpeed: number
  movingTime: number
  sufferScore: number
  distance: number
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.metrics-grid {
    background-color: var(--mg-color-surface-alt);
    border-radius: 4px;
    display: flex;
    padding: 12px;
    justify-content: space-around;
    align-items: center;

    .metric-item {
      text-align: left;
      flex: 1;
      padding: 0 8px;

      .label {
        @include body(4);
        color: var(--mg-color-neutral);
        display: block;
        margin-bottom: 4px;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .value {
        margin: 0;
        white-space: nowrap;

        .number {
          @include heading(4);
          color: var(--mg-color-primary);
          font-size: 18px;
        }

        .unit {
          @include body(3);
          color: var(--mg-color-primary);
          margin-left: 4px;
          font-size: 12px;
        }
      }
    }

    .divider {
      width: 1px;
      height: 24px;
      background-color: var(--mg-color-outline);
      opacity: 0.5;
    }
  }
</style>

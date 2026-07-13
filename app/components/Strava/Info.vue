<template>
  <div class="mg-gym-view">
    <div class="gym-bg-icon">
      <UIcon
        name="i-material-symbols-monitoring"
        class="size-40"
      />
    </div>
    <div
      v-if="averageHeartrate"
      class="hr-stats"
    >
      <div class="hr-item">
        <span class="hr-label">MEDIA</span>
        <span class="hr-value">
          {{ Math.round(averageHeartrate || 0) }}
          <small>BPM</small>
        </span>
      </div>
      <div class="hr-divider" />
      <div class="hr-item">
        <span class="hr-label">MAX</span>
        <span class="hr-value">
          {{ maxHeartrate }}
          <small>BPM</small>
        </span>
      </div>
    </div>
    <div
      v-else
      class="no-map-msg"
    >
      <UIcon
        name="i-material-symbols-timer-outline"
        class="size-40"
      />
      <span>Sessione Indoor</span>
    </div>
    <div class="overlay-badge">
      <StravaBadge type="technical">
        SENSOR TRACKED
      </StravaBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  averageHeartrate?: number
  maxHeartrate: number
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-gym-view {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(135deg, var(--mg-color-surface-alt) 0%, #ecedf9 100%);

    .gym-bg-icon {
        position: absolute;
        font-size: 120px;
        color: var(--mg-color-primary);
        opacity: 0.04;
        z-index: 0;
        user-select: none;
        display: flex;
        align-items: center;
    }

    .hr-stats {
        display: flex;
        align-items: center;
        gap: 24px;
        z-index: 1;

        .hr-item {
            text-align: center;

            .hr-label {
                @include body(4);
                color: var(--mg-color-neutral);
                display: block;
                margin-bottom: 4px;
                font-size: 10px;
            }

            .hr-value {
                @include heading(3);
                color: var(--mg-color-on-surface);
                font-size: 28px;

                small {
                    font-size: 12px;
                    color: var(--mg-color-neutral);
                    margin-left: 2px;
                }
            }
        }

        .hr-divider {
            width: 1px;
            height: 40px;
            background-color: var(--mg-color-outline);
            opacity: 0.3;
        }
    }

    .no-map-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--mg-color-neutral);
        @include body(4);
        gap: 8px;
        z-index: 1;
    }
}

.overlay-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    z-index: 10;
}
</style>

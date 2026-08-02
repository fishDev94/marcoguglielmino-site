<template>
  <div class="mg-disc-header">
    <!-- Mobile layout -->
    <div class="mg-disc-header__mobile">
      <div class="mg-disc-header__mobile-left">
        <h3 class="mg-disc-header__mobile-title">
          {{ discipline }}
        </h3>
        <p class="mg-disc-header__mobile-pb">
          Personal Best: {{ personalBest }}
        </p>
      </div>
      <div class="mg-disc-header__mobile-sb">
        <span>Season Best: {{ seasonBest }}</span>
      </div>
    </div>

    <!-- Desktop layout -->
    <div class="mg-disc-header__desktop">
      <div class="mg-disc-header__left">
        <UIcon
          v-if="icon"
          :name="icon"
          class="mg-disc-header__icon"
        />
        <h2 class="mg-disc-header__title">
          {{ discipline }}
        </h2>
      </div>
      <div class="mg-disc-header__right">
        <div class="mg-disc-header__pb">
          <span class="mg-disc-header__pb-label">Personal Best</span>
          <span class="mg-disc-header__pb-value">{{ personalBest }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  discipline: string
  personalBest: string
  seasonBest: string
  icon?: string
}>()
</script>

<style lang="scss" scoped>
.mg-disc-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;

  @include start-from(tablet) {
    background-color: var(--mg-color-secondary);
  }

  &__mobile {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 0.75rem;

    @include start-from(tablet) {
      display: none;
    }
  }

  &__mobile-left {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  &__mobile-title {
    @include heading(3);
    color: var(--mg-color-secondary);
    margin: 0;
  }

  &__mobile-pb {
    @include body(3);
    font-weight: 700;
    color: var(--mg-color-primary);
    margin: 0;
  }

  &__mobile-sb {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.625rem;
    background-color: color-mix(in srgb, var(--mg-color-accent) 12%, transparent);
    color: var(--mg-color-accent);
    border-radius: 0.5rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__desktop {
    display: none;

    @include start-from(tablet) {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
        padding: 1rem 1.5rem;
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--mg-color-primary);

    @include start-from(tablet) {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  &__title {
    @include heading(3);
    color: var(--mg-color-on-primary, #ffffff);
    margin: 0;

    @include start-from(tablet) {
      @include heading(2);
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 1rem;

    @include start-from(tablet) {
      gap: 1.5rem;
    }
  }

  &__pb {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  &__pb-label {
    @include body(4);
    color: color-mix(in srgb, var(--mg-color-on-primary, #ffffff) 60%, transparent);
    text-transform: uppercase;
    margin: 0;

    @include start-from(tablet) {
      @include body(3);
    }
  }

  &__pb-value {
    @include heading(4);
    color: var(--mg-color-accent);
    font-family: "Courier New", monospace;
    margin: 0.25rem 0 0 0;

    @include start-from(tablet) {
      @include heading(3);
    }
  }

  &__sb-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    background-color: var(--mg-color-accent);
    color: var(--mg-color-primary);
    border-radius: 0.375rem;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;

    @include start-from(tablet) {
      padding: 0.625rem 0.875rem;
      font-size: 0.8125rem;
    }
  }
}
</style>

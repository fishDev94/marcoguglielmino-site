<template>
  <section :class="['mg-about-card', { 'mg-about-card--light': isLight }]">
    <div class="mg-about-card__header">
      <UIcon
        :name="icon"
        :class="['mg-about-card__icon', 'size-8', { 'mg-about-card__icon--light': isLight }]"
      />
      <h3 class="mg-about-card__title">
        {{ title }}
      </h3>
    </div>
    <p class="mg-about-card__body">
      {{ description }}
    </p>
  </section>
</template>

<script setup lang="ts">
const { title, description = "", icon = "", type = "light" } = defineProps<{
  title: string
  description?: string
  icon?: string
  type?: "dark" | "light"
}>()

const isLight = computed(() => type === "light")
</script>

<style lang="scss" scoped>
.mg-about-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    border-left: 4px solid var(--mg-color-accent);
    border-radius: 4px;
    background-color: var(--mg-color-secondary);
    color: var(--mg-btn-text-primary);
    box-shadow: 0 0 8px color-mix(in srgb, var(--mg-color-secondary) 15%, transparent);

    @include start-from(medium-desktop) {
        width: 400px;
        padding: 32px;
        align-items: flex-start;
    }

    &--light {
        border-left: 4px solid var(--ui-primary);
        background-color: var(--mg-color-surface-alt);
        color: var(--mg-color-on-surface);
    }

    &__icon {
        color: var(--mg-color-accent);

        &--light {
            color: var(--ui-primary);
        }
    }

    &__header {
        display: flex;
        align-items: center;
        gap: 12px;

        @include start-from(medium-desktop) {
            flex-direction: column;
            align-items: flex-start
        }
    }

    &__title {
        @include heading(4);

        @include start-from(medium-desktop) {
            @include heading(3);
        }
    }

    &__body {
        @include body(2);
    }
}
</style>

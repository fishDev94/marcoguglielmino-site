<template>
  <NuxtLink
    :to="href"
    target="_blank"
    rel="noopener noreferrer"
    class="mg-social-card"
  >
    <div class="mg-social-card__header">
      <div :class="['mg-social-card__icon-wrapper', iconBackgroundClass]">
        <span
          class="material-symbols-outlined mg-social-card__icon"
          style="font-variation-settings: 'FILL' 1"
        >
          <UIcon
            :name="icon"
            class="size-7"
          />
        </span>
      </div>
      <span class="material-symbols-outlined mg-social-card__arrow">
        <UIcon name="i-material-symbols-arrow-outward" />
      </span>
    </div>

    <div class="mg-social-card__body">
      <h3 class="mg-social-card__title">
        {{ title }}
      </h3>
      <p class="mg-social-card__description">
        {{ description }}
      </p>
    </div>

    <div class="mg-social-card__action">
      {{ actionLabel }}
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
interface Props {
  title: string
  description: string
  actionLabel: string
  href: string
  icon: string
  iconBackgroundClass?: string
}

const props = defineProps<Props>()
const icon = computed(() => props.title === "Instagram" ? "i-mdi-instagram" : "i-bi-strava")
</script>

<style lang="scss" scoped>
.mg-social-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 16rem; /* h-64 */
  padding: 2rem; /* p-8 */
  background-color: #ffffff;
  border: 1px solid rgba(116, 119, 129, 0.2); /* border-split-gray/20 using --mg-color-neutral */
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* hover:shadow-xl */
    transform: translateY(-0.25rem); /* hover:-translate-y-1 */

    .mg-social-card__arrow {
      transform: translate(0.25rem, -0.25rem); /* group-hover:translate-x-1 group-hover:-translate-y-1 */
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__icon-wrapper {
    padding: 0.75rem; /* p-3 */
    border-radius: 0.75rem; /* rounded-xl */
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;

    /* Fallback/Default background gradients & brand colors mapped via helper classes if needed */
    &--instagram {
      background: linear-gradient(to top right, #facc15, #ef4444, #9333ea);
    }

    &--strava {
      background-color: #fc6719;
    }
  }

  &__icon {
    display: grid;
    place-items: center;
  }

  &__arrow {
    color: var(--mg-color-neutral);
    transition: transform 0.2s ease-in-out;
  }

  &__body {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--mg-color-secondary); /* Track Navy */
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--mg-color-on-surface-variant);
  }

  &__action {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--mg-color-primary); /* Atletica Blue */
  }
}
</style>

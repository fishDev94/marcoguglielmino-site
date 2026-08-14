<template>
  <div class="mg-contact-detail">
    <div
      v-if="icon"
      class="mg-contact-detail__icon-wrapper"
    >
      <span class="material-symbols-outlined mg-contact-detail__icon">
        <UIcon
          :name="icon"
          class="size-6"
        />
      </span>
    </div>

    <div class="mg-contact-detail__content">
      <p class="mg-contact-detail__label">
        {{ label }}
      </p>
      <a
        v-if="href"
        :href="href"
        class="mg-contact-detail__value mg-contact-detail__value--link"
      >
        {{ value }}
      </a>
      <p
        v-else
        class="mg-contact-detail__value"
      >
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label: string
  value: string
  href?: string
  icon?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.mg-contact-detail {
  display: flex;
  align-items: flex-start;
  gap: 1rem; /* gap-4 */

  &__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem; /* p-3 */
    background-color: var(--mg-color-surface-alt); /* bg-secondary-container */
    border-radius: 0.5rem; /* rounded-lg */
  }

  &__icon {
    display: grid;
    place-items: center;
    color: var(--mg-color-primary); /* text-atletica-blue */
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em; /* tracking-wider */
    color: var(--mg-color-neutral); /* Split Gray */
    margin-bottom: 0.25rem; /* mb-1 */
  }

  &__value {
    font-family: monospace; /* font-data-mono */
    color: var(--mg-color-secondary); /* Track Navy */
    text-decoration: none;

    &--link {
      transition: color 0.2s ease-in-out;

      &:hover {
        color: var(--mg-color-primary); /* Atletica Blue */
      }
    }
  }
}
</style>

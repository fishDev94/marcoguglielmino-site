<template>
  <button :class="['mg-button', `mg-button--${type}`]">
    <slot>Button</slot>
  </button>
</template>

<script setup lang="ts">
const { type = 'primary' } = defineProps<{
  type?: 'primary' | 'secondary' | 'inverted' | 'outlined'
}>()
</script>

<style lang="scss" scoped>
.mg-button {
    @include body(3);

    padding: 0.625rem 1.25rem;
    cursor: pointer;

    @include start-from(desktop) {
        @include body(2);

        padding: 0.75rem 1.5rem;
    }

    &--primary {
        background-color: var(--mg-btn-bg-primary);
        color: var(--mg-btn-text-primary);

        &:hover {
            background-color: var(--mg-btn-hover-primary);
        }
    }

    &--secondary {
        background-color: var(--mg-btn-bg-secondary);
        color: var(--mg-btn-text-secondary);

        &:hover {
            background-color: var(--mg-btn-hover-secondary);
        }
    }

    &--inverted {
        background-color: var(--mg-btn-text-secondary);
        color: var(--mg-btn-bg-secondary);

        &:hover {
            background-color: var(--mg-btn-hover-inverted);
        }
    }

    &--outlined {
        background-color: transparent;
        outline: 2px solid var(--mg-btn-text-secondary);
        outline-offset: -2px;
        color: var(--mg-btn-text-secondary);

        &:hover {
            background-color: var(--mg-btn-hover-outlined);
        }
    }
}
</style>

<template>
  <div class="mg-hero-label skew-highlight uppercase text-(--mg-btn-text-primary) mb-6">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
    .mg-hero-label {
        @include body(3);

        font-weight: 800;
        background-color: var(--ui-primary);
        flex: 0 0 auto;
        width: max-content;
        padding: 0.5rem 1rem;

        @include start-from(medium-desktop) {
            margin-bottom: 24px;
        }
    }

    .skew-highlight {
            transform: skewX(-12deg);
        }
</style>

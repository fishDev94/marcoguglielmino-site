<template>
  <div class="mg-content-page-hero">
    <p
      v-if="pageData.label"
      class="mg-content-page-hero__label"
    >
      <span class="mg-content-page-hero__line hidden md:block" />
      {{ pageData.label }}
    </p>
    <h1 class="mg-content-page-hero__title">
      {{ pageData.title }}
    </h1>
    <p class="mg-content-page-hero__description">
      {{ pageData.subTitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ContentPageDataFragment } from "#gql"

defineProps<{
  pageData: ContentPageDataFragment
}>()
</script>

<style lang="scss" scoped>
.mg-content-page-hero {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-block: 24px;

    @include start-from(tablet) {
      gap: 16px;
      margin-block: 24px;
    }

    &__line {
    background-color: var(--mg-color-primary);
    height: 2px;
    width: 36px;
  }

    &__label {
        @include body(2);

        display: none;
        color: var(--mg-color-primary);
        font-weight: 600;

        @include start-from(tablet) {
          display: flex;
          gap: 8px;
          align-items: center;
          text-transform: uppercase;
        }
    }

    &__title {
    @include heading(2);

    @include start-from(tablet) {
      @include heading(1);
    }
  }

  &__description {
    @include body(2);

    @include start-from(tablet) {
      @include body(1);

      width: 50%;
    }
  }
}
</style>

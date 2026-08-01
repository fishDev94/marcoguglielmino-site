<template>
  <NuxtLayout
    name="content-wrapper"
    disable-padding
  >
    <div :class="['mg-article-layout', marginClass, paddingClass, mobileOrderClass]">
      <section class="mg-article-layout__main-section">
        <slot name="main" />
      </section>
      <aside class="mg-article-layout__aside">
        <slot name="side" />
      </aside>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
interface Props {
  margin?: "auto" | "no-margin"
  padding?: "auto" | "no-padding"
  mobileSidePosition?: "top" | "bottom"
}

const { margin = "auto", padding = "auto", mobileSidePosition = "bottom" } = defineProps<Props>()

const marginClass = computed(() => margin === "no-margin" ? "mg-article-layout--no-margin" : "")
const paddingClass = computed(() => padding === "no-padding" ? "mg-article-layout--no-padding" : "")
const mobileOrderClass = computed(() => mobileSidePosition === "top" ? "mg-article-layout--side-top" : "")
</script>

<style lang="scss" scoped>
$mobile-padding: 24px;

.mg-article-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: $mobile-padding;

  &--no-margin {
    margin: 0 !important;
  }

  &--no-padding {
    padding: 0 !important;
  }

  &--side-top {
    .mg-article-layout__aside {
      order: -1;
    }

    @include start-from(medium-desktop) {
      .mg-article-layout__aside {
        order: unset;
      }
    }
  }

  :deep(.mg-richtext__img) {
    margin-left: -$mobile-padding;
    margin-right: -$mobile-padding;
    width: calc(100% + (#{$mobile-padding} * 2));
    max-width: none;
    border-radius: 0;

    @include start-from(medium-desktop) {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      border-radius: 0.75rem;
    }
  }

  @include start-from(medium-desktop) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 1.5rem;
  }

  &__main-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: 1024px) {
      grid-column: span 8 / span 8;
    }
  }

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 1024px) {
      grid-column: span 4 / span 4;
      position: sticky;
      top: 6rem;
      height: fit-content;
    }
  }
}
</style>

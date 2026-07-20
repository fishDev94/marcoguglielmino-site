<template>
  <div :class="['mg-top-section', `mg-top-section--${background}`]">
    <NuxtLayout name="content-wrapper">
      <header class="mg-top-section__header">
        <div class="mg-top-section__title-section">
          <h2 class="mg-top-section__title uppercase md:capitalize">
            {{ title }}
          </h2>
        </div>
        <NuxtLinkLocale
          v-if="linkTo"
          class="mg-top-section__link"
          :to="{ name: linkTo }"
        >
          <p>{{ link }}</p>
          <UIcon name="i-material-symbols-arrow-forward" />
        </NuxtLinkLocale>
      </header>
      <p class="mg-top-section__description">
        {{ description }}
      </p>
      <div class="mg-top-section__body">
        <UICarousel :carousel-item-size="carouselItemSize">
          <template v-if="isLoading">
            <component
              :is="skeletonCard"
              v-for="n in itemCount"
              :key="`${n}+loading-card`"
            />
          </template>
          <template v-else>
            <slot />
          </template>
        </UICarousel>
      </div>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { LAST_ACTIVITIES_PER_PAGE } from "~/constants/index.ts"
import ActivityCardSkeleton from "./Strava/ActivityCardSkeleton.vue"

interface Props {
  sectionName: string
  linkTo?: string
  isLoading?: boolean
  skeletonCard?: Component
  itemCount?: number
  background: "default-white" | "secondary-dark" | "surface-light-grey"
  carouselItemSize?: string
}

const {
  sectionName,
  linkTo = undefined,
  isLoading = true,
  skeletonCard = ActivityCardSkeleton,
  itemCount = LAST_ACTIVITIES_PER_PAGE,
  carouselItemSize = undefined
} = defineProps<Props>()
const i18nModuleName = computed(() => `top_sections.${sectionName}`)

const title = computed(() =>
  $t(`${i18nModuleName.value}.title`, "Section Title")
)
const description = computed(() =>
  $t(`${i18nModuleName.value}.description`, "Section Description")
)
const link = computed(() => $t(`${i18nModuleName.value}.link`, ""))
</script>

<style lang="scss" scoped>
.mg-top-section {
  padding-block: 24px;
  background-color: var(--mg-btn-bg-inverted);

  &--default-white {
    background-color: var(--mg-btn-bg-inverted);
  }

  &--secondary-dark {
    background-color: var(--mg-color-secondary);

    .mg-top-section {
      &__title {
        color: var(--mg-btn-text-primary);
      }

      &__description {
        color: var(--mg-btn-text-primary);
      }

      &__link {
        color: var(--mg-color-accent);
      }
    }

    :deep(button) {
      background-color: var(--mg-color-accent);
      color: var(--mg-color-secondary);
    }
  }

  &--surface-light-grey {
    background-color: var(--mg-color-surface-alt);
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    @include heading(4);

    display: flex;
    align-items: center;
    line-height: 1.6rem;
    border-left: 4px solid var(--color-primary);
    padding-left: 1rem;
    margin-top: 8px;

    @include start-from(tablet) {
      @include heading(3);

      font-weight: 700;
      gap: 8px;
      padding: 0;
      border: unset;
    }
  }

  &__description {
    @include body(4);

    font-weight: 400;
    margin-top: 16px;

    @include start-from(tablet) {
      @include body(2);

      margin-top: 8px;
    }
  }

  &__link {
    @include body(4);

    height: max-content;
    align-self: flex-end;
    display: flex;
    align-content: center;
    gap: 2px;
    color: var(--ui-primary);

    & > p {
      width: max-content;
    }
  }

  &__body {
    margin-top: 16px;
  }

  &__card {
    min-width: 0;

    @include start-from(tablet) {
      margin-block: 4px;
    }
  }
}
</style>

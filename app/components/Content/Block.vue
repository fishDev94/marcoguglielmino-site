<template>
  <section
    :class="['mg-content-block', `mg-content-block--${contentData.background}`]"
  >
    <NuxtLayout name="content-wrapper">
      <article
        :class="[
          'mg-content-block__main',
          `mg-content-block__main--${contentData.contentAlignment}`
        ]"
      >
        <div class="mg-content-block__text-content">
          <h2
            :class="[
              'mg-content-block__title',
              'uppercase',
              `mg-content-block__title--${contentData.contentAlignment}`
            ]"
          >
            <span class="mg-content-block__line hidden md:block" />
            {{ contentData.title }}
          </h2>
          <RichTextRenderer
            v-if="contentData.bodyDescription?.json"
            :custom-rich-text-json="contentData.bodyDescription?.json"
          />
        </div>
        <ContentCardList
          v-if="contentCardList.length"
          :data="contentCardList"
        />
      </article>
      <UICarousel
        v-if="contentData.carousel?.items.length"
        class="mg-content-block__carousel-section"
      >
        <component
          :is="COMPONENTS_MAP[cardData?.__typename]"
          v-for="(cardData, i) in validContentCarouselCardList"
          :key="`${cardData?.__typename}-card+${i}`"
          :card-data
        />
      </UICarousel>
      <slot />
    </NuxtLayout>
  </section>
</template>

<script lang="ts" setup>
import type { AboutCardDataFragment, ContentBlockDataFragment } from "#gql"
import { COMPONENTS_MAP } from "~/constants/components"

type CardWithTypename = {
  __typename: keyof typeof COMPONENTS_MAP
}

const { contentData } = defineProps<{
  contentData: ContentBlockDataFragment
}>()

const contentCardList = computed(() => {
  return contentData.cards?.items as Array<
    { type: "light" | "dark" } & AboutCardDataFragment
  >
})

const validContentCarouselCardList = computed(() =>
  contentData.carousel?.items.filter(
    (cardData): cardData is typeof cardData & CardWithTypename =>
      cardData?.__typename !== undefined
  )
)
</script>

<style lang="scss" scoped>
.mg-content-block {
  background-color: var(--mg-btn-bg-inverted);

  &--default-white {
    background-color: var(--mg-btn-bg-inverted);
  }

  &--secondary-dark {
    background-color: var(--mg-color-secondary);
  }

  &--surface-light-grey {
    background-color: var(--mg-color-surface-alt);
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-block: 24px;
    margin: 0 auto;

    @include start-from(tablet) {
      padding-block: 38px;
      flex-direction: row;
    }

    &--center {
      @include start-from(tablet) {
        justify-content: center;
        padding-bottom: 16px;
      }
    }
  }

  &__line {
    background-color: var(--ui-primary);
    height: 2px;
    width: 48px;
  }

  &__title {
    @include heading(4);

    display: flex;
    align-items: center;
    line-height: 1.6rem;
    border-left: 4px solid var(--color-primary);
    padding-left: 1rem;
    margin-top: 8px;

    &--center {
      border: 0;
      width: 100%;
      justify-content: center;
      padding: 0;

      & > span {
        display: none;
      }
    }

    @include start-from(tablet) {
      @include heading(3);

      font-weight: 700;
      gap: 8px;
      padding: 0;
      border: unset;
    }
  }

  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__carousel-section {
    padding-bottom: 38px;
  }

  :deep(.mg-carousel__scollable-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: unset;
    margin-inline: 0;

    & > * {
      width: 100%;
    }

    @include start-from(tablet) {
      display: grid;
      flex-direction: unset;
      align-items: unset;
      width: fit-content;
      max-width: 100%;
      margin-inline: auto;

      & > * {
        width: auto;
      }
    }
  }

  :deep(.mg-carousel) {
    margin-inline: 0;

    @include start-from(tablet) {
      margin-inline: unset;
    }
  }

  :deep(.mg-record-card) {
    width: 100%;

    @include start-from(tablet) {
      width: 280px;
    }
  }

  :deep(.mg-carousel__button-container) {
    display: none;

    @include start-from(tablet) {
      display: flex;
    }
  }
}
</style>

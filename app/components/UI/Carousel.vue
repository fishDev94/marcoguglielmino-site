<template>
  <div class="mg-carousel">
    <div
      v-if="shouldShowArrows"
      class="mg-carousel__button-container"
    >
      <UButton
        :class="[
          'mg-carousel__button-container__arrow-left',
          'rounded-full',
          { 'arrow-visible': isPrevDisabled }
        ]"
        icon="lucide:chevron-left"
        size="md"
        variant="solid"
        color="primary"
        :disabled="isPrevDisabled"
        @click="handleScroll()"
      />
      <UButton
        :class="[
          'mg-carousel__button-container__arrow-right',
          'rounded-full',
          { 'arrow-visible': isNextDisabled }
        ]"
        icon="lucide:chevron-right"
        size="md"
        color="primary"
        :disabled="isNextDisabled"
        @click="handleScroll('right')"
      />
    </div>
    <div
      ref="scollable-content"
      class="mg-carousel__scollable-content grid"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FIRST_ELEMENT, INIT_REF_NUMBER } from "@/constants"

const scrollableContent = useTemplateRef("scollable-content")
const cardWidth = computed(
  () =>
    scrollableContent.value?.children[FIRST_ELEMENT]?.clientWidth
    || INIT_REF_NUMBER
)
const { isNextDisabled, isPrevDisabled, shouldShowArrows, handleScroll }
  = useScrollable(scrollableContent, cardWidth)
</script>

<style lang="scss" scoped>
.mg-carousel {
  position: relative;

  &__button-container {
    display: none;
    position: absolute;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    z-index: 2;
    pointer-events: none;

    @include start-from(tablet) {
      display: flex;
    }
  }

  &__scollable-content {
    grid-auto-flow: column;
    grid-auto-columns: calc(100% - 18px);
    gap: 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    scroll-behavior: smooth;
    max-width: 100%;
    width: 100%;

    @include start-from(tablet) {
      grid-auto-columns: max-content;
      width: fit-content;
      margin-inline: auto;
    }

    & > * {
      scroll-snap-align: start;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

:deep(.mg-carousel__button-container__arrow-left) {
  position: relative;
  left: -16px;
  pointer-events: all;
  cursor: pointer;
}

:deep(.mg-carousel__button-container__arrow-right) {
  position: relative;
  right: -16px;
  pointer-events: all;
  cursor: pointer;
}

:deep(.arrow-visible) {
  visibility: hidden;
}

.grid {
  gap: 16px;
  display: grid;
}
</style>

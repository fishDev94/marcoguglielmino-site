<template>
  <div class="mg-hero">
    <HeroLoading v-if="loading" />
    <div
      v-else
      class="mg-hero__content"
    >
      <NuxtImg
        class="mg-hero__background"
        :src
      />
      <div class="mg-hero__overlay" />
      <NuxtLayout name="content-wrapper">
        <div class="mg-hero__text-content">
          <HeroLabel>{{ label }}</HeroLabel>
          <h1 class="mg-hero__title">
            {{ title }}:
          </h1>
          <h2 class="mg-hero__kicker">
            {{ kicker }}
          </h2>
          <p class="mg-hero__copy">
            {{ copy }}
          </p>
          <div class="mg-hero__cta-buttons">
            <UIButton
              v-for="(button, index) in buttons"
              :key="`cta-button+${index}`"
              :type="button.typeButton"
              :is-strong="button.isButtonStrong || false"
            >
              {{ button.text }}
            </UIButton>
          </div>
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CtaButtonFragment } from "#gql"
import type { ButtonType } from "../UI/Button.vue"

const {
  src = "",
  label = "",
  copy = "",
  ctaButtons = []
} = defineProps<{
  title: string
  kicker: string
  src?: string
  label?: string
  copy?: string
  ctaButtons?: CtaButtonFragment[]
}>()
const loading = ref(false)
const buttons = computed(
  () => ctaButtons as Array<{ typeButton: ButtonType } & CtaButtonFragment>
)
</script>

<style lang="scss" scoped>
.mg-hero {
  &__content {
    position: relative;
    height: 460px;

    @include start-from(tablet) {
      height: 640px;
    }
  }

  &__background {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    top: 0;
    background-color: color-mix(
      in srgb,
      var(--mg-color-secondary) 40%,
      transparent
    );
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: absolute;
    bottom: 0;
    z-index: 1;
    margin-bottom: 32px;

    @include start-from(tablet) {
      gap: 0;
      justify-content: center;
      height: 100%;
      bottom: unset;
    }
  }

  &__title {
    @include heading(1);

    text-transform: uppercase;
    color: var(--mg-btn-text-primary);
    display: none;

    @include start-from(tablet) {
      display: unset;
    }
  }

  &__kicker {
    @include heading(2);

    font-weight: 800;
    font-style: italic;
    color: var(--mg-btn-text-primary);
    text-transform: uppercase;

    @include start-from(tablet) {
      @include heading(1);

      color: var(--mg-color-accent);
      margin-bottom: 24px;
    }
  }

  &__copy {
    display: none;

    @include start-from(tablet) {
      @include body(2);

      font-weight: 600;
      display: unset;
      color: var(--mg-btn-text-primary);
      max-width: 480px;
      margin-bottom: 24px;
    }
  }

  &__cta-buttons {
    display: flex;
    gap: 16px;
  }
}
</style>

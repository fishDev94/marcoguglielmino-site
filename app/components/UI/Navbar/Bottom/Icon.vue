<template>
  <NuxtLinkLocale
    class="mg-navbar-button"
    :to="{ name: page }"
  >
    <div class="mg-navbar-button__content">
      <UIcon
        :name
        :class="['mg-navbar-button__icon', 'size-6', { 'mg-navbar-button__icon--active': isActive }]"
      />
      <p :class="['mg-navbar-button__text', { 'mg-navbar-button__text--active': isActive }]">
        {{ page }}
      </p>
    </div>
  </NuxtLinkLocale>
</template>

<script lang="ts" setup>
const route = useRoute()

const { page } = defineProps<{
  page: string
}>()

const isActive = computed(() => {
  const routeNameWithoutLocale = String(route.name).split("_")[0]

  return routeNameWithoutLocale === page
})
const name = computed(() => {
  if (page === "home") {
    return "i-material-symbols-home-outline"
  } else if (page === "records") {
    return "i-uis-graph-bar"
  } else if (page === "blog") {
    return "i-quill-paper"
  } else if (page === "strava") {
    return "i-mdi-run"
  }

  return "i-mdi-run"
})
</script>

<style lang="scss" scoped>
   .mg-navbar-button {
    display: grid;
    place-content: center;

    padding: 16px;

    &__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
    }

    &__icon {
        color: var(--mg-btn-text-secondary);

        &--active {
            color: var(--ui-primary);
        }
    }

    &__text {
        @include body(4);

        text-transform: capitalize;
        color: var(--mg-btn-text-secondary);

        &--active {
            color: var(--ui-primary);
        }
    }
   }
</style>

<template>
  <div class="mg-nav-icons">
    <NuxtLink
      class="mg-nav-icons__link"
      :to="{ name: 'strava' }"
    >
      <UIcon
        name="i-mdi-run"
        class="mg-nav-icons__icon size-6 text-white"
      />
    </NuxtLink>
    <NuxtLink
      class="mg-nav-icons__link"
      :to="{ name: 'gallery' }"
    >
      <UIcon
        name="i-boxicons-camera"
        :class="['mg-nav-icons__icon', 'size-6', { 'text-(--ui-primary)': isActive, 'text-white': !isActive }]"
      />
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const isActive = computed(() => route.path === "/gallery")
</script>

<style lang="scss" scoped>
.mg-nav-icons {
  display: none;

  @include start-from(medium-desktop) {
      display: flex;
      gap: 16px;
  }

  &__link {
    height: 24px;
  }

  &__icon {
    cursor: pointer;
  }
}
</style>

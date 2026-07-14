<template>
  <div class="mg-nav-menu">
    <UNavigationMenu
      highlight
      highlight-color="primary"
      orientation="horizontal"
      :items
    />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    class: "font-bold not-focus:text-white aria-[current=page]:text-(--ui-primary)"
  },
  {
    label: "Records",
    to: "/records",
    class: "font-bold not-focus:text-white aria-[current=page]:text-(--ui-primary)"
  },
  {
    label: "Blog",
    to: "/blog",
    class: "font-bold not-focus:text-white aria-[current=page]:text-(--ui-primary)"
  },
  {
    label: "Gallery",
    to: "/gallery",
    class: "font-bold not-focus:text-white aria-[current=page]:text-(--ui-primary)"
  }
])
</script>

<style lang="scss" scoped>
    .mg-nav-menu {
        display: none;

        @include start-from(tablet) {
            display: unset;
        }
    }
</style>

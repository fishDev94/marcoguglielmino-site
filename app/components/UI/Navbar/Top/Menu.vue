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
interface Props {
  internalLinks: Awaited<ReturnType<typeof useAsyncFooterData>>["internalLinks"]
}

const props = defineProps<Props>()

const items = computed(() =>
  props.internalLinks.value?.map((link) => {
    return {
      label: link?.title as string,
      to: link?.url as string,
      class:
        "font-bold not-focus:text-white aria-[current=page]:text-(--ui-primary)"
    }
  })
)
</script>

<style lang="scss" scoped>
.mg-nav-menu {
  display: none;

  @include start-from(tablet) {
    display: unset;
  }
}
</style>

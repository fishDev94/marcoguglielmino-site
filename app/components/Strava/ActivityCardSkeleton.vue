<template>
  <UCard
    class="mg-activity-card-skeleton"
    variant="solid"
  >
    <template #header>
      <div class="flex items-center gap-4">
        <USkeleton class="size-12 rounded-md" />

        <div class="grid gap-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </template>

    <USkeleton class="h-40 w-full" />

    <template #footer>
      <USkeleton class="h-16 w-full" />
    </template>
  </UCard>
</template>

<style lang="scss" scoped>
.mg-activity-card-skeleton {
    background-color: #ffffff;
    border: 1px solid var(--mg-color-outline);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    width: 100%;

    @include start-from(tablet) {
    width: 320px;
  }
}
</style>

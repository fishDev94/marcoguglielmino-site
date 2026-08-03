<template>
  <div class="mg-blog-card-skeleton">
    <div class="mg-blog-card-skeleton__image">
      <USkeleton class="h-full w-full" />
    </div>
    <div class="mg-blog-card-skeleton__content">
      <USkeleton class="h-3 w-[80px]" />
      <USkeleton class="h-5 w-[85%]" />
      <USkeleton class="h-4 w-[95%]" />
      <USkeleton class="h-4 w-[60%]" />
      <div class="mg-blog-card-skeleton__footer">
        <USkeleton class="size-8 rounded-full" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mg-blog-card-skeleton {
  background-color: var(--mg-color-surface-lowest, #ffffff);
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 15%, transparent);
  overflow: hidden;

  &__image {
    height: 192px;
    width: 100%;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    padding-top: 8px;
  }
}
</style>

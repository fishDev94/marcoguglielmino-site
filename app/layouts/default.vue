<template>
  <div class="mg-default-layout">
    <UINavbarTop />
    <div class="mg-default-layout__content">
      <slot />
    </div>
    <MGFooter />
    <UINavbarBottom />
  </div>
</template>

<style lang="scss" scoped>
  .mg-default-layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;

    &__content {
      flex-grow: 1;
    }
  }
</style>

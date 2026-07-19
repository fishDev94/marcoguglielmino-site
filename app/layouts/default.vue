<template>
  <div class="mg-default-layout">
    <UINavbarTop />
    <main class="mg-default-layout__content">
      <slot />
    </main>
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

<template>
  <div class="mg-slug-page-main">
    <NuxtLayout name="default-page" />
  </div>
</template>

<style lang="scss" scoped>
  .mg-slug-page-main {
    padding-bottom: 36px;

    :deep(h1) {
      font-size: 36px;
    }

    :deep(.mg-content-page-hero__description) {
      font-size: 14px;
      line-height: 1.4;
    }
  }
</style>

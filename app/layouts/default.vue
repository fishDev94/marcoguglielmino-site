<template>
  <div class="mg-default-layout">
    <UINavbarTop
      :footer-data
      :avatar-data
    />
    <main class="mg-default-layout__content">
      <slot />
    </main>
    <MGFooter :footer-data />
    <UINavbarBottom />
  </div>
</template>

<script setup lang="ts">
const [footerData, avatarData] = await Promise.all([
  useAsyncFooterData(),
  useAsyncAvatarData()
])
</script>

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

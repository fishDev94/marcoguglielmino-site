<template>
  <div class="mg-navbar-bottom">
    <UINavbarBottomIcon
      v-for="page in bottomNavList"
      :key="page"
      :page
    />
  </div>
</template>

<script lang="ts" setup>
const bottomNavList = [
  "home", "performance", "blog", "gallery"
]
</script>

<style lang="scss" scoped>
    .mg-navbar-bottom {
        height: 72px;
        background-color: var(--mg-btn-bg-inverted);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding-inline: 16px;
        box-shadow: 0 0 10px 1px color-mix(in srgb, var(--mg-color-secondary) 15%, transparent);
        position: sticky;
        bottom: 0;
        z-index: 11;

        @include start-from(tablet) {
            display: none;
        }
    }
</style>

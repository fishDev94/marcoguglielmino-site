<template>
  <nav class="mg-top-nav-bar">
    <NuxtLayout name="content-wrapper">
      <div class="mg-top-nav-bar__content h-16">
        <NuxtLink
          class="mg-top-nav-bar__left"
          to="/"
        >
          <UILogo />
          <h1 class="mg-top-nav-bar__title" />
        </NuxtLink>
        <UINavbarTopMenu />
        <UIAvatar />
        <UINavbarTopNavigationIcons />
      </div>
    </NuxtLayout>
  </nav>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.mg-top-nav-bar {
  width: 100%;
  background-color: var(--mg-color-secondary);
  min-height: 64px;
  position: sticky;
  top: 0;
  z-index: 9;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include start-from(tablet) {
      gap: 24px;
    }
  }

  &__left {
    display: flex;
    gap: 16px;
    cursor: pointer;

    @include start-from(tablet) {
      gap: 24px;
    }
  }

  &__title {
    @include heading(3);

    text-transform: uppercase;
    font-style: italic;
    color: var(--mg-btn-text-primary);

    &:before {
      content: "Marco G.";
    }

    @include start-from(tablet) {
      @include heading(3);

      text-transform: none;

      &:before {
        content: "Marco Guglielmino";
      }
    }
  }
}
</style>

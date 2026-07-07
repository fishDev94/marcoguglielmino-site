<template>
  <nav class="mg-top-nav-bar h-16">
    <NuxtLink
      class="mg-top-nav-bar__left"
      to="/"
    >
      <UILogo />
      <h1 class="mg-top-nav-bar__title" />
    </NuxtLink>
    <UINavMenu />
    <UIAvatar />
    <UINavIcons />
  </nav>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.mg-top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--mg-color-secondary);
  padding-inline: var(--mg-navbar-padding-mobile-x);

  &__left {
    display: flex;
    gap: 16px;
    cursor: pointer;

    @include start-from(medium-desktop) {
    gap: 24px;
  }
  }

  @include start-from(medium-desktop) {
    padding-inline: var(--mg-navbar-padding-desktop-x);
    gap: 24px;
  }

  &__title {
    @include heading(3);

    text-transform: uppercase;
    font-style: italic;
    color: var(--mg-btn-text-primary);

    &:before {
      content: "Marco G.";
    }

    @include start-from(medium-desktop) {
      @include heading(3);

      text-transform: none;

      &:before {
        content: "Marco Guglielmino";
      }
    }
  }
}
</style>

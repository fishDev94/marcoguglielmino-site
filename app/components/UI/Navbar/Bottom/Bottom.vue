<template>
  <div class="mg-navbar-bottom">
    <UINavbarBottomIcon page="home" />
    <UINavbarBottomIcon page="records" />
    <UINavbarBottomIcon page="blog" />
    <UINavbarBottomIcon page="strava" />
  </div>
</template>

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
        z-index: 9;

        @include start-from(medium-desktop) {
            display: none;
        }
    }
</style>

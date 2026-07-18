<template>
  <div class="mg-content-wrapper">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.mg-content-wrapper {
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: 24px;
  position: relative;
  height: 100%;

  @include start-from(tablet) {
    padding-inline: 32px;
  }
}
</style>

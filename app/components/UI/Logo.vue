<template>
  <Logo class="mg-logo" />
</template>

<script lang="ts" setup>
import Logo from "@/assets/svg/logo.svg"
</script>

<style lang="scss" scoped>
.mg-logo {
    display: block;
    width: 24px;
    height: 24px;
    flex-shrink: 0;

    :deep(path) {
        fill: var(--mg-navbar-logo-color) !important;
    }
}
</style>

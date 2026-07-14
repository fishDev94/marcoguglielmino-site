<template>
  <div class="mg-avatar rounded-lg">
    <img
      :src
      :alt="title"
    >
  </div>
</template>

<script lang="ts" setup>
const { src, title } = await useAsyncAvatarData()
</script>

<style lang="scss" scoped>
.mg-avatar {
    display: grid;
    place-content: center;
    overflow: hidden;
    border: 2px solid var(--ui-primary);
    width: 32px;
    height: 32px;

    @include start-from(tablet) {
        display: none;
    }
}
</style>

<template>
  <div class="mg-avatar rounded-lg">
    <NuxtImg
      provider="contentful"
      :src
      :alt="title"
      width="32"
      height="32"
      format="webp"
      quality="75"
      loading="lazy"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  src: string
  title: string
}

defineProps<Props>()
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

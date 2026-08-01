<template>
  <div class="mg-perf-reference">
    <NuxtLink
      v-if="blogReference"
      :to="`/blog/${blogReference}`"
      class="mg-perf-reference__link"
    >
      <span class="mg-perf-reference__text">Read Post</span>
      <UIcon name="i-material-symbols-arrow-forward-rounded" />
    </NuxtLink>
    <span
      v-else
      class="mg-perf-reference__empty"
    >No Report</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    blogReference?: string
  }>(),
  {
    blogReference: undefined
  }
)
</script>

<style lang="scss" scoped>
.mg-perf-reference {
  @include body(4);
  color: var(--mg-color-primary);

  @include start-from(tablet) {
    text-align: right;
  }

  &__link {
    color: var(--mg-color-primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem;
    text-transform: uppercase;

    @include start-from(tablet) {
      text-transform: none;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  &__empty {
    @include body(4);
    color: var(--mg-color-neutral);
    cursor: not-allowed;
  }
}
</style>

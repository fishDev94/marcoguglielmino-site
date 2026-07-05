<template>
  <div>
    <h1 class="my-text">
      {{ test?.testCollection?.items[0]?.title }}
    </h1>
    <div class="button-content">
      <UIButton
        type="primary"
        is-strong
      >
        Primary
      </UIButton>
      <UIButton type="secondary">
        Secondary
      </UIButton>
      <UIButton type="inverted">
        Inverted
      </UIButton>
      <UIButton type="outlined">
        Outlined
      </UIButton>
      <UIButton
        type="outlined-light"
        is-strong
      >
        Outlined Light
      </UIButton>
    </div>
    <UISearchBar />
  </div>
</template>

<script setup lang="ts">
const { data: test } = await useAsyncGql({
  operation: "test",
  variables: { title: "test-test" },
  options: {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }
})
</script>

<style lang="scss" scoped>
.my-text {
  @include heading(1);
}

.button-content {
  display: flex;
  gap: 4px;
}
</style>

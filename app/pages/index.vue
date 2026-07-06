<template>
  <div>
    <h1 class="my-text">
      {{ data?.homepageCollection?.items[0]?.title }}
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
const { data } = await useAsyncGql({
  operation: "homepage",
  variables: { slug: "homepage" },
  options: {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }
})

console.log("data", data)
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

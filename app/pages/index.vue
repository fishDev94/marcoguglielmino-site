<template>
  <div>
    <h1 class="my-text">
      {{ homepageData?.title }}
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
    <RichTextRenderer
      :custom-rich-text-json="bodyDescription"
    />
  </div>
</template>

<script setup lang="ts">
const { homepageData, bodyDescription } = await useAsyncHomepageData()

console.log("test")
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

<template>
  <div class="mg-homepage">
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
    <NuxtLink to="error">error page</NuxtLink>
    <AboutCardList :data="aboutCardList" />
  </div>
</template>

<script setup lang="ts">
const { homepageData, bodyDescription, aboutCardList } = await useAsyncHomepageData()

definePageMeta({
  name: "home"
})
</script>

<style lang="scss" scoped>
.mg-homepage {
  padding: 16px;
}

.my-text {
  @include heading(1);
}

.button-content {
  display: flex;
  gap: 4px;
}
</style>

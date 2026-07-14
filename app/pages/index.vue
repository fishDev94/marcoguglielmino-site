<template>
  <div class="mg-homepage">
    <Hero
      :src="homepageData.heroBackground?.url || ''"
      :title="homepageData.title || ''"
      :kicker="homepageData.kicker || ''"
      :copy="homepageData.copy || ''"
      :cta-buttons
    />
    <!-- <div class="button-content">
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
    </div> -->
    <UISearchBar />
    <!-- <RichTextRenderer
      :custom-rich-text-json="bodyDescription"
    /> -->
    <!-- <NuxtLink to="error">error page</NuxtLink> -->
    <AboutCardList :data="aboutCardList" />
  </div>
</template>

<script setup lang="ts">
import type { CtaButtonFragment } from "#gql"

const {
  homepageData,
  // bodyDescription,
  aboutCardList } = await useAsyncHomepageData()

const ctaButtons = computed(() => homepageData.value.ctaButton?.items as CtaButtonFragment[])

definePageMeta({
  name: "home"
})
</script>

<style lang="scss" scoped>
.mg-homepage {
}

.button-content {
  display: flex;
  gap: 4px;
}
</style>

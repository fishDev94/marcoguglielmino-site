<template>
  <section class="mg-content-block">
    <article class="mg-content-block__main-content">
      <h2 class="mg-content-block__title uppercase">
        <span class="mg-content-block__line hidden md:block" />
        {{ contentData.title }}
      </h2>
      <RichTextRenderer :custom-rich-text-json="contentData.bodyDescription?.json" />
    </article>
    <ContentCardList :data="contentCardList" />
  </section>
</template>

<script lang="ts" setup>
import type { AboutCardFragment, ContentBlockFragment } from "#gql"

const { contentData } = defineProps<{
  contentData: ContentBlockFragment
}>()

const contentCardList = computed(() => {
  return contentData.cards?.items as Array<{ type: "light" | "dark" } & AboutCardFragment>
})
</script>

<style lang=scss scoped>
.mg-content-block {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 16px;

    @include start-from(tablet) {
        padding: 38px 24px;
        flex-direction: row;
    }

    &__line {
        background-color: var(--ui-primary);
        height: 2px;
        width: 48px;
    }

    &__title {
        @include heading(4);

        display: flex;
        align-items: center;
        line-height: 1.6rem;
        border-left: 4px solid var(--color-primary);
        padding-left: 1rem;
        margin-top: 8px;

        @include start-from(tablet) {
            @include heading(3);

            font-weight: 700;
            gap: 8px;
            padding: 0;
            border: unset;
        }
    }

    &__main-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
}
</style>

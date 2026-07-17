<template>
  <section class="mg-content-block">
    <NuxtLayout
      name="content-wrapper"
    >
      <article class="mg-content-block__main">
        <div class="mg-content-block__text-content">
          <h2 class="mg-content-block__title uppercase">
            <span class="mg-content-block__line hidden md:block" />
            {{ contentData.title }}
          </h2>
          <RichTextRenderer :custom-rich-text-json="contentData.bodyDescription?.json" />
        </div>
        <ContentCardList :data="contentCardList" />
      </article>
    </NuxtLayout>
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
    &__main {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding-block: 24px;
        margin: 0 auto;

        @include start-from(tablet) {
            padding-block: 38px;
            flex-direction: row;
        }
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

    &__text-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
}
</style>

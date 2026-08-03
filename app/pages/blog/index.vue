<template>
  <NuxtLayout name="content-wrapper">
    <main class="mg-articles">
      <UBreadcrumb
        :items="breadcrumbItems"
        :ui="{ link: 'text-xs md:text-sm' }"
      />
      <header class="mg-articles__header">
        <h1 class="mg-articles__title">
          {{ $t("articles.title") }}
        </h1>
        <p class="mg-articles__description">
          {{ $t("articles.description") }}
        </p>
      </header>
      <USeparator class="mb-[12px] lg:hidden md:mb-[36px]" />
      <section class="mg-articles__result-list">
        <NuxtLayout
          name="article-layout"
          margin="no-margin"
          padding="no-padding"
          mobile-side-position="top"
        >
          <template #side>
            <div class="mg-articles__search-engine">
              <UISearchBar v-model="searchQuery" />
              <div class="mg-articles__filters">
                <UBadge
                  v-for="(tag, i) in tags"
                  :key="`${tag?.tagValue}+${i}`"
                  class="mg-articles__filter cursor-pointer"
                  :color="isTagActive(tag?.tagValue).color"
                  :variant="isTagActive(tag?.tagValue).variant"
                  @click="toggleFilter(tag?.tagValue || '')"
                >
                  {{ tag?.tagName }}
                </UBadge>
              </div>
            </div>
          </template>
          <template #main>
            <ArticleCardGrid
              v-if="articles && !isLoading"
              :articles
            />

            <div
              v-else
              class="mg-articles__skeleton-grid"
            >
              <ArticleCardSkeleton
                v-for="n in 6"
                :key="`article-skeleton-${n}`"
              />
            </div>

            <UPagination
              v-model="currentPage"
              :total
              :items-per-page="12"
              class="mg-articles__pagination"
            />
          </template>
        </NuxtLayout>
      </section>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { TagDataFragment } from "#gql"
import type { BreadcrumbItem } from "@nuxt/ui"
import { PAGE_SIZE } from "@/constants"

const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: "Home",
    to: "/"
  },
  {
    label: "Blog",
    to: "/blog"
  }
]

const {
  searchQuery,
  activeFilters,
  isFilterSelected,
  toggleFilter,
  currentPage,
  limit,
  skip
} = useUrlSearchEngine({ pageSize: PAGE_SIZE })

const { articles, total, isLoading } = useArticlesData({
  searchQuery,
  filters: computed(() => activeFilters.value.length ? activeFilters.value : null),
  limit,
  skip
})

const { tags } = useTagsData()
const isTagActive = (
  tagValue: TagDataFragment["tagValue"]
): { variant: "solid" | "soft", color: "primary" | "neutral" } => {
  return {
    variant: isFilterSelected(tagValue) ? "solid" : "soft",
    color: isFilterSelected(tagValue) ? "primary" : "neutral"
  }
}
</script>

<style lang="scss" scoped>
.mg-articles {
  padding: 24px 0;

  &__header {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    @include start-from(tablet) {
      margin-bottom: 24px;
    }
  }

  &__title {
    @include heading(2);

    @include start-from(tablet) {
      @include heading(1);
    }
  }

  &__description {
    @include body(2);

    @include start-from(tablet) {
      @include body(1);
    }
  }

  &__search-engine {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__filter {
    padding: 0 12px;
    border-radius: 8px;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  &__skeleton-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @include start-from(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include start-from(large-desktop) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  :deep(.mg-article-layout) {
    max-width: unset;
  }
}
</style>

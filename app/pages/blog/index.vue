<template>
  <div>
    <UBreadcrumb
      :items="breadcrumbItems"
      :ui="{ link: 'text-xs md:text-sm' }"
    />
    <h1>blog</h1>
    <UISearchBar v-model="searchQuery" />
    <UBadge
      v-for="(tag, i) in tags"
      :key="`${tag?.tagValue}+${i}`"
      class="cursor-pointer"
      :variant="isTagActive(tag?.tagValue)"
      @click="setFilter(tag?.tagValue || '')"
    >
      {{ tag?.tagName }}
    </UBadge>
    <div style="display: flex; flex-direction: column;">
      <NuxtLinkLocale
        v-for="(article, i) in articles"
        :key="`${article?.slug}+${i}`"
        :to="{ name: 'blog-post-page',
               params: {
                 slug: article?.slug
               } }"
      >
        {{ article?.title }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TagDataFragment } from "#gql"
import type { BreadcrumbItem } from "@nuxt/ui"

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

const { articles, isLoading, searchQuery, setFilter, isFilterSelected } = useArticlesData()

const { tags } = useTagsData()
const isTagActive = (tagValue: TagDataFragment["tagValue"]) => {
  return isFilterSelected(tagValue) ? "solid" : "soft"
}

watch(isLoading, (val) => {
  if (!val) {
    console.log(articles.value)
  }
}, { immediate: true })
</script>

<template>
  <div>
    <UBreadcrumb
      :items="breadcrumbItems"
      :ui="{ link: 'text-xs md:text-sm' }"
    />
    <h1>blog</h1>
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

const { articles, isLoading } = useArticlesData()

watch(isLoading, (val) => {
  if (!val) {
    console.log(articles.value)
  }
}, { immediate: true })
</script>

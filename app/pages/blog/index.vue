<template>
  <div>
    <UBreadcrumb
      :items="breadcrumbItems"
      :ui="{ link: 'text-xs md:text-sm' }"
    />
    <h1>blog</h1>
    <NuxtLinkLocale
      :to="{ name: 'blog-post-page',
             params: {
               slug: '10k-valencia-2026'
             } }"
    >
      test to valencia
    </NuxtLinkLocale>
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
</script>

<template>
  <ArticleCard :article />
</template>

<script lang="ts" setup>
import type { BlogCardFragment } from "#gql"

defineProps<{
  article: BlogCardFragment
}>()
</script>

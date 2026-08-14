<template>
  <ArticleCard
    v-if="article?.slug"
    :article
    dimension="wide"
  />
</template>

<script lang="ts" setup>
const { articleSlug } = defineProps<{
  articleSlug: string
}>()

const { article } = await useAsyncArticleData(articleSlug || "", { showError: false })
</script>

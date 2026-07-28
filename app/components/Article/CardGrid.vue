<template>
  <div class="mg-article-card-grid">
    <template
      v-for="(article, i) in articles"
      :key="`${article?.slug}+${i}`"
    >
      <ArticleCard
        v-if="article"
        :article
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogCardFragment } from "#gql"

defineProps<{
  articles: BlogCardFragment[]
}>()
</script>

<style lang="scss" scoped>
.mg-article-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @include start-from(tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include start-from(medium-desktop) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include start-from(large-desktop) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

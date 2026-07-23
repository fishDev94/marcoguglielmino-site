<template>
  <section>
    <h1>{{ blogPostData.title }}</h1>
    <RichTextRenderer
      v-if="bodyDescription"
      :custom-rich-text-json="bodyDescription.json"
      :links="bodyDescription.links"
    />
  </section>
</template>

<script lang="ts" setup>
const route = useRoute()

const { slug } = route.params

console.log("blog slug", slug)

const {
  blogPostData,
  isLoading,
  galleryData,
  bodyDescription,
  equipmentCollection,
  performance,
  error
} = await useAsyncBlogPostData(String(slug))
</script>

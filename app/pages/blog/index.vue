<template>
  <div>
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

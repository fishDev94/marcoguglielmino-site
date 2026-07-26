<template>
  <Html
    :lang="i18nHead.htmlAttrs?.lang"
    :dir="i18nHead.htmlAttrs?.dir"
  >
    <Head>
      <template
        v-for="link in i18nHead.link"
        :key="link.key"
      >
        <Link
          :id="link.key"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template
        v-for="meta in i18nHead.meta"
        :key="meta.key"
      >
        <Meta
          :id="meta.key"
          :property="meta.property"
          :content="meta.content"
        />
      </template>
    </Head>
    <Body>
      <UApp>
        <NuxtLoadingIndicator color="var(--mg-color-primary)" />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UApp>
    </Body>
  </Html>
</template>

<script setup lang="ts">
const i18nHead = useLocaleHead({ seo: true })
</script>

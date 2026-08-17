<template>
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
    <UApp :locale="locales[locale]">
      <NuxtLoadingIndicator color="var(--mg-color-primary)" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </Body>
</template>

<script setup lang="ts">
import * as locales from "@nuxt/ui/locale"

const { locale } = useI18n()

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

const i18nHead = useLocaleHead({ seo: true })

useHead({
  htmlAttrs: {
    lang,
    dir
  }
})

useSchemaOrg([
  defineWebSite({ name: "Marco Guglielmino" }),
  definePerson({ name: "Marco Guglielmino", url: "https://www.marcoguglielmino.com" })
])
</script>

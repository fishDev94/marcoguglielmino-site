<template>
  <div class="mg-default-layout">
    <UINavbarTop
      :footer-data
      :avatar-data
    />
    <main class="mg-default-layout__content">
      <slot />
    </main>
    <MGFooter :footer-data />
    <UINavbarBottom />
  </div>
</template>

<script setup lang="ts">
type FooterDataReturn = Awaited<ReturnType<typeof useAsyncFooterData>>
type AvatarDataReturn = Awaited<ReturnType<typeof useAsyncAvatarData>>

const [footerResult, avatarResult] = await Promise.allSettled([
  useAsyncFooterData(),
  useAsyncAvatarData()
])

const footerData: FooterDataReturn = footerResult.status === "fulfilled"
  ? footerResult.value
  : { footerData: computed(() => undefined), isLoading: ref(false), isError: ref(undefined), internalLinks: computed(() => undefined), externalLinks: computed(() => undefined) } as FooterDataReturn

const avatarData: AvatarDataReturn = avatarResult.status === "fulfilled"
  ? avatarResult.value
  : { src: computed(() => ""), title: computed(() => "") }

if (footerResult.status === "rejected") {
  console.error("[default layout] Failed to load footer data:", footerResult.reason)
}
if (avatarResult.status === "rejected") {
  console.error("[default layout] Failed to load avatar data:", avatarResult.reason)
}
</script>

<style lang="scss" scoped>
  .mg-default-layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;

    &__content {
      flex-grow: 1;
    }
  }
</style>

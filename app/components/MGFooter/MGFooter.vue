<template>
  <footer class="mg-footer">
    <div class="mg-footer__header">
      <h3 class="mg-footer__title uppercase">
        {{ footerData.mainTitle }}
      </h3>
      <p class="mg-footer__copy md:hidden">
        {{ footerData.copy }}
      </p>
      <p class="mg-footer__copyright--desktop hidden md:block">
        {{ footerData.copyright }}
      </p>
    </div>
    <nav aria-label="Footer navigation">
      <UFooterColumns :columns />
    </nav>
    <USeparator
      color="info"
      class="mb-8 md:hidden"
    />
    <section class="mg-footer__bottom">
      <p class="mg-footer__copyright">
        {{ footerData.copyright }}
      </p>
    </section>
  </footer>
</template>

<script lang="ts" setup>
import type { FooterColumn } from "@nuxt/ui"

const { footerData } = await useAsyncFooterData()

const columns: FooterColumn[] = [
  { label: "Navigation", children: [] },
  { label: "Social", children: [] }]

footerData.value.navigationLinks?.items.forEach((item) => {
  columns[0]?.children?.push({
    label: item?.title as string,
    to: item?.url as string,
    target: item?.isExternal ? "_blank" : null
  })
})

footerData.value.socialLinks?.items.forEach((item) => {
  columns[1]?.children?.push({
    label: item?.title as string,
    to: item?.url as string,
    target: item?.isExternal ? "_blank" : null
  })
})
</script>

<style lang="scss" scoped>
  .mg-footer {
    background-color: var(--mg-color-secondary);
    width: 100%;
    padding: 3rem 1.5rem;

    @include start-from(tablet) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 64px;
      padding-block: 1.5rem;
    }

    &__header {
      margin-bottom: 32px;

      @include start-from(tablet) {
        max-width: 35%;
      }
    }

    &__title {
      @include heading(3);

      color: var(--mg-btn-text-primary);
      margin-bottom: 8px;

      @include start-from(tablet) {
        margin-bottom: 16px;
      }
    }

    &__copy {
      @include body(2);

      color: color-mix(in srgb, var(--mg-btn-text-primary) 60%, transparent);
    }

    &__copyright {
      @include body(3);

      display: flex;
      justify-content: center;

      @include start-from(tablet) {
        display: none;
      }
    }

    &__copyright--desktop {
      @include body(3);
    }
  }
</style>

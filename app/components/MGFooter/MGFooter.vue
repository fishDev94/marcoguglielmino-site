<template>
  <footer class="mg-footer">
    <header class="mg-footer__header">
      <h3 class="mg-footer__title">
        {{ footerData.mainTitle }}
      </h3>
      <p class="mg-footer__copy">
        {{ footerData.copy }}
      </p>
    </header>
  </footer>
</template>

<script lang="ts" setup>
const { footerData } = await useAsyncFooterData()
console.log("footer", footerData.value)
</script>

<style lang="scss" scoped>
  .mg-footer {
    background-color: var(--mg-color-secondary);
    width: 100%;
    padding: 3rem 1.5rem 6rem;

    &__header {
      margin-bottom: 32px;
    }

    &__title {
      @include heading(3);

      color: var(--mg-btn-text-primary);
      margin-bottom: 8px;
    }

    &__copy {
      @include body(2);

      color: color-mix(in srgb, var(--mg-btn-text-primary) 60%, transparent);
    }
  }
</style>

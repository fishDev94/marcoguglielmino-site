<template>
  <NuxtLayout
    name="content-wrapper"
    disable-padding
  >
    <div class="mg-article-layout">
      <section class="mg-article-layout__main-section">
        <slot name="main" />
      </section>
      <aside class="mg-article-layout__aside">
        <slot name="right-side" />
      </aside>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
$mobile-padding: 24px;

.mg-article-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: $mobile-padding;

  :deep(.mg-richtext__img) {
    margin-left: -$mobile-padding;
    margin-right: -$mobile-padding;
    width: calc(100% + (#{$mobile-padding} * 2));
    max-width: none;
    border-radius: 0;

    @include start-from(medium-desktop) {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      border-radius: 0.75rem;
    }
  }

  @include start-from(medium-desktop) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 1.5rem;
  }

  &__main-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* Corrisponde a space-y-stack-md */

    @media (min-width: 1024px) {
      grid-column: span 8 / span 8; /* Prende 8 colonne su 12 */
    }
  }

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 2rem; /* Corrisponde a space-y-8 */

    @media (min-width: 1024px) {
      grid-column: span 4 / span 4; /* Prende 4 colonne su 12 */

      /* Opzionale ma consigliato per i blog post:
         mantiene la sidebar visibile durante lo scroll del contenuto principale */
      position: sticky;
      top: 6rem; /* Distanza dall'alto per non sovrapporsi all'header fisso */
      height: fit-content;
    }
  }
}
</style>

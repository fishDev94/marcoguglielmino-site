<template>
  <nav
    v-if="prev || next"
    class="mg-article-paginator"
    :aria-label="$t('article.paginator.aria_label')"
  >
    <!-- Post Precedente -->
    <NuxtLinkLocale
      v-if="prev"
      :to="`/blog/${prev.slug}`"
      class="mg-article-paginator__link mg-article-paginator__link--prev"
    >
      <UIcon
        name="i-material-symbols-arrow-back-rounded"
        class="mg-article-paginator__icon"
      />
      <div class="mg-article-paginator__info">
        <span class="mg-article-paginator__label">
          {{ $t('article.paginator.previous') }}
        </span>
        <span class="mg-article-paginator__title">
          {{ prev.title }}
        </span>
      </div>
    </NuxtLinkLocale>
    <div
      v-else
      class="mg-article-paginator__placeholder"
    />

    <!-- Post Successivo -->
    <NuxtLinkLocale
      v-if="next"
      :to="`/blog/${next.slug}`"
      class="mg-article-paginator__link mg-article-paginator__link--next"
    >
      <div class="mg-article-paginator__info">
        <span class="mg-article-paginator__label">
          {{ $t('article.paginator.next') }}
        </span>
        <span class="mg-article-paginator__title">
          {{ next.title }}
        </span>
      </div>
      <UIcon
        name="i-material-symbols-arrow-forward-rounded"
        class="mg-article-paginator__icon"
      />
    </NuxtLinkLocale>
  </nav>
</template>

<script setup lang="ts">
export interface PaginatorItem {
  title: string
  slug: string
}

defineProps<{
  prev?: PaginatorItem | null
  next?: PaginatorItem | null
}>()
</script>

<style lang="scss" scoped>
.mg-article-paginator {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
  border-top: 1px solid color-mix(in srgb, var(--mg-btn-text-primary) 15%, transparent);
  margin-top: 16px;

  @include start-from(medium-desktop) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    transition: color 0.2s ease;

    @include start-from(medium-desktop) {
      max-width: 48%;
      width: auto;
    }

    &:hover {
      .mg-article-paginator__title {
        color: var(--mg-color-primary);
      }

      .mg-article-paginator__icon {
        color: var(--mg-color-primary);
      }
    }

    &--prev {
      &:hover .mg-article-paginator__icon {
        transform: translateX(-4px);
      }
    }

    &--next {
      text-align: right;
      justify-content: flex-end;

      .mg-article-paginator__title {
        margin-left: auto;
      }

      @include start-from(medium-desktop) {
        margin-left: auto;
      }

      &:hover .mg-article-paginator__icon {
        transform: translateX(4px);
      }
    }
  }

  &__icon {
    font-size: 24px;
    flex-shrink: 0;
    color: var(--mg-color-primary);
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  &__label {
    @include body(3);

    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--mg-color-neutral);
    font-size: 10px;
    font-weight: 700;
  }

  &__title {
    @include body(2);

    font-weight: 600;
    color: var(--mg-btn-text-secondary);
    transition: color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 55vw;

    @include start-from(medium-desktop) {
      max-width: 100%;
    }
  }

  &__placeholder {
    display: none;

    @include start-from(medium-desktop) {
      display: block;
      flex: 1;
    }
  }
}
</style>

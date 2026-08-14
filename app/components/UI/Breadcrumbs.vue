<template>
  <nav
    class="mg-breadcrumbs"
    :aria-label="$t('breadcrumbs.aria_label')"
  >
    <ol class="mg-breadcrumbs__list">
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="mg-breadcrumbs__item"
      >
        <NuxtLinkLocale
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="mg-breadcrumbs__link"
        >
          {{ item.label }}
        </NuxtLinkLocale>
        <span
          v-else
          class="mg-breadcrumbs__current"
          aria-current="page"
        >
          {{ item.label }}
        </span>
        <UIcon
          v-if="index < items.length - 1"
          name="i-material-symbols-chevron-right-rounded"
          class="mg-breadcrumbs__separator"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style lang="scss" scoped>
.mg-breadcrumbs {
  margin-bottom: 16px;

  @include start-from(medium-desktop) {
    margin-bottom: 24px;
  }

  &__list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__link {
    @include body(4);

    color: var(--mg-color-neutral);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--mg-color-primary);
    }
  }

  &__current {
    @include body(4);

    color: var(--mg-color-on-surface-variant);
    font-weight: 600;
  }

  &__separator {
    font-size: 16px;
    color: var(--mg-color-outline);
    flex-shrink: 0;
  }
}
</style>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="[it, en]"
    label-key="code"
    :ui="{
      base: 'bg-[var(--mg-color-secondary)] text-[var(--mg-btn-text-primary)] ring-[var(--mg-btn-text-secondary)] hover:bg-[var(--mg-color-on-surface-variant)] cursor-pointer',
      content:
        'bg-[var(--mg-color-secondary)] ring-[var(--mg-btn-text-secondary)]',
      item: 'text-[var(--mg-btn-text-primary)] active:bg-[var(--mg-color-on-surface-variant)]'
    }"
    @update:model-value="handleUpdateLocale($event)"
  />
</template>

<script lang="ts" setup>
import { en, it } from "@nuxt/ui/locale"

const { locale, setLocale } = useI18n()

const handleUpdateLocale = (lang: string) => {
  const availableLocale = lang as "it" | "en"

  setLocale(availableLocale)
}
</script>

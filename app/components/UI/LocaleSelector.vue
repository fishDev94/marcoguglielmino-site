<template>
  <USelectMenu
    :model-value="locale"
    :items="locales"
    value-key="code"
    label-key="code"
    :ui="{
      base: 'bg-[var(--mg-color-secondary)] text-[var(--mg-btn-text-primary)] ring-[var(--mg-btn-text-secondary)] hover:bg-[var(--mg-color-on-surface-variant)] cursor-pointer',
      content:
        'bg-[var(--mg-color-secondary)] ring-[var(--mg-btn-text-secondary)]',
      item: 'text-[var(--mg-btn-text-primary)] active:bg-[var(--mg-color-on-surface-variant)]'
    }"
    @update:model-value="handleUpdateLocale($event)"
  >
    <template #leading>
      <UIcon
        :name="localeIcon"
        class="size-5"
      />
    </template>
    <template #item-leading="{ item }">
      <UIcon
        :name="getLocaleIcon(item)"
        class="size-5"
      />
    </template>
  </USelectMenu>
</template>

<script lang="ts" setup>
const { locale, setLocale } = useI18n()

const locales = [
  { code: "it", icon: "i-circle-flags-it" },
  { code: "en", icon: "i-circle-flags-gb" }
]

const localeIcon = computed(
  () => locales.find(item => item.code === locale.value)?.icon ?? locales[0]?.icon
)

const getLocaleIcon = (item: unknown) => {
  if (typeof item === "object" && item !== null && "icon" in item) {
    return String(item.icon)
  }

  return undefined
}

const handleUpdateLocale = (lang: string) => {
  const availableLocale = lang as "it" | "en"

  setLocale(availableLocale)
}
</script>

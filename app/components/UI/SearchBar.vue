<template>
  <UInput
    v-model="value"
    icon="i-lucide-search"
    size="md"
    class="rounded-none"
    variant="outline"
    placeholder="Search..."
  >
    <template
      v-if="value?.length"
      #trailing
    >
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        icon="i-lucide-circle-x"
        aria-label="Clear input"
        @click="onClear"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const value = ref("")

const onClear = () => {
  value.value = ""
}
</script>

<style lang="scss" scoped>
</style>

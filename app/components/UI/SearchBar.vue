<template>
  <UInput
    v-model="model"
    icon="i-lucide-search"
    size="md"
    class="rounded-none"
    variant="outline"
    placeholder="Search..."
    @keyup.enter="emit('onSearchSubmit')"
  >
    <template
      v-if="model?.length"
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
const model = defineModel<string>({ default: "" })

const emit = defineEmits<{
  (e: "onSearchSubmit" | "onClear"): void
}>()

const onClear = () => {
  model.value = ""
  emit("onClear")
}

watch(model, (val) => {
  if (val.length === 0) {
    emit("onClear")
  }
})
</script>

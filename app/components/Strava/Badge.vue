<template>
  <div
    v-if="isPersonalBest"
    :class="['mg-badge', 'pb']"
  >
    PB
  </div>
  <span
    v-else
    :class="['mg-badge', type]"
  ><slot /></span>
</template>

<script lang="ts" setup>
interface Props {
  type: "pb" | "technical"
}
const props = defineProps<Props>()

const isPersonalBest = computed(() => props.type === "pb")
</script>

<style lang="scss" scoped>
.mg-badge {
    @include body(4);

    padding: 4px 8px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.05em;

    &.technical {
        background-color: var(--mg-color-secondary);
        color: #ffffff;
    }

    &.pb {
        background-color: #e0f2ff;
        color: var(--mg-color-primary);
        border: 1px solid var(--mg-color-primary);
    }
}
</style>

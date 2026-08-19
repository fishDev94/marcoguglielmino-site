<template>
  <div class="mg-contact-detail">
    <div
      v-if="icon"
      class="mg-contact-detail__icon-wrapper"
    >
      <span class="material-symbols-outlined mg-contact-detail__icon">
        <UIcon
          :name="icon"
          class="size-6"
        />
      </span>
    </div>

    <div class="mg-contact-detail__content">
      <p class="mg-contact-detail__label">
        {{ label }}
      </p>

      <a
        v-if="isEmail && decodedEmail"
        :href="`mailto:${decodedEmail}`"
        class="mg-contact-detail__value mg-contact-detail__value--link"
      >
        {{ decodedEmail }}
      </a>

      <a
        v-else-if="href"
        :href="href"
        class="mg-contact-detail__value mg-contact-detail__value--link"
      >
        {{ value }}
      </a>

      <p
        v-else
        class="mg-contact-detail__value"
      >
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label: string
  value?: string
  href?: string
  icon?: string
  encodedEmail?: string
}

const props = defineProps<Props>()

const isEmail = computed(() => !!props.encodedEmail)
const decodedEmail = ref<string>("")

onMounted(() => {
  if (props.encodedEmail) {
    decodedEmail.value = atob(props.encodedEmail)
  }
})
</script>

<style lang="scss" scoped>
.mg-contact-detail {
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  &__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    background-color: var(--mg-color-surface-alt);
    border-radius: 0.5rem;
  }

  &__icon {
    display: grid;
    place-items: center;
    color: var(--mg-color-primary);
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mg-color-neutral);
    margin-bottom: 0.25rem;
  }

  &__value {
    font-family: monospace;
    color: var(--mg-color-secondary);
    text-decoration: none;

    &--link {
      transition: color 0.2s ease-in-out;

      &:hover {
        color: var(--mg-color-primary);
      }
    }
  }
}
</style>

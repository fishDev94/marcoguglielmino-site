<template>
  <div
    class="mg-reel-info"
    :class="`mg-reel-info--${variant}`"
  >
    <div>
      <div
        v-if="!isMobile"
        class="mg-reel-info__header"
      >
        <UBadge
          variant="subtle"
          :ui="{ base: 'rounded-full' }"
          size="sm"
          class="mg-reel-info__badge"
        >
          Marco Guglielmino
        </UBadge>
        <span
          v-if="timestamp"
          class="mg-reel-info__date"
        >
          {{ formatTimeAgo(timestamp, $t) }}
        </span>
      </div>

      <InstagramReelCaption
        :text="caption"
        class="mg-reel-info__caption"
      />

      <span
        v-if="isMobile && timestamp"
        class="mg-reel-info__time-ago"
      >
        {{ formatTimeAgo(timestamp, $t) }}
      </span>
    </div>

    <div class="mg-reel-info__cta">
      <UIButton
        type="primary"
        :is-strong="true"
        class="mg-reel-info__cta-btn"
        @click.stop="$emit('open-instagram')"
      >
        <UIcon
          :name="ctaButtonIconName"
          class="size-5"
        />
        <span>{{ $t("reel_viewer.view_on_instagram") }}</span>
        <UIcon
          v-if="!isMobile"
          name="i-material-symbols-arrow-forward-rounded"
          class="size-5"
        />
      </UIButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  caption?: string
  timestamp?: string
  variant?: "desktop" | "mobile"
}

const {
  caption = "",
  timestamp = "",
  variant = "desktop"
} = defineProps<Props>()

const isMobile = computed(() => variant === "mobile")
const ctaButtonIconName = computed(() => !isMobile.value
  ? "i-material-symbols-photo-camera-outline"
  : "i-material-symbols-video-library-rounded")

defineEmits<{
  "open-instagram": []
}>()
</script>

<style lang="scss" scoped>
.mg-reel-info {
  display: flex;
  flex-direction: column;
  color: var(--mg-btn-text-primary);

  &--desktop {
    flex-grow: 1;
    justify-content: space-between;
    padding: 32px;
    background-color: var(--mg-color-secondary);

    @include start-from(tablet) {
      padding: 48px;
    }
  }

  &--mobile {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    padding: 24px;
    padding-bottom: 24px;
    background: linear-gradient(
      to top,
      var(--mg-color-secondary),
      color-mix(in srgb, var(--mg-color-secondary) 80%, transparent),
      transparent
    );
    pointer-events: none;
    gap: 12px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__badge {
    --ui-primary: var(--mg-color-accent);

    @include body(4);

    padding: 4px 12px;
    font-size: 10px;
    text-transform: uppercase;
  }

  &__date {
    @include body(4);

    color: color-mix(in srgb, var(--mg-btn-text-primary) 40%, transparent);
    text-transform: uppercase;
  }

  &__caption {
    color: color-mix(in srgb, var(--mg-btn-text-primary) 80%, transparent);
    margin-bottom: 32px;

    :deep(.mg-reel-hashtag) {
      color: var(--mg-color-accent);
    }
  }

  &--desktop &__caption {
    @include body(2);
  }

  &--mobile &__caption {
    @include body(3);

    line-height: 1.5;
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0;
  }

  &__time-ago {
    @include body(4);

    color: color-mix(in srgb, var(--mg-btn-text-primary) 70%, transparent);
    font-weight: 300;
  }

  &__cta {
    display: flex;
    flex-direction: column;
    gap: 16px;
    pointer-events: auto;
  }

  &--mobile &__cta {
    padding-top: 4px;
    margin-bottom: 16px;
    align-items: flex-start;
  }

  &__cta-btn {
    justify-content: center;
    gap: 8px;
    border-radius: 8px !important;
    font-style: italic;
  }

  &--desktop &__cta-btn {
    width: 100%;
    padding: 16px 24px;
  }

  &--mobile &__cta-btn {
    @include body(4);

    display: inline-flex;
    width: auto;
    align-items: center;
    gap: 10px;
    border-radius: 6px !important;
    text-transform: uppercase;
  }
}
</style>

<template>
  <article class="mg-blog-card">
    <NuxtLinkLocale
      :to="`/blog/${article.slug}`"
      class="mg-blog-card__link"
    >
      <div class="mg-blog-card__image-wrapper">
        <NuxtImg
          v-if="article.coverImage?.url"
          :src="article.coverImage.url"
          :alt="article.coverImage.title || article.title"
          class="mg-blog-card__image"
          loading="lazy"
          format="webp"
          width="400"
          height="225"
        />
        <span
          v-if="mainTag"
          class="mg-blog-card__tag"
        >
          {{ mainTag }}
        </span>
      </div>
      <div class="mg-blog-card__content">
        <time
          v-if="formattedDate"
          :datetime="article.publishedData"
          class="mg-blog-card__date"
        >
          {{ formattedDate }}
        </time>

        <h3 class="mg-blog-card__title">
          {{ article.title }}
        </h3>

        <p
          v-if="article.seoDescription"
          class="mg-blog-card__description"
        >
          {{ article.seoDescription }}
        </p>
        <div class="mg-blog-card__footer">
          <div
            class="mg-blog-card__button"
            :aria-label="article.title"
          >
            <UIcon
              name="i-material-symbols-arrow-forward-rounded"
              class="mg-blog-card__button-icon"
            />
          </div>
        </div>
      </div>
    </NuxtLinkLocale>
  </article>
</template>

<script setup lang="ts">
import type { BlogCardFragment } from "#gql"

const props = defineProps<{
  article: BlogCardFragment
}>()

const { locale } = useI18n()

const formattedDate = computed(() => {
  if (!props.article.publishedData) return ""
  return formatDate(props.article.publishedData, locale.value).toUpperCase()
})

const mainTag = computed(() => {
  return (
    props.article.tags?.items?.[0]?.tagName
    || props.article.tags?.items?.[0]?.tagValue
    || ""
  )
})
</script>

<style lang="scss" scoped>
.mg-blog-card {
  background-color: var(--mg-color-surface-lowest, #ffffff);
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--mg-color-neutral) 15%, transparent);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .mg-blog-card__title {
      color: var(--mg-color-primary);
    }

    .mg-blog-card__image {
      transform: scale(1.04);
    }

    .mg-blog-card__button {
      background-color: var(--mg-color-primary);
      color: #ffffff;
      border-color: var(--mg-color-primary);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  &__image-wrapper {
    position: relative;
    height: 192px;
    width: 100%;
    overflow: hidden;
    background-color: color-mix(
      in srgb,
      var(--mg-btn-text-primary) 5%,
      transparent
    );
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &__tag {
    @include body(3);

    position: absolute;
    top: 12px;
    left: 12px;
    background-color: var(--mg-color-secondary);
    color: var(--mg-btn-text-primary);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;
  }

  &__date {
    @include body(3);

    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--mg-color-neutral);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  &__title {
    @include heading(3);

    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 8px;
    transition: color 0.2s ease;
  }

  &__description {
    @include body(3);

    color: color-mix(in srgb, var(--mg-btn-text-secondary) 70%, transparent);
    margin-bottom: 16px;
    font-weight: 400;
    line-height: 1.2rem;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: auto;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--mg-color-primary);
    color: var(--mg-color-primary);
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
  }

  &__button-icon {
    font-size: 18px;
  }
}
</style>

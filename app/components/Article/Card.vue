<template>
  <article :class="['mg-blog-card', { 'mg-blog-card--wide': isWideCard }]">
    <NuxtLinkLocale
      :to="`/blog/${article.slug}`"
      :class="[
        'mg-blog-card__link',
        { 'mg-blog-card__link--wide': isWideCard }
      ]"
    >
      <div class="mg-blog-card__image-wrapper">
        <NuxtImg
          v-if="article.coverImage?.url"
          :src="article.coverImage.url"
          :alt="article.coverImage.title || article.title"
          class="mg-blog-card__image"
          provider="contentful"
          loading="lazy"
          format="webp"
          :quality="imageQuality"
          :sizes="imageSizes"
          :width="article.coverImage.width ?? undefined"
          :height="article.coverImage.height ?? undefined"
          densities="x1 x2"
        />
        <span
          v-if="mainTag"
          class="mg-blog-card__tag"
        >
          {{ mainTag }}
        </span>
      </div>
      <div class="mg-blog-card__content">
        <div class="mg-blog-card__header">
          <div
            v-if="isWideCard"
            class="mg-blog-card__equipment-card"
          >
            <NuxtImg
              class="mg-blog-card__equipment-card-image"
              :src="equipmentItem?.image?.url || ''"
            />
            <p>{{ equipmentItem?.name }}</p>
          </div>
          <time
            v-if="formattedDate"
            :datetime="article.publishedData"
            class="mg-blog-card__date"
          >
            {{ formattedDate }}
          </time>
        </div>

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
            v-if="isWideCard"
            class="mg-blog-card__cta-read-more"
          >
            {{ $t("article.wide_card.readMoreCTA") }}
            <UIcon
              name="i-material-symbols-arrow-forward-rounded"
              class="mg-blog-card__button-icon"
            />
          </div>
          <div
            v-else
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
import type { BlogCardFragment, BlogPostDataFragment } from "#gql"

const { article, dimension = "normal" } = defineProps<{
  article: BlogCardFragment | BlogPostDataFragment
  dimension?: "normal" | "wide"
}>()

const isWideCard = computed(() => dimension === "wide")
const imageSizes = computed(() =>
  isWideCard.value ? "xs:100vw md:50vw" : "xs:100vw sm:50vw lg:33vw"
)
const imageQuality = computed(() => isWideCard.value ? 100 : 70)

const lang = useCurrentLang()

const formattedDate = computed(() => {
  if (!article.publishedData) return ""
  return formatDate(article.publishedData, lang).toUpperCase()
})

const equipmentItem = computed(() => {
  if (isWideCard.value) {
    const equipmentList
      = (article as BlogPostDataFragment).equipment?.items || []

    return equipmentList.find(e => e?.type === "shoe")
  }

  return null
})

const mainTag = computed(() => {
  return (
    article.tags?.items?.[0]?.tagName
    || article.tags?.items?.[0]?.tagValue
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

  &--wide {
    border-radius: 2px;
  }

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

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__equipment-card {
    @include body(4);

    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding-inline: 8px;
    color: var(--mg-btn-text-primary);
    background-color: var(--mg-color-secondary);
    height: 32px;

    @include start-from(tablet) {
      border-radius: 4px;
    }
  }

  &__equipment-card-image {
    display: grid;
    place-content: center;
    object-fit: cover;
    width: 24px;
    border-radius: 999px;
  }

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;

    &--wide {
      @include start-from(tablet) {
        flex-direction: row;
      }

      .mg-blog-card {
        &__image-wrapper {
          @include start-from(tablet) {
            width: 50%;
            height: auto;
          }
        }

        &__content {
          gap: 8px;

          @include start-from(tablet) {
            padding: 36px;
            justify-content: center;
            gap: 8px;
          }
        }

        &__date {
          margin: 0;
        }

        &__title {
          margin-bottom: 0;

          @include start-from(tablet) {
            @include heading(2);
          }
        }

        &__description {
          @include start-from(tablet) {
            @include body(3);
            line-height: 1.2rem;
            display: -webkit-box;
            line-clamp: unset;
            -webkit-line-clamp: unset;
            -webkit-box-orient: unset;
          }
        }

        &__footer {
          margin-top: 0;
          justify-content: flex-start;

          @include start-from(tablet) {
            justify-content: flex-end;
          }
        }
      }
    }
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

  &__cta-read-more {
    @include body(2);
    font-weight: 700;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--mg-color-primary);
    padding: 8px 32px;
    color: var(--mg-btn-text-primary);

    & > span {
      display: none;
    }

    @include start-from(tablet) {
      color: var(--mg-color-primary);
      background-color: unset;

      & > span {
        display: inline;
      }
    }
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

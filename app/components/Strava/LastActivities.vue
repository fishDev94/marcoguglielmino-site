<template>
  <div class="mg-last-activities">
    <NuxtLayout name="content-wrapper">
      <header class="mg-last-activities__header">
        <div class="mg-last-activities__title-section">
          <h1 class="mg-last-activities__title uppercase md:capitalize">
            {{ $t("strava.activities.last.title") }}
          </h1>
        </div>
        <NuxtLinkLocale
          class="mg-last-activities__link"
          :to="{ name: 'strava' }"
        >
          <p>{{ $t("strava.activities.last.link") }}</p>
          <UIcon name="i-material-symbols-arrow-forward" />
        </NuxtLinkLocale>
      </header>
      <p class="mg-last-activities__description">
        {{ $t("strava.activities.last.description") }}
      </p>
      <div class="mg-last-activities__body">
        <UICarousel>
          <template v-if="isLoading">
            <StravaActivityCardSkeleton
              v-for="n in LAST_ACTIVITIES_PER_PAGE"
              :key="`skeleton-card+${n}`"
              class="mg-last-activities__card"
            />
          </template>
          <template v-else>
            <StravaActivityCard
              v-for="(activity, i) in activities"
              :key="`activity-card-${activity.id}+${i}`"
              class="mg-last-activities__card"
              :activity
            />
          </template>
        </UICarousel>
      </div>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { LAST_ACTIVITIES_PER_PAGE } from "~/constants"

const { getActivities } = useStravaActivities()

const { data: activities, pending: isLoading } = getActivities({ per_page: LAST_ACTIVITIES_PER_PAGE })
</script>

<style lang="scss" scoped>
.mg-last-activities {
    padding-block: 24px;

    &__header {
        display: flex;
        justify-content: space-between
    }

    &__title {
        @include heading(4);

        display: flex;
        align-items: center;
        line-height: 1.6rem;
        border-left: 4px solid var(--color-primary);
        padding-left: 1rem;
        margin-top: 8px;

        @include start-from(tablet) {
            @include heading(3);

            font-weight: 700;
            gap: 8px;
            padding: 0;
            border: unset;
        }
    }

    &__description {
        @include body(4);

        font-weight: 400;
        margin-top: 16px;

        @include start-from(tablet) {
            @include body(2);

            margin-top: 8px;
        }
    }

    &__link {
        @include body(4);

        height: max-content;
        align-self: flex-end;
        display: flex;
        align-content: center;
        gap: 2px;
        color: var(--ui-primary);

        &>p {
            width: max-content;
        }
    }

    &__body {
      margin-top: 16px;
    }

    &__card {
      min-width: 0;

      @include start-from(tablet) {
        margin-block: 4px;
      }
    }
}
</style>

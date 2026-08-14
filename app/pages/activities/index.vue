<template>
  <NuxtLayout name="default-page">
    <section class="mg-activities">
      <UICardGrid>
        <template v-if="isInitialLoading">
          <StravaActivityCardSkeleton
            v-for="n in PAGE_SIZE"
            :key="`skeleton-card+${n}`"
            class="mg-activities__card"
          />
        </template>
        <template v-else>
          <StravaActivityCard
            v-for="activity in activitiesList"
            :key="activity.id"
            class="mg-activities__card"
            :activity
          />
        </template>
      </UICardGrid>

      <div
        v-if="hasNextPage"
        ref="sentinelRef"
        class="mg-activities__sentinel"
        aria-hidden="true"
      />

      <div
        v-if="isLoadingMore"
        class="mg-activities__loader"
        role="status"
        aria-label="Loading more activities"
      >
        <span
          v-for="n in 3"
          :key="`loader-dot-${n}`"
          class="mg-activities__loader-dot"
        />
      </div>
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core"

import type { StravaActivity } from "~~/types/strava"
import { PAGE_SIZE } from "~/constants"

definePageMeta({
  name: "strava"
})

const { getActivities } = useStravaActivities()

const page = ref(1)
const activitiesList = ref<StravaActivity[]>([])
const hasNextPage = ref(true)
const sentinelRef = ref<HTMLElement | null>(null)

const { data: activitiesPage, pending: isActivitiesLoading, execute: fetchActivities } = getActivities({
  page,
  per_page: PAGE_SIZE
})

watch(activitiesPage, (newPage) => {
  if (!newPage) return

  activitiesList.value.push(...newPage.items)
  hasNextPage.value = newPage.hasNextPage
})

// activitiesPage is only ever fetched client-side, so gate on it (not just pending) to match SSR markup and avoid a hydration mismatch
const isInitialLoading = computed(() => activitiesList.value.length === 0 && (!activitiesPage.value || isActivitiesLoading.value))
const isLoadingMore = computed(() => activitiesList.value.length > 0 && isActivitiesLoading.value)

const loadMore = async () => {
  if (!hasNextPage.value || isActivitiesLoading.value) return

  page.value += 1
  await fetchActivities(page.value)
}

useIntersectionObserver(
  sentinelRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      loadMore()
    }
  },
  { rootMargin: "200px" }
)
</script>

<style lang="scss" scoped>
.mg-activities {
  padding: 36px 0;

  @include start-from(tablet) {
    padding: 64px 0;
  }

  &__card {
    width: 100% !important;
  }

  &__sentinel {
    height: 1px;
  }

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px 0;
  }

  &__loader-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--mg-color-primary);
    animation: mg-activities-bounce 1s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
}

@keyframes mg-activities-bounce {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.75);
  }

  40% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

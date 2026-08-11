<template>
  <NuxtLayout name="default-page">
    <section class="mg-activities">
      <UICardGrid>
        <template v-if="isActivitiesLoading">
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

      <div class="mg-activities__pagination">
        <UButton
          label="Previous"
          color="neutral"
          variant="soft"
          :disabled="!hasPreviousPage"
          @click="goToPreviousPage"
        />
        <span class="mg-activities__page-indicator">Page {{ currentPage }}</span>
        <UButton
          label="Next"
          color="neutral"
          variant="soft"
          :disabled="!hasNextPage"
          @click="goToNextPage"
        />
      </div>
    </section>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { PAGE_SIZE } from "~/constants"

definePageMeta({
  name: "strava"
})

const { getActivities } = useStravaActivities()

const {
  currentPage
} = useUrlSearchEngine({ pageSize: PAGE_SIZE })

const { data: activitiesPage, pending: isActivitiesLoading } = getActivities({
  page: currentPage,
  per_page: PAGE_SIZE
})

const activitiesList = computed(() => activitiesPage.value?.items || [])
const hasNextPage = computed(() => activitiesPage.value?.hasNextPage || false)
const hasPreviousPage = computed(() => currentPage.value > 1)

const goToPreviousPage = () => {
  if (!hasPreviousPage.value) return
  currentPage.value -= 1
}

const goToNextPage = () => {
  if (!hasNextPage.value) return
  currentPage.value += 1
}

watch(isActivitiesLoading, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
})
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

  &__pagination {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__page-indicator {
    @include body(2);
  }
}
</style>

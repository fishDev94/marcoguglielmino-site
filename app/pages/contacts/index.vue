<template>
  <NuxtLayout
    name="default-page"
    with-aside-layout
    split="50-50"
  >
    <template #main>
      <UIContactDetail
        icon="i-ic-outline-email"
        :label="$t('contacts.contact.directEmail')"
        encoded-email="aW5mb0BtYXJjb2d1Z2xpZWxtaW5vLmNvbQ=="
      />
    </template>
    <template #side>
      <div class="mg-contacts__socials">
        <UISocialCard
          :title="$t('contacts.social.instagram.title')"
          :description="$t('contacts.social.instagram.description')"
          :action-label="$t('contacts.social.instagram.actionLabel')"
          href="https://instagram.com/fish.run.dev"
          icon="photo_camera"
          icon-background-class="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
        />

        <UISocialCard
          :title="$t('contacts.social.strava.title')"
          :description="$t('contacts.social.strava.description')"
          :action-label="$t('contacts.social.strava.actionLabel')"
          href="https://www.strava.com/athletes/32887406"
          icon="speed"
          icon-background-class="bg-[#FC6719]"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.mg-contacts {
  &__socials {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: stretch;

    & > * {
      flex: 1 1 calc((100% - 1rem) / 2);
      min-width: 0;
    }

    @media (max-width: 820px) {
      & > * {
        flex-basis: 100%;
      }
    }
  }
}
</style>

<template>
  <nav class="mg-top-nav-bar">
    <NuxtLayout name="content-wrapper">
      <div class="mg-top-nav-bar__content h-16">
        <NuxtLinkLocale
          class="mg-top-nav-bar__left"
          to="/"
          aria-label="Marco Guglielmino - Home"
          @click="handleNavigationMenuClick"
        >
          <UILogo />
          <h1 class="mg-top-nav-bar__title">
            <span class="mg-top-nav-bar__title-short">Marco G.</span>
            <span class="mg-top-nav-bar__title-full">Marco Guglielmino</span>
          </h1>
        </NuxtLinkLocale>
        <UINavbarTopMenu :internal-links="footerData.internalLinks" />
        <div class="mg-top-nav-bar__right-mobile-side">
          <UILocaleSelector />
          <UIAvatar
            :src="avatarData.src.value"
            :title="avatarData.title.value"
          />
        </div>
        <UINavbarTopNavigationIcons />
      </div>
    </NuxtLayout>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  footerData: Awaited<ReturnType<typeof useAsyncFooterData>>
  avatarData: Awaited<ReturnType<typeof useAsyncAvatarData>>
}

defineProps<Props>()

const route = useRoute()

const handleNavigationMenuClick = () => {
  if (route.path === "/") {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
}
</script>

<style scoped lang="scss">
.mg-top-nav-bar {
  width: 100%;
  background-color: var(--mg-color-secondary);
  min-height: 64px;
  position: sticky;
  top: 0;
  z-index: 11;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include start-from(tablet) {
      gap: 24px;
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;

    @include start-from(tablet) {
      gap: 24px;
    }
  }

  &__title {
    @include heading(3);

    text-transform: uppercase;
    font-style: italic;
    color: var(--mg-btn-text-primary);

    @include start-from(tablet) {
      .mg-top-nav-bar__title-short {
        font-size: 18px;
      }
    }

    .mg-top-nav-bar__title-full {
      display: none;
    }

    @include start-from(medium-desktop) {
      @include heading(3);

      text-transform: none;

      .mg-top-nav-bar__title-short {
        display: none;
      }

      .mg-top-nav-bar__title-full {
        display: inline;
      }
    }
  }

  &__right-mobile-side {
    display: flex;
    align-items: center;
    gap: 16px;

    @include start-from(tablet) {
      display: none;
    }
  }
}
</style>

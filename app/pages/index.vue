<template>
  <div>
    <h1 class="my-text">
      Test test
    </h1>
    <div class="button-content">
      <UIButton
        type="primary"
        is-strong
      >
        Primary
      </UIButton>
      <UIButton type="secondary">
        Secondary
      </UIButton>
      <UIButton type="inverted">
        Inverted
      </UIButton>
      <UIButton type="outlined">
        Outlined
      </UIButton>
      <UIButton
        type="outlined-light"
        is-strong
      >
        Outlined Light
      </UIButton>
    </div>
    <UISearchBar />
  </div>
</template>

<style lang="scss" scoped>
.my-text {
  @include heading(1);
}

.button-content {
  display: flex;
  gap: 4px;
}
</style>

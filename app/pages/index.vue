<template>
  <div>
    <h1 class="my-text">
      Test test
    </h1>
    <UIButton type="primary">
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
  </div>
</template>

<style lang="scss" scoped>
.my-text {
  @include heading(1);
}
</style>

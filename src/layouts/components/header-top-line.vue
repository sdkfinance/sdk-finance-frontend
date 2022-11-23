<template>
  <div class="header-top-line">
    <div class="header-top-line__back">
      <i class="icon-arrow-left header-top-line__icon"/>
      <a
        href="https://sdk.finance/?utm_source=sdkapp&utm_medium=sdkapp&utm_campaign=header-logo">
        {{ $t('action.back_to_sdk_finance_website') }}
      </a>
    </div>
  </div>
</template>

<script>
export default {

  name: 'HeaderTopLine',

};
</script>

<style lang="scss">
.header-top-line {
  @apply flex items-center justify-between h-44 pl-18 pr-18  bg-blue-200;

  &__back {
    @apply flex items-center text-lg font-normal text-blue-600;
  }

  &__logo {
    @apply h-3/5 w-auto;
  }

  &__icon {
    @apply text-xs mr-8;
  }
}
</style>

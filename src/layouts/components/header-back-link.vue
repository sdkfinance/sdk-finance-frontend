<template>
  <div class="header-back-link">
    <i class="icon-arrow-left header-back-link__icon"/>
    <a
      href="https://sdk.finance/?utm_source=sdkapp&utm_medium=sdkapp&utm_campaign=header-logo">
      {{ $t('action.back_to_sdk_finance_website') }}
    </a>
  </div>
</template>

<script>
export default {

  name: 'HeaderBackLink',

};
</script>

<style lang="scss">
.header-back-link {
  @apply flex items-center text-lg font-normal h-44 pl-18 text-blue-600 bg-blue-200;

  &__icon {
    @apply text-xs mr-8;
  }
}
</style>

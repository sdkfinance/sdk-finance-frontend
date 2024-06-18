<template>
  <div class="header-top-line">
    <div class="header-top-line__back">
      <i class="icon-chevron-left header-top-line__icon" />
      <a href="https://sdk.finance/?utm_source=sdkapp&utm_medium=sdkapp&utm_campaign=header-logo">
        {{ $t('action.back_to_sdk_finance_website') }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HeaderTopLine',
};
</script>

<style lang="scss" scoped>
.header-top-line {
  @apply flex items-center justify-between pl-18 pr-18 h-[var(--header-height,2.75rem)] bg-blue-200;

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

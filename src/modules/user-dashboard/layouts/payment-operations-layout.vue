<template>
  <div class="payment-operations">
    <div class="payment-operations__title">
      <slot name="title"/>
    </div>
    <div class="payment-operations__subtitle">
      <slot name="subtitle"/>
    </div>
    <div class="payment-operations__list">
      <slot name="list"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PaymentOperationsLayout extends Vue {}
</script>

<style lang="scss">
.payment-operations {
  @apply max-w-520 ml-auto mr-auto;

  &__title {
    @apply font-semibold text-gray-500 text-center mb-64 text-2xl;
  }

  &__subtitle {
    @apply font-medium text-gray-500 mb-32 text-xl;
  }

  &__list {
    @apply flex flex-col;
  }
}
</style>

<template>
  <div class="gold-rates-table-pair-cell">
    <div class="gold-rates-table-pair-cell__icons">
      <div class="gold-rates-table-pair-cell__icons--in">
        <img
          :src="inCurrencyIconPath"
          :alt="rateRecord.inCurrency.code" />
      </div>

      <div class="gold-rates-table-pair-cell__icons--out">
        <img
          :src="outCurrencyIconPath"
          :alt="rateRecord.outCurrency.code" />
      </div>
    </div>
    <span class="gold-rates-table-pair-cell__text">
      {{ pairString }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { IExchangeRatesRecord } from '@sdk5/shared/requests';
import { computed } from 'vue';

const props = defineProps<{
  rateRecord: IExchangeRatesRecord;
}>();

const pairString = computed(() => `${props.rateRecord.inCurrency.code}/${props.rateRecord.outCurrency.code}`);
const inCurrencyIconPath = computed(() => `/images/currencies/${props.rateRecord.inCurrency.code.toLowerCase()}.svg`);
const outCurrencyIconPath = computed(() => `/images/currencies/${props.rateRecord.outCurrency.code.toLowerCase()}.svg`);
</script>

<style lang="scss">
.gold-rates-table-pair-cell {
  @apply flex items-center gap-x-[0.5rem];

  &__icons {
    @apply relative w-[2rem] h-[2rem];

    &--in,
    &--out {
      @apply absolute w-[1.25rem] h-[1.25rem] rounded-full overflow-hidden;
    }

    &--in {
      @apply left-0 top-0 z-0;
    }

    &--out {
      @apply right-0 bottom-0 z-1;
    }
  }
}
</style>

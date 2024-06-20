<template>
  <p :class="classList">
    {{ amount }}
  </p>
</template>

<script setup lang="ts">
import type { ITransactionRecordComputed, TBusinessProcessStatus } from '@sdk5/shared';
import { BUSINESS_PROCESS_STATUS } from '@sdk5/shared';
import classNames from 'classnames';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    amount?: string;
    isBold?: boolean;
    customClass?: string;
    transactionRecord?: ITransactionRecordComputed;
  }>(),
  {
    amount: '',
    isBold: false,
    customClass: 'text-gray-500',
    transactionRecord: undefined,
  },
);

const BASE_CLASS_NAME = 'app-table-amount-front-office';
const TRANSACTION_WARN_STATUSES = [
  BUSINESS_PROCESS_STATUS.error,
  BUSINESS_PROCESS_STATUS.declined,
  BUSINESS_PROCESS_STATUS.rejected,
] as TBusinessProcessStatus[];

const isErrorOrDeclinedTransaction = computed(
  () => props.transactionRecord?.status && TRANSACTION_WARN_STATUSES.includes(props.transactionRecord?.status),
);
const isTopUp = computed(() => props.amount.startsWith('+'));
const classList = computed(() =>
  classNames(BASE_CLASS_NAME, [
    isTopUp.value && `${BASE_CLASS_NAME}--positive`,
    props.isBold && `${BASE_CLASS_NAME}--bold`,
    isErrorOrDeclinedTransaction.value && `${BASE_CLASS_NAME}--warn`,
    props.customClass && props.customClass,
  ]),
);
</script>

<style lang="scss">
.app-table-amount-front-office {
  @apply text-lg whitespace-nowrap font-semibold text-right;

  &--positive {
    @apply text-green-status;
  }

  &--bold {
    @apply text-20;
  }

  &--warn {
    @apply text-orange-main;
  }
}
</style>

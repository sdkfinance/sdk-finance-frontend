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
const TRANSACTION_ERROR_STATUSES = [
  BUSINESS_PROCESS_STATUS.error,
  BUSINESS_PROCESS_STATUS.declined,
  BUSINESS_PROCESS_STATUS.rejected,
  BUSINESS_PROCESS_STATUS.limited,
] as TBusinessProcessStatus[];
const TRANSACTION_WARN_STATUSES = [BUSINESS_PROCESS_STATUS.pending, BUSINESS_PROCESS_STATUS.waiting_for_approval] as TBusinessProcessStatus[];

const isErrorOrDeclinedTransaction = computed(
  () => props.transactionRecord?.status && TRANSACTION_ERROR_STATUSES.includes(props.transactionRecord?.status),
);
const isPendingTransaction = computed(() => props.transactionRecord?.status && TRANSACTION_WARN_STATUSES.includes(props.transactionRecord?.status));
const classList = computed(() =>
  classNames(BASE_CLASS_NAME, [
    props.isBold && `${BASE_CLASS_NAME}--bold`,
    isErrorOrDeclinedTransaction.value && `${BASE_CLASS_NAME}--error`,
    isPendingTransaction.value && `${BASE_CLASS_NAME}--warn`,
    props.transactionRecord?.status === 'processed' && `${BASE_CLASS_NAME}--positive`,
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

  &--error {
    @apply text-red-main;
  }
}
</style>

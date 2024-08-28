<template>
  <app-table
    :data="transactionComputedList"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    :columns="columns">
    <template #type="{ scope }">
      {{ $t(`entity.transaction.type.${scope.row.type}`) }}
    </template>
    <template #amount="{ scope }">
      <div class="amount-rows">
        <transaction-table-amount
          :amount="scope.row.amountSource"
          :currency-symbol="scope.row.amountSourceCurrencySymbol"
          :tooltip-content="`${$t('table.label.source')}`"
          :tooltip-enabled="scope.row.amountSource !== emptyChar"
          tooltip-placement="top" />

        <transaction-table-amount
          :amount="scope.row.amountDestination"
          :currency-symbol="scope.row.amountDestinationCurrencySymbol"
          :tooltip-content="`${$t('table.label.destination')}`"
          :tooltip-enabled="scope.row.amountDestination !== emptyChar"
          tooltip-placement="bottom" />
      </div>
    </template>
    <template #commissionSender="{ scope }">
      <transaction-table-amount
        :amount="scope.row.commissionSender"
        :currency-symbol="scope.row.amountSourceCurrencySymbol"
        :tooltip-content="`${$t('table.label.source')}`"
        :tooltip-enabled="false" />
    </template>
    <template #commissionRecipient="{ scope }">
      <transaction-table-amount
        :amount="scope.row.commissionRecipient"
        :currency-symbol="scope.row.amountDestinationCurrencySymbol"
        :tooltip-content="`${$t('table.label.source')}`"
        :tooltip-enabled="false" />
    </template>
    <template #direction="{ scope }">
      <span v-if="scope.row.type !== 'exchange_transaction'">{{ emptyChar }}</span>
      <template v-else>
        <div>{{ $t('table.label.from') }}: {{ scope.row.sourceClientCoin?.serial }}</div>
        <div>{{ $t('table.label.to') }}: {{ scope.row.targetClientCoin?.serial }}</div>
      </template>
    </template>
    <template #status="{ scope }">
      <app-badge
        is-borderless
        is-background-transparent
        :status="scope.row.status" />
    </template>
    <template #action="{ scope }">
      <div class="table-actions">
        <app-button
          size="small"
          @click="actionButtonClickHandler(scope.row)">
          {{ $t('action.details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script setup lang="ts">
import { UserDataService } from '@sdk5/shared';
import config from '@sdk5/shared/config';
import { ROLES } from '@sdk5/shared/constants';
import type { ITransactionRecordComputed, ITransactionsRecord } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppBadge, AppButton, AppTable } from '@sdk5/ui-kit-front-office';
import { computed } from 'vue';

import { getComputedTransactionDataForSystemRoles } from '../utils/getComputedTransactionDataForSystemRoles';
import TransactionTableAmount from './transaction-table-amount.vue';

const props = withDefaults(
  defineProps<{
    data: ITransactionsRecord[];
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
  },
);
const emit = defineEmits<{
  (event: 'open-modal', payload: ITransactionRecordComputed): void;
  (event: 'open-details', payload: ITransactionRecordComputed): void;
}>();

const emptyChar = config.emptyChar;
const columns: ITableColumn[] = [
  {
    prop: 'type',
    label: 'table.label.transaction_type',
    width: '105px',
  },
  {
    prop: 'amount',
    label: 'table.label.amount',
    width: '140px',
  },
  {
    prop: 'commissionSender',
    label: 'table.label.commission_sender',
    width: '140px',
  },
  {
    prop: 'commissionRecipient',
    label: 'table.label.commission_recipient',
    width: '140px',
  },
  {
    prop: 'createdAt',
    label: 'table.label.created_at',
    type: 'datetime',
  },
  {
    prop: 'direction',
    label: 'table.label.direction',
    width: '100px',
  },
  {
    prop: 'id',
    label: 'table.label.transactions_id',
    width: '130px',
  },
  {
    prop: 'status',
    label: 'table.label.status',
    className: 'table-status',
    width: '100px',
  },
  {
    prop: 'action',
    label: '',
    width: '110px',
  },
];

const transactionComputedList = computed<ITransactionRecordComputed[]>(() =>
  props.data.map((transactionRecord) => getComputedTransactionDataForSystemRoles(transactionRecord)),
);

const emitOpenModalEvent = (record: ITransactionRecordComputed) => emit('open-modal', record);
const emitOpenDetailsEvent = (record: ITransactionRecordComputed) => emit('open-details', record);
const actionButtonClickHandler = (row: ITransactionRecordComputed) => {
  if (UserDataService.role === ROLES.administrator) {
    emitOpenDetailsEvent(row);
    return;
  }

  emitOpenModalEvent(row);
};
</script>

<style lang="scss" scoped>
.amount-rows {
  @apply grid grid-flow-row gap-y-[2px];
}
</style>

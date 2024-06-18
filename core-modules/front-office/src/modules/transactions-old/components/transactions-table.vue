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

<script lang="ts">
import config from '@sdk5/shared/config';
import { ROLES } from '@sdk5/shared/constants';
import type { ITransactionRecordComputed, ITransactionsRecord } from '@sdk5/shared/requests';
import { UserData } from '@sdk5/shared/store';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppBadge, AppButton, AppTable } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { getComputedTransactionDataForSystemRoles } from '../utils/getComputedTransactionDataForSystemRoles';
import TransactionTableAmount from './transaction-table-amount.vue';

@Component({
  components: {
    AppBadge,
    AppTable,
    AppButton,
    TransactionTableAmount,
  },
})
export default class TransactionsTable extends Vue {
  @Prop({ required: true, type: Array }) readonly data!: ITransactionsRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  protected readonly userDataModule = getModule(UserData, this.$store);

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
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

  protected get isUserAdmin() {
    return this.userDataModule.role === ROLES.administrator;
  }

  protected get transactionComputedList(): ITransactionRecordComputed[] {
    return this.data.map((transactionRecord) => getComputedTransactionDataForSystemRoles(transactionRecord));
  }

  @Emit('open-modal')
  protected emitOpenModalEvent(record: ITransactionRecordComputed) {
    return record;
  }

  @Emit('open-details')
  protected emitOpenDetailsEvent(record: ITransactionRecordComputed) {
    return record;
  }

  protected actionButtonClickHandler(row: ITransactionRecordComputed) {
    if (this.isUserAdmin) {
      this.emitOpenDetailsEvent(row);
      return;
    }

    this.emitOpenModalEvent(row);
  }
}
</script>

<style lang="scss" scoped>
.amount-rows {
  @apply grid grid-flow-row gap-y-[2px];
}
</style>

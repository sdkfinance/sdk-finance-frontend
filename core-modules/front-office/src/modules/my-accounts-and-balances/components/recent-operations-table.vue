<template>
  <div
    v-loading="isLoading"
    class="recent-operations-table">
    <app-table
      is-secondary
      :data="transactionsTableData"
      :table-size="APP_TABLE_SIZE.big"
      :columns="recentOperationsTableColumns">
      <template #displayAmount="{ scope }">
        <amount-column :data="scope.row.displayAmount" />
      </template>
    </app-table>
  </div>
</template>

<script lang="ts">
import type { ITransactionsOptions, ITransactionsRecord, IWalletRecord } from '@sdk5/shared/requests';
import { TransactionsRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { ITableColumn } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { APP_TABLE_SIZE, AppTable } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AmountColumn from '../../wallets/components/columns/amount-column.vue';
import { getTransactionData } from '../../wallets/utils';

const COMPONENTS = {
  AppTable,
  AmountColumn,
} as const;

@Component({
  name: 'recent-operations-table',
  components: COMPONENTS,
})
export default class RecentOperationsTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array as PropType<IWalletRecord[]>, default: () => [] }) readonly accounts!: IWalletRecord[];

  $props!: {
    accounts?: IWalletRecord[];
  };

  protected isLoading = false;

  protected recentTransactions: ITransactionsRecord[] = [];

  protected profileModule = getModule(Profile, this.$store);

  protected readonly APP_TABLE_SIZE = APP_TABLE_SIZE;

  protected readonly recentOperationsTableColumns: ITableColumn[] = [
    {
      prop: 'createdAt',
      label: 'table.label.date',
      width: '160px',
      type: 'datetime',
    },
    {
      prop: 'accountName',
      label: 'Account name',
      width: '140px',
    },
    {
      prop: 'accountSerial',
      label: 'Account number',
      width: '140px',
    },
    {
      prop: 'type',
      label: 'table.label.operation_type',
      localePrefix: 'entity.transaction.type',
      width: '160px',
    },
    {
      prop: 'displayAmount',
      label: 'table.label.amount',
    },
  ];

  protected get profileContactData() {
    return this.profileModule.profileData.contact;
  }

  protected get transactionsTableData() {
    return this.recentTransactions.map((transaction) => ({
      ...transaction,
      accountName: transaction?.clientCoin?.name ?? transaction?.from?.name,
      accountSerial: transaction?.clientCoin?.serial ?? transaction?.merchantCoinSerial ?? transaction?.from?.serial,
      displayAmount: getTransactionData({ transaction, coinsData: this.accounts, profileContactData: this.profileContactData }),
    }));
  }

  protected async fetchTransactions(): Promise<void> {
    this.isLoading = true;

    const params: ITransactionsOptions = {
      pageSize: 6,
      pageNumber: 0,
      filter: { statuses: ['processed'] },
      sort: { createdAt: 'desc' },
    };

    const { response, error } = await TransactionsRequests.getRecords(params);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.recentTransactions = response?.records || [];
  }

  created() {
    this.fetchTransactions();
  }
}
</script>

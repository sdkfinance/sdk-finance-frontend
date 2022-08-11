<template>
  <div class="wallets__block">
    <div class="wallets__subtitle">
      {{ $t('pages.wallets.recent_operations') }}
    </div>
    <div v-loading="isLoading">
      <no-data-placeholder
        v-if="isNoData"
        :show-action="false"
        title="pages.wallets.no_data_transfers"/>
      <transfers-table
        v-else
        :coins-data="coinsData"
        :data="tableData"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import TransfersTable from '@/modules/wallets/components/transfers-table.vue';
import NoDataPlaceholder from '@/components/no-data-placeholder.vue';
import { TransactionsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import { ITransactionsRecord, ITransactionsOptions } from '@/services/requests/transactions/Transactions.types';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';

@Component({
  components: {
    TransfersTable,
    NoDataPlaceholder,
  },
})
export default class OperationsBlock extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly coinsData!: IWalletRecord[];

  protected tableData: ITransactionsRecord[] = [];

  protected isLoading: boolean = false;

  protected get isNoData(): boolean {
    return !this.tableData.length;
  }

  public async fetchTransactions(): Promise<void> {
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
    this.tableData = response?.records || [];
  }

}
</script>

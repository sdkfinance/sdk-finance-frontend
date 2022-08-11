<template>
  <transactions-table
    :data="transactionList"
    :is-loading="isLoading"
    @open-tx-details="openTxDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DetailsList from '@/components/details-list.vue';
import { IGetTransactionsApiResponse, ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';
import { TransactionsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import TransactionsTable from '../components/transactions-table.vue';

@Component({
  components: {
    DetailsList,
    TransactionsTable,
  },
})
export default class IndividualTransactions extends Vue {

  protected created(): void {
    this.fetchData();
  }

  protected async fetchData(): Promise<IGetTransactionsApiResponse> {
    this.isLoading = true;

    const { response, error } = await TransactionsRequests.getRecords({
      sort: { createdAt: 'desc' },
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    this.transactionList = response?.records!;

    return { response, error };
  }

  protected isLoading: boolean = false;

  protected formData: ITransactionsRecord = {} as ITransactionsRecord;

  protected transactionList: ITransactionsRecord[] = [];

  protected async openTxDetails(data: ITransactionsRecord): Promise<void> {
    await this.$router.push({ name: 'transaction-details', params: { id: data.id } });
  }

}
</script>

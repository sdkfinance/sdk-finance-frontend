<template>
  <div
    v-loading="isLoading"
    class="transaction-details">
    <transaction-details-container
      v-if="transactionDataComputed"
      :transaction="transactionDataComputed" />
  </div>
</template>

<script lang="ts">
import type { ITransactionsRecord } from '@sdk5/shared/requests';
import { TransactionsRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { Component, Vue, Watch } from 'vue-property-decorator';

import { TransactionDetailsContainer } from '../components/transaction-details';
import { getComputedTransactionDataForSystemRoles } from '../utils/getComputedTransactionDataForSystemRoles';

const COMPONENTS = {
  TransactionDetailsContainer,
} as const;

@Component({
  components: COMPONENTS,
})
export default class TransactionDetailsPage extends Vue {
  static components: typeof COMPONENTS;

  protected isLoading = false;

  protected transactionData: ITransactionsRecord | null = null;

  protected get transactionId() {
    return this.$route.params.transactionId as string;
  }

  protected get transactionDataComputed() {
    if (!this.transactionData) {
      return null;
    }

    return getComputedTransactionDataForSystemRoles(this.transactionData);
  }

  protected async fetchTransactions(transactionId: string) {
    this.isLoading = true;
    const { response, error } = await TransactionsRequests.getRecord(transactionId);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.transactionData = response.process;
  }

  @Watch('transactionId', { immediate: true })
  protected transactionIdChangeHandler(transactionId: string) {
    if (!transactionId) {
      return;
    }

    this.fetchTransactions(transactionId);
  }
}
</script>

<style lang="scss">
.transaction-details {
  @apply flex flex-col;
}
</style>

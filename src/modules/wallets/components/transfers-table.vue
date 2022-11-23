<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :is-border-none="true"
    :is-light-head="true"
    :is-large-font="true"
    :columns="columns">
    <template #amount="{ scope }">
      <amount-column :data="getAmountData(scope.row)"/>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

import AppTable from '@/components/ui-framework/app-table.vue';
import AmountColumn from '@/modules/wallets/components/columns/amount-column.vue';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import { ITransactionsRecord } from '@/services/requests/transactions/Transactions.types';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AmountColumn,
  },
})
export default class TransfersTable extends Vue {

  @Prop({ default: '', type: Array }) readonly data!: [];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ type: Array, default: () => ([]) }) readonly coinsData!: IWalletRecord[];

  readonly columns: ITableColumn[] = [
    {
      prop: 'createdAt',
      label: 'table.label.date',
      width: '190px',
      type: 'datetime',
    },
    {
      prop: 'type',
      label: 'table.label.operation_type',
      localePrefix: 'entity.transaction.type',

    },
    {
      prop: 'amount',
      label: 'table.label.amount',
      align: 'right',
    },
  ];

  protected getExchangeAmountData(data: ITransactionsRecord): IPlainObject {
    const { type, transactions } = data;
    const [OUT, IN] = transactions;
    const { from: { issuer: { currency: fromCurrency = '' } = {} } = {}, amount: amountFrom } = OUT || {};
    const { to: { issuer: { currency: toCurrency = '' } = {} } = {}, amount: amountTo } = IN || {};
    return {
      type,
      amountFrom,
      amountTo,
      toCurrency,
      fromCurrency,
    };
  }

  protected getAmountData(data: ITransactionsRecord): IPlainObject {
    if (data.type === 'exchange_transaction') {
      return this.getExchangeAmountData(data);
    }

    const {
      type, amount, invoiceAmount, cashAmount,
    } = data;
    let { serial } = data.from || {};
    let fromCurrency = data.from?.issuer?.currency || '';

    if (['bank_topup', 'gate_charge', 'gate_redeem', 'bank_redeem'].includes(type)) {
      serial = '';
      fromCurrency = data?.clientCoin?.issuer?.currency || '';
    }

    if (type === 'merchant_invoice') {
      fromCurrency = data?.transactions[0]?.issuer?.currency || '';
    }

    const isUserWallet = this.coinsData.find(({ serial: coinSerial }) => coinSerial === serial);
    const directionSymbol = !isUserWallet && !['bank_redeem', 'gate_redeem'].includes(type) ? '+' : '-';

    return {
      type,
      directionSymbol,
      isUserWallet,
      fromCurrency,
      amount: amount ?? invoiceAmount ?? cashAmount,
    };
  }

}
</script>

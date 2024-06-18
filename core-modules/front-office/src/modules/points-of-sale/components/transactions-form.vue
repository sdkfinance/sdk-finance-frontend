<template>
  <div>
    <details-list
      title="pages.transactions.details"
      :details="infoDetails" />
    <details-list
      title="pages.transactions.balances"
      :details="balances" />
    <details-list
      title="pages.transactions.from_wallet"
      :details="fromDetails" />
    <details-list
      title="pages.transactions.to_wallet"
      :details="toDetails" />
  </div>
</template>

<script lang="ts">
import type { IClientCoin, ITransactionsRecord, ITransactionsTransaction } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { getAmountWithCurrency, getDefaultDate } from '@sdk5/shared/utils';
import { DetailsList } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  DetailsList,
} as const;

@Component({
  name: 'transactions-form',
  components: COMPONENTS,
})
export default class TransactionsForm extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Object, required: true }) readonly formData!: ITransactionsRecord;

  $props!: {
    formData: ITransactionsRecord;
  };

  protected get isExchange(): any {
    return this.formData.type === 'exchange_transaction';
  }

  protected get infoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.transaction_id',
        param: 'id',
        value: this.formData.id,
      },
      {
        label: 'form.label.transaction_type',
        param: 'type',
        value: this.$t(`entity.transaction.type.${this.formData.type}`),
      },
      {
        label: 'form.label.status',
        param: 'status',
        value: this.formData.status,
      },
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: getDefaultDate(this.formData.createdAt),
      },
      {
        label: 'form.label.updated_at',
        param: 'updatedAt',
        value: getDefaultDate(this.formData.updatedAt),
      },
      {
        label: 'form.label.request_id',
        param: 'requestIdentifier',
        value: this.formData.requestIdentifier,
      },
      {
        label: 'form.label.request_status',
        param: 'requestStatus',
        value: this.formData.requestStatus,
      },
    ];
  }

  protected get balances(): IDetailsValue[] {
    const currency: string = this.formData.transactions[0]?.currency?.code ?? null;
    const commission: number | null = this.formData?.commission;
    let amount: number | null = this.formData.transactions[0]?.amount ?? this.formData.amount ?? this.formData.invoiceAmount ?? null;
    let { netAmount } = this.formData;

    if (this.isExchange) {
      amount = this.formData.transactions[1]?.amount ?? null;
      netAmount = this.formData.transactions[0]?.amount ?? null;
    }

    return [
      {
        label: 'form.label.amount',
        param: 'amount',
        value: getAmountWithCurrency(amount, currency),
      },
      {
        label: 'form.label.commission',
        param: 'commission',
        value: getAmountWithCurrency(commission, currency),
        hide: this.isExchange,
      },
      {
        label: 'form.label.net_amount',
        param: 'net_amount',
        value: getAmountWithCurrency(netAmount, currency),
      },
    ];
  }

  protected get fromDetails(): IDetailsValue[] {
    const transaction: IClientCoin = this.formData?.transactions[this.isExchange ? 1 : 0]?.from || this.formData?.from;

    return [
      {
        label: 'form.label.wallet_number',
        param: 'serial',
        value: transaction?.serial,
      },
      {
        label: 'form.label.organization_id',
        param: 'organizationId',
        value: transaction?.organizationId,
      },
      {
        label: 'form.label.organization_name',
        param: 'organizationName',
        value: transaction?.organizationName,
      },
      {
        label: 'form.label.technical',
        param: 'technical',
        value: transaction?.technical,
      },
      {
        label: 'form.label.wallet_type',
        param: 'type',
        value: transaction?.type,
      },
      {
        label: 'form.label.currency_id',
        param: 'id',
        value: transaction?.currency?.id,
      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: transaction?.currency?.code,
      },
    ];
  }

  protected get toDetails(): IDetailsValue[] {
    const transaction: ITransactionsTransaction = this.formData?.transactions[0];

    return [
      {
        label: 'form.label.wallet_number',
        param: 'serial',
        value: transaction?.to?.serial,
      },
      {
        label: 'form.label.organization_id',
        param: 'organizationId',
        value: transaction?.to?.organizationId,
      },
      {
        label: 'form.label.organization_name',
        param: 'organizationName',
        value: transaction?.to?.organizationName,
      },
      {
        label: 'form.label.technical',
        param: 'technical',
        value: transaction?.to?.technical,
      },
      {
        label: 'form.label.wallet_type',
        param: 'type',
        value: transaction?.to?.type,
      },
      {
        label: 'form.label.currency_id',
        param: 'id',
        value: transaction?.to?.currency?.id,
      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: transaction?.to?.currency?.code,
      },
    ];
  }
}
</script>

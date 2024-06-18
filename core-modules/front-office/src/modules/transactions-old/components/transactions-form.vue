<template>
  <div>
    <details-list
      title="pages.transactions.details"
      :details="infoDetails" />
    <details-list
      v-if="isBalancesSectionVisible"
      title="pages.transactions.balances"
      :details="balances" />
    <details-list
      v-if="isFromDetailsSectionVisible"
      :title="fromDetailsSectionTitle"
      :details="fromDetails" />
    <details-list
      v-if="isToDetailsSectionVisible"
      :title="toDetailsSectionTitle"
      :details="toDetails" />
  </div>
</template>

<script lang="ts">
import { TRANSACTION_TYPES_ENUM } from '@sdk5/shared/constants';
import type { IClientCoin, ITransactionRecordComputed, ITransactionsTransaction } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { getDefaultDate } from '@sdk5/shared/utils';
import { DetailsList } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  DetailsList,
} as const;

@Component({
  components: COMPONENTS,
})
export default class TransactionsForm extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Object, required: true }) readonly formData!: ITransactionRecordComputed;

  $props!: {
    formData: ITransactionRecordComputed;
  };

  protected get toDetailsSectionTitle() {
    if (this.formData.type === TRANSACTION_TYPES_ENUM.bank_redeem) {
      return 'pages.transactions.to_bank_account';
    }

    return 'pages.transactions.to_wallet';
  }

  protected get fromDetailsSectionTitle() {
    if (this.formData.type === TRANSACTION_TYPES_ENUM.bank_topup) {
      return 'pages.transactions.from_bank_account';
    }

    return 'pages.transactions.from_wallet';
  }

  protected get isExchange(): any {
    return this.formData.type === TRANSACTION_TYPES_ENUM.exchange_transaction;
  }

  protected get isBalancesSectionVisible() {
    return this.formData.type !== TRANSACTION_TYPES_ENUM.client_transaction_issue;
  }

  protected get isFromDetailsSectionVisible() {
    const TRANSACTION_TYPES_WITHOUT_FROM_DETAILS_SECTION = [
      TRANSACTION_TYPES_ENUM.gate_charge,
      TRANSACTION_TYPES_ENUM.client_transaction_issue,
      TRANSACTION_TYPES_ENUM.cash_desk_charge,
    ];
    return TRANSACTION_TYPES_WITHOUT_FROM_DETAILS_SECTION.indexOf(this.formData.type) === -1;
  }

  protected get isToDetailsSectionVisible() {
    const TRANSACTION_TYPES_WITHOUT_TO_DETAILS_SECTION = [
      TRANSACTION_TYPES_ENUM.gate_redeem,
      TRANSACTION_TYPES_ENUM.gate_purchase,
      TRANSACTION_TYPES_ENUM.gate_issue_card,
      TRANSACTION_TYPES_ENUM.client_transaction_issue,
      TRANSACTION_TYPES_ENUM.cash_desk_redeem,
    ];
    return TRANSACTION_TYPES_WITHOUT_TO_DETAILS_SECTION.indexOf(this.formData.type) === -1;
  }

  protected get infoDetails(): IDetailsValue[] {
    const TRANSACTION_TYPES_WITHOUT_REQUEST_ID_AND_STATUS = [
      TRANSACTION_TYPES_ENUM.gate_redeem,
      TRANSACTION_TYPES_ENUM.gate_charge,
      TRANSACTION_TYPES_ENUM.gate_purchase,
      TRANSACTION_TYPES_ENUM.merchant_payment,
      TRANSACTION_TYPES_ENUM.merchant_invoice,
      TRANSACTION_TYPES_ENUM.client_transaction_issue,
    ];
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
        hide: TRANSACTION_TYPES_WITHOUT_REQUEST_ID_AND_STATUS.indexOf(this.formData.type) !== -1,
      },
      {
        label: 'form.label.request_status',
        param: 'requestStatus',
        value: this.formData.requestStatus,
        hide: TRANSACTION_TYPES_WITHOUT_REQUEST_ID_AND_STATUS.indexOf(this.formData.type) !== -1,
      },
    ];
  }

  protected get balances(): IDetailsValue[] {
    const TRANSACTION_TYPES_WITH_PROVIDER_COMMISSION_VISIBLE = [
      TRANSACTION_TYPES_ENUM.gate_redeem,
      TRANSACTION_TYPES_ENUM.gate_charge,
      TRANSACTION_TYPES_ENUM.gate_purchase,
      TRANSACTION_TYPES_ENUM.gate_issue_card,
    ];
    const TRANSACTION_TYPES_WITH_TOTAL_COMMISSION_VISIBLE = TRANSACTION_TYPES_WITH_PROVIDER_COMMISSION_VISIBLE;
    const TRANSACTION_TYPES_WITHOUT_SYSTEM_FEE = [
      TRANSACTION_TYPES_ENUM.cash_input,
      TRANSACTION_TYPES_ENUM.cash_collect,
      TRANSACTION_TYPES_ENUM.cash_investment,
      TRANSACTION_TYPES_ENUM.client_transaction_transfer,
    ];

    const { type: transactionType, balanceDetails } = this.formData;

    const { amountSource, amountDestination, commissionSender, commissionDestination, systemCommission, providerCommission, totalCommission } =
      balanceDetails ?? {};

    return [
      {
        label: 'form.label.source_amount',
        param: 'source_amount',
        value: amountSource,
      },
      {
        label: 'form.label.provider_fee',
        param: 'provider_fee',
        value: providerCommission,
        hide: TRANSACTION_TYPES_WITH_PROVIDER_COMMISSION_VISIBLE.indexOf(transactionType) === -1,
      },
      {
        label: 'form.label.sender_fee',
        param: 'sender_fee',
        value: commissionSender,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.client_transaction_transfer,
      },
      {
        label: 'form.label.system_fee',
        param: 'system_fee',
        value: systemCommission,
        hide: TRANSACTION_TYPES_WITHOUT_SYSTEM_FEE.indexOf(transactionType) >= 0,
      },
      {
        label: 'form.label.total_fee',
        param: 'total_fee',
        value: totalCommission,
        hide: TRANSACTION_TYPES_WITH_TOTAL_COMMISSION_VISIBLE.indexOf(transactionType) === -1,
      },
      {
        label: 'form.label.destination_amount',
        param: 'destination_amount',
        value: amountDestination,
      },
      {
        label: 'form.label.recipient_fee',
        param: 'recipient_fee',
        value: commissionDestination,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.client_transaction_transfer,
      },
    ];
  }

  protected get fromDetails(): IDetailsValue[] {
    const transaction: IClientCoin = this.formData?.transactions[this.isExchange ? 1 : 0]?.from || this.formData?.from;
    const { type: transactionType, iban, bankInfo } = this.formData;
    return [
      {
        label: 'form.label.bank_name',
        param: 'bank_name',
        value: bankInfo?.name,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.bank_topup,
      },
      {
        label: 'form.label.bank_bic',
        param: 'bank_bic',
        value: bankInfo?.bic,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.bank_topup,
      },
      {
        label: 'form.label.iban',
        param: 'iban',
        value: iban,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.bank_topup,
      },
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
    const { type: transactionType, iban, bankInfo } = this.formData;
    return [
      {
        label: 'form.label.bank_name',
        param: 'bank_name',
        value: bankInfo?.name,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.bank_redeem,
      },
      {
        label: 'form.label.bank_bic',
        param: 'bank_bic',
        value: bankInfo?.bic,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.bank_redeem,
      },
      {
        label: 'form.label.iban',
        param: 'iban',
        value: iban,
        hide: transactionType !== TRANSACTION_TYPES_ENUM.bank_redeem,
      },
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

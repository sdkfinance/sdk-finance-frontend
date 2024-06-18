<template>
  <div class="transaction-details-container">
    <div class="transaction-details-container__list">
      <details-section
        title="pages.transactions.details"
        :details="infoDetails">
        <template #id-value="{ detail }">
          <app-id-viewer :id="detail.value" />
        </template>
        <template #status-value="{ detail }">
          <app-badge
            :status="detail.value"
            :label="detail.value" />
        </template>
        <template #requestStatus-value="{ detail }">
          <app-badge
            :status="detail.value"
            :label="detail.value" />
        </template>
      </details-section>
      <details-section
        v-if="isBalancesSectionVisible"
        title="pages.transactions.balances"
        :details="balancesDetails" />
      <details-section
        v-if="isFromDetailsSectionVisible"
        :title="fromDetailsSectionTitle"
        :details="fromDetails">
        <template #organizationId-value="{ detail }">
          <app-id-viewer :id="detail.value" />
        </template>
        <template #id-value="{ detail }">
          <app-id-viewer :id="detail.value" />
        </template>
      </details-section>
      <details-section
        v-if="isToDetailsSectionVisible"
        :title="toDetailsSectionTitle"
        :details="toDetails">
        <template #organizationId-value="{ detail }">
          <app-id-viewer :id="detail.value" />
        </template>
        <template #id-value="{ detail }">
          <app-id-viewer :id="detail.value" />
        </template>
      </details-section>
    </div>
  </div>
</template>

<script lang="ts">
import { TRANSACTION_TYPES_ENUM } from '@sdk5/shared/constants';
import type { IClientCoin, ITransactionRecordComputed, ITransactionsTransaction } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { getDefaultDate } from '@sdk5/shared/utils';
import { AppBadge, AppIdViewer } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import DetailsSection from './details-section.vue';

const COMPONENTS = {
  DetailsSection,
  AppIdViewer,
  AppBadge,
} as const;

@Component({
  components: COMPONENTS,
})
export default class TransactionDetailsContainer extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Object as PropType<ITransactionRecordComputed>, required: true }) readonly transaction!: ITransactionRecordComputed;

  $props!: {
    transaction: ITransactionRecordComputed;
  };

  protected get isBalancesSectionVisible() {
    return this.transaction.type !== TRANSACTION_TYPES_ENUM.client_transaction_issue;
  }

  protected get isFromDetailsSectionVisible() {
    const TRANSACTION_TYPES_WITHOUT_FROM_DETAILS_SECTION = [
      TRANSACTION_TYPES_ENUM.gate_charge,
      TRANSACTION_TYPES_ENUM.client_transaction_issue,
      TRANSACTION_TYPES_ENUM.cash_desk_charge,
    ];
    return TRANSACTION_TYPES_WITHOUT_FROM_DETAILS_SECTION.indexOf(this.transaction.type) === -1;
  }

  protected get isToDetailsSectionVisible() {
    const TRANSACTION_TYPES_WITHOUT_TO_DETAILS_SECTION = [
      TRANSACTION_TYPES_ENUM.gate_redeem,
      TRANSACTION_TYPES_ENUM.gate_purchase,
      TRANSACTION_TYPES_ENUM.gate_issue_card,
      TRANSACTION_TYPES_ENUM.client_transaction_issue,
      TRANSACTION_TYPES_ENUM.cash_desk_redeem,
    ];
    return TRANSACTION_TYPES_WITHOUT_TO_DETAILS_SECTION.indexOf(this.transaction.type) === -1;
  }

  protected get isExchange(): any {
    return this.transaction.type === TRANSACTION_TYPES_ENUM.exchange_transaction;
  }

  protected get toDetailsSectionTitle() {
    if (this.transaction.type === TRANSACTION_TYPES_ENUM.bank_redeem) {
      return 'pages.transactions.to_bank_account';
    }

    return 'pages.transactions.to_wallet';
  }

  protected get fromDetailsSectionTitle() {
    if (this.transaction.type === TRANSACTION_TYPES_ENUM.bank_topup) {
      return 'pages.transactions.from_bank_account';
    }

    return 'pages.transactions.from_wallet';
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
        value: this.transaction.id,
      },
      {
        label: 'form.label.transaction_type',
        param: 'type',
        value: this.$t(`entity.transaction.type.${this.transaction.type}`),
      },
      {
        label: 'form.label.status',
        param: 'status',
        value: this.transaction.status,
      },
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: getDefaultDate(this.transaction.createdAt),
      },
      {
        label: 'form.label.updated_at',
        param: 'updatedAt',
        value: getDefaultDate(this.transaction.updatedAt),
      },
      {
        label: 'form.label.request_id',
        param: 'requestIdentifier',
        value: this.transaction.requestIdentifier,
        hide: TRANSACTION_TYPES_WITHOUT_REQUEST_ID_AND_STATUS.indexOf(this.transaction.type) !== -1,
      },
      {
        label: 'form.label.request_status',
        param: 'requestStatus',
        value: this.transaction.requestStatus,
        hide: TRANSACTION_TYPES_WITHOUT_REQUEST_ID_AND_STATUS.indexOf(this.transaction.type) !== -1,
      },
    ];
  }

  protected get balancesDetails(): IDetailsValue[] {
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

    const { type: transactionType, balanceDetails } = this.transaction;

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
    const transaction: IClientCoin = this.transaction?.transactions[this.isExchange ? 1 : 0]?.from || this.transaction?.from;
    const { type: transactionType, iban, bankInfo } = this.transaction;
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
    const transaction: ITransactionsTransaction = this.transaction?.transactions[0];
    const { type: transactionType, iban, bankInfo } = this.transaction;
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

<style lang="scss">
.transaction-details-container {
  @apply grid grid-cols-2 gap-x-[2rem];

  &__list {
    @apply bg-gray-100 rounded-[8px] border border-solid border-blue-400 grid grid-flow-row overflow-hidden;
  }
}
</style>

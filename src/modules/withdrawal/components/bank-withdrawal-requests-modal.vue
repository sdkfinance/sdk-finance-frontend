<template>
  <div>
    <buttons-group v-if="isActionsVisible">
      <app-button
        size="small"
        full-width
        @click="userAction(CONFIRM_ENUM.accept)">
        {{ $t('action.accept') }}
      </app-button>
      <app-button
        size="small"
        full-width
        @click="userAction(CONFIRM_ENUM.decline)">
        {{ $t('action.decline') }}
      </app-button>
    </buttons-group>
    <details-list
      title="pages.withdrawal.details_main_info"
      :details="mainInfoDetails"/>
    <details-list
      title="pages.withdrawal.details_bank_info"
      :details="bankInfoDetails"/>
    <details-list
      title="pages.withdrawal.details_client_wallet"
      :details="clientWallet"/>
    <details-list
      title="pages.withdrawal.details_issuer"
      :details="issuer"/>
    <details-list
      title="pages.withdrawal.details_transactions"
      :details="transactions"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import DetailsList from '@/components/details-list.vue';
import { IDetailsValue } from '@/types/interfaces';
import { getDefaultDate } from '@/utils';
import { IWithdrawalRecord } from '@/services/requests/bank-withdrawals/Withdrawal.interface';
import { ITransactionsTransaction } from '@/services/requests/transactions/Transactions.types';
import AppButton from '@/components/ui-framework/app-button.vue';
import { CONFIRM_ENUM } from '@/constants/enums';
import ButtonsGroup from '@/components/ui-kit/app-buttons-group.vue';

@Component({
  components: {
    ButtonsGroup,
    DetailsList,
    AppButton,
  },
})
export default class BankWithdrawalRequestsModal extends Vue {

  @Prop({ type: Object, required: true }) readonly formData!: IWithdrawalRecord;

  protected CONFIRM_ENUM = CONFIRM_ENUM;

  protected get isActionsVisible(): boolean {
    return this.formData.status === 'pending';
  }

  protected get mainInfoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.id',
        param: 'id',
        value: this.formData.id,

      },
      {
        label: 'form.label.request_id',
        param: 'requestIdentifier',
        value: this.formData.requestIdentifier,

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
        label: 'form.label.cash_amount',
        param: 'cashAmount',
        value: this.formData.cashAmount,

      },
      {
        label: 'form.label.name',
        param: 'fullName',
        value: this.formData.fullName,

      },
      {
        label: 'form.label.status',
        param: 'status',
        value: this.formData.status,

      },
      {
        label: 'form.label.request_status',
        param: 'requestStatus',
        value: this.formData.requestStatus,

      },
    ];
  }

  protected get bankInfoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.bic',
        param: 'bic',
        value: this.formData.bankInfo.bic,

      },
      {
        label: 'form.label.bank_name',
        param: 'name',
        value: this.formData.bankInfo.name,

      },
      {
        label: 'form.label.swift',
        param: 'swift',
        value: this.formData.bankInfo.swift,

      },
      {
        label: 'form.label.bank_country',
        param: 'country',
        value: this.formData.bankInfo.country,

      },
      {
        label: 'form.label.bank_city',
        param: 'city',
        value: this.formData.bankInfo.city,

      },
      {
        label: 'form.label.bank_address',
        param: 'address',
        value: this.formData.bankInfo.address,

      },
      {
        label: 'form.label.zip_code',
        param: 'zipCode',
        value: this.formData.bankInfo.zipCode,

      },
    ];
  }

  protected get clientWallet(): IDetailsValue[] {
    return [
      {
        label: 'form.label.serial_number',
        param: 'serial',
        value: this.formData.clientCoin.serial,

      },
      {
        label: 'form.label.organization_id',
        param: 'organizationId',
        value: this.formData.clientCoin.organizationId,

      },
      {
        label: 'form.label.organization_name',
        param: 'organizationName',
        value: this.formData.clientCoin.organizationName,

      },
      {
        label: 'form.label.technical',
        param: 'technical',
        value: this.formData.clientCoin.technical,

      },
      {
        label: 'form.label.type',
        param: 'type',
        value: this.formData.clientCoin.type,

      },
    ];
  }

  protected get issuer(): IDetailsValue[] {
    return [
      {
        label: 'form.label.id',
        param: 'id',
        value: this.formData.clientCoin.issuer.id,

      },
      {
        label: 'form.label.serial_number',
        param: 'sn',
        value: this.formData.clientCoin.issuer.sn,

      },
      {
        label: 'form.label.currency',
        param: 'currency',
        value: this.formData.clientCoin.issuer.currency,

      },
    ];
  }

  protected get transactions(): IDetailsValue[] {
    const transaction: ITransactionsTransaction = this.formData?.transactions[0];

    return [
      {
        label: 'form.label.id',
        param: 'id',
        value: transaction.id,

      },
      {
        label: 'form.label.type',
        param: 'type',
        value: transaction.type,

      },
      {
        label: 'form.label.amount',
        param: 'amount',
        value: transaction.amount,

      },
      {
        label: 'form.label.performed_at',
        param: 'performedAt',
        value: transaction.performedAt,

      },
    ];
  }

  @Emit('user-action')
  protected userAction(action: CONFIRM_ENUM): CONFIRM_ENUM {
    return action;
  }

}
</script>

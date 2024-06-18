<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="!isCommissionCalculated"
      prop="payerCoin">
      <app-select
        v-model="form.payerCoin"
        :options="coinsList"
        full-width
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.payer_coin"
        label="form.label.coin">
        <template #option="{ scope }"> {{ scope.name }} ({{ scope.serial }}) </template>
      </app-select>
    </app-form-item>

    <div
      v-if="isCommissionCalculated && !isInvoicePayed"
      class="form__list">
      <p>
        <strong> {{ $t('pages.invoices.transaction_amount') }}: </strong>
        {{ commission.transactionAmount }}
      </p>
      <p>
        <strong> {{ $t('pages.invoices.commission') }}: </strong>
        {{ commission.commissionAmountPush }} {{ commission.currency.code }}
      </p>
      <p>
        <strong> {{ $t('pages.invoices.amount_without_commission') }}: </strong>
        {{ commission.senderAmountPush }} {{ commission.currency.code }}
      </p>
    </div>

    <div
      v-if="isInvoicePayed"
      class="form__list">
      <p>
        <strong> {{ $t('pages.invoices.invoice_id') }}: </strong>
        {{ payedInvoiceInfo.identifier }}
      </p>
      <p>
        <strong> {{ $t('pages.invoices.name') }}: </strong>
        {{ payedInvoiceInfo.name }}
      </p>
      <p>
        <strong> {{ $t('pages.invoices.sender') }}: </strong>
        {{ invoiceDetails.merchantName }}
      </p>
      <p>
        <strong> {{ $t('pages.invoices.amount') }}: </strong>
        {{ payedInvoiceInfo.totalPrice }} {{ payedInvoiceInfo?.currency.code }}
      </p>
    </div>

    <app-button
      v-if="!isCommissionCalculated"
      class="btn-submit"
      full-width
      native-type="submit"
      type="primary"
      @click.prevent="calculateInvoiceCommission">
      {{ $t('action.next') }}
    </app-button>

    <app-button
      v-if="isCommissionCalculated && !isInvoicePayed"
      class="btn-submit"
      full-width
      native-type="submit"
      type="primary">
      {{ $t('action.pay') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
import type { ICalculatedCommission, IInvoiceCoin, IInvoicesRecord, IWalletRecord } from '@sdk5/shared/requests';
import { InvoicesRequests, WalletsRequests } from '@sdk5/shared/requests';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppDatePicker, AppForm, AppFormItem, AppInput, AppSelect, AppSwitch } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

import InvoicesCommissionBlock from './invoices-commission-block.vue';
import InvoicesCreatedBlock from './invoices-created-block.vue';

const COMPONENTS = {
  InvoicesCreatedBlock,
  AppForm,
  AppSwitch,
  AppFormItem,
  AppSelect,
  AppInput,
  AppButton,
  AppDatePicker,
  InvoicesCommissionBlock,
} as const;

@Component({
  name: 'pay-invoice-form',
  components: COMPONENTS,
})
export default class PayInvoiceForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Object, required: true }) readonly invoiceDetails!: IInvoicesRecord;

  $props!: {
    invoiceDetails: IInvoicesRecord;
  };

  @Emit('payed')
  protected onPayed(): boolean {
    return true;
  }

  protected created(): void {
    this.fetchCoins();
  }

  protected isLoading: boolean = false;

  protected coinsList: IWalletRecord[] = [];

  protected isCommissionCalculated: boolean = false;

  protected isInvoicePayed: boolean = false;

  protected commission = {} as ICalculatedCommission;

  protected payedInvoiceInfo: IInvoicesRecord | null = null;

  protected form: IInvoiceCoin = {
    payerCoin: null,
  };

  protected rules: IPlainObject = {
    payerCoin: OnChangeRequiredValidationRule(),
  };

  protected async fetchCoins(): Promise<void> {
    this.isLoading = true;

    const { response, error } = await WalletsRequests.getWallets();

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.coinsList = response?.coins || [];

    this.form.payerCoin = this.coinsList.find((coin: IWalletRecord) => this.invoiceDetails.currency?.id === coin.currency.id)?.serial || null;

    if (this.form.payerCoin) {
      await this.calculateInvoiceCommission();
    }
  }

  protected async calculateInvoiceCommission() {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;

    const { response, error } = await InvoicesRequests.calcCommissionForSpecifiedInvoice(this.form, this.invoiceDetails.identifier);

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    const { transactionAmount, commissionAmountPush, senderAmountPush, currency } = response || {};

    this.commission = {
      transactionAmount,
      commissionAmountPush,
      senderAmountPush,
      currency,
    } as ICalculatedCommission;

    this.isCommissionCalculated = true;
  }

  protected async handleForm(): Promise<void> {
    this.isLoading = true;

    const { response } = await InvoicesRequests.payForInvoice(this.form, this.invoiceDetails.identifier);

    this.isLoading = false;

    if (!response) {
      return;
    }

    this.payedInvoiceInfo = response?.invoice || {};
    this.isInvoicePayed = true;
    this.onPayed();
  }
}
</script>

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
        <template #option="{scope}">
          {{ scope.name }} ({{ scope.serial }})
        </template>
      </app-select>
    </app-form-item>

    <div
      v-if="isCommissionCalculated && !isInvoicePayed"
      class="form__list">
      <p>
        <strong>
          {{ $t('pages.invoices.transaction_amount') }}:
        </strong>
        {{ commission.transactionAmount }}
      </p>
      <p>
        <strong>
          {{ $t('pages.invoices.commission') }}:
        </strong>
        {{ commission.commissionAmountPush }} {{ commission.currency }}
      </p>
      <p>
        <strong>
          {{ $t('pages.invoices.amount_without_commission') }}:
        </strong>
        {{ commission.senderAmountPush }} {{ commission.currency }}
      </p>
    </div>

    <div
      v-if="isInvoicePayed"
      class="form__list">
      <p>
        <strong>
          {{ $t('pages.invoices.invoice_id') }}:
        </strong>
        {{ payedInvoiceInfo.identifier }}
      </p>
      <p>
        <strong>
          {{ $t('pages.invoices.name') }}:
        </strong>
        {{ payedInvoiceInfo.name }}
      </p>
      <p>
        <strong>
          {{ $t('pages.invoices.sender') }}:
        </strong>
        {{ invoiceDetails.merchantName }}
      </p>
      <p>
        <strong>
          {{ $t('pages.invoices.amount') }}:
        </strong>
        {{ payedInvoiceInfo.totalPrice }} {{ payedInvoiceInfo.issuer.currency }}
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
import {
  Component, Vue, Ref, Prop, Emit,
} from 'vue-property-decorator';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';

import AppForm from '@/components/ui-framework/app-form.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';
import InvoicesCommissionBlock from '@/modules/invoices/components/invoices-commission-block.vue';
import { InvoicesRequests, WalletsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import InvoicesCreatedBlock from '@/modules/invoices/components/invoices-created-block.vue';
import {
  IInvoicesRecord,
  IInvoice,
  IInvoiceCoin,
  IInvoiceCalculatedCommission,
} from '@/services/requests/invoices/Invoices.types';
import { IPlainObject } from '@/types/interfaces';
import { OnChangeRequiredValidationRule } from '@/rules/validation';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';

@Component({
  components: {
    InvoicesCreatedBlock,
    AppForm,
    AppSwitch,
    AppFormItem,
    AppSelect,
    AppInput,
    AppButton,
    AppDatePicker,
    InvoicesCommissionBlock,
  },
})
export default class PayInvoiceForm extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Object, required: true }) readonly invoiceDetails!: IInvoicesRecord;

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

  protected commission: IInvoiceCalculatedCommission | {} = {};

  protected payedInvoiceInfo: IInvoice | null = null;

  protected form: IInvoiceCoin = {
    payerCoin: null,
  }

  protected rules: IPlainObject = {
    payerCoin: OnChangeRequiredValidationRule(),
  }

  protected async fetchCoins(): Promise<void> {
    this.isLoading = true;

    const { response, error } = await WalletsRequests.getWallets();

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.coinsList = response?.coins || [];

    this.form.payerCoin = this.coinsList.find((coin: IWalletRecord) => this.invoiceDetails.issuer?.id === coin.issuer.id)?.serial || null;
    if (this.form.payerCoin) {
      await this.calculateInvoiceCommission();
    }
  }

  protected async calculateInvoiceCommission() {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;

    const { response, error } = await InvoicesRequests.calcCommissionForSpecifiedInvoice(
      this.form,
      this.invoiceDetails.identifier,
    );

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    const {
      transactionAmount,
      commissionAmountPush,
      senderAmountPush,
      currency,
    } = response || {};

    this.commission = {
      transactionAmount,
      commissionAmountPush,
      senderAmountPush,
      currency,
    };

    this.isCommissionCalculated = true;

  }

  protected async handleForm(): Promise<void> {
    this.isLoading = true;

    const { response } = await InvoicesRequests.payForInvoice(
      this.form,
      this.invoiceDetails.identifier,
    );

    this.isLoading = false;

    if (!response) return;

    this.payedInvoiceInfo = response?.invoice || {};
    this.isInvoicePayed = true;
    this.onPayed();
  }

}
</script>

<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="inCoinSerial">
      <app-select
        v-model="form.inCoinSerial"
        :options="coinsList"
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.choose_wallet"
        full-width
        label="form.label.sell"
        @change="clearCommission" />
    </app-form-item>
    <app-form-item prop="amount">
      <app-input
        v-model="form.amount"
        placeholder="placeholder.input.input_amount"
        label="form.label.amount"
        @input="clearCommission" />
    </app-form-item>
    <app-form-item prop="outCoinSerial">
      <app-select
        v-model="form.outCoinSerial"
        :options="coinsList"
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.choose_wallet"
        full-width
        label="form.label.buy"
        @change="clearCommission" />
    </app-form-item>
    <div
      v-if="commission.exchangeRate"
      class="form__list">
      <p>
        <strong>{{ $t('pages.wallets.sell') }}:</strong>
        {{ commission.withdrawAmount }} {{ commission.exchangeRate.inCurrency.code }}
      </p>
      <p>
        <strong>{{ $t('pages.wallets.buy') }}:</strong>
        {{ commission.topUpAmount }} {{ commission.exchangeRate.outCurrency.code }}
      </p>
    </div>
    <app-button
      v-if="isCalculateButtonVisible"
      type="primary"
      full-width
      native-type="button"
      @click.stop="calculateCommissionFee">
      {{ $t('action.next') }}
    </app-button>
    <app-button
      v-else
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.exchange') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
import type { ITransactionsRecord, IWalletRecord } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleNumberRangeValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

import type { IExchangeCalculateResponse, IExchangePayload } from '../../../../requests';
import { ExchangeRequests } from '../../../../requests';

const COMPONENTS = {
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
  AppButton,
} as const;

@Component({
  name: 'currency-exchange-form',
  components: COMPONENTS,
})
export default class CurrencyExchangeForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Array as PropType<IWalletRecord[]>, default: () => [] }) readonly coinsList!: IWalletRecord[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  $props!: {
    coinsList?: IWalletRecord[];
    isLoadingData?: boolean;
  };

  protected isLoading: boolean = false;

  protected rateId: string | null = null;

  protected commission: IExchangeCalculateResponse = {} as IExchangeCalculateResponse;

  protected form: Pick<IExchangePayload, 'inCoinSerial' | 'outCoinSerial'> & {
    amount: number | null;
  } = {
    inCoinSerial: '',
    outCoinSerial: '',
    amount: null,
  };

  protected rules: Record<keyof typeof this.form, unknown> = {
    inCoinSerial: OnChangeRequiredValidationRule(),
    outCoinSerial: OnChangeRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
  };

  protected get isFormLoading(): boolean {
    return this.isLoadingData || this.isLoading;
  }

  protected get isCalculateButtonVisible(): boolean {
    return !this.commission.exchangeRate;
  }

  @Emit('submit')
  protected onSubmit(data: ITransactionsRecord): ITransactionsRecord {
    return data;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchanges(this.form as IExchangePayload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    if (response?.process) {
      this.onSubmit(response?.process);
    }
  }

  protected async calculateCommissionFee(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchangeCalculate(this.form as IExchangePayload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.commission = response || ({} as IExchangeCalculateResponse);
  }

  protected clearCommission(): void {
    this.commission = {} as IExchangeCalculateResponse;
  }
}
</script>

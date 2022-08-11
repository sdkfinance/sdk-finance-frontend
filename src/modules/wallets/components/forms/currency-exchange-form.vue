<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="inCoinSerial">
      <app-select
        v-model="form.inCoinSerial"
        :options="coinsList"
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.choose_wallet"
        full-width
        label="form.label.sell"
        @change="clearCommission"/>
    </app-form-item>
    <app-form-item prop="amount">
      <app-input
        v-model="form.amount"
        placeholder="placeholder.input.input_amount"
        label="form.label.amount"
        @input="clearCommission"/>
    </app-form-item>
    <app-form-item
      prop="outCoinSerial">
      <app-select
        v-model="form.outCoinSerial"
        :options="coinsList"
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.choose_wallet"
        full-width
        label="form.label.buy"
        @change="clearCommission"/>
    </app-form-item>
    <div
      v-if="commission.exchangeRate"
      class="form__list">
      <p>
        <strong>{{ $t('pages.wallets.sell') }}:</strong>
        {{ commission.withdrawAmount }} {{ commission.exchangeRate.inIssuer.currency }}
      </p>
      <p>
        <strong>{{ $t('pages.wallets.buy') }}:</strong>
        {{ commission.topUpAmount }} {{ commission.exchangeRate.outIssuer.currency }}
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
import {
  Component, Prop, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { OnChangeRequiredValidationRule, SimpleNumberRangeValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import { ExchangeRequests } from '@/services/requests/exchange/ExchangeRequests';
import {
  IExchangeCalculateResponse,
  IExchangePayload,
  IExchangeSuccess,
} from '@/services/requests/exchange/Exchange.types';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class CurrencyExchangeForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, default: () => ([]) }) readonly coinsList!: IWalletRecord[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  protected isLoading: boolean = false;

  protected rateId: string | null = null;

  protected commission: IExchangeCalculateResponse = {} as IExchangeCalculateResponse;

  protected form: IExchangePayload = {
    inCoinSerial: '',
    outCoinSerial: '',
    amount: null,
  };

  protected rules: IPlainObject = {
    inCoinSerial: OnChangeRequiredValidationRule(),
    outCoinSerial: OnChangeRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
  }

  protected get isFormLoading(): boolean {
    return this.isLoadingData || this.isLoading;
  }

  protected get isCalculateButtonVisible(): boolean {
    return !this.commission.exchangeRate;
  }

  @Emit('submit')
  protected onSubmit(data: IExchangeSuccess): IExchangeSuccess {
    return data;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchanges(this.form);
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

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await ExchangeRequests.exchangeCalculate(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.commission = response || {} as IExchangeCalculateResponse;
  }

  protected clearCommission(): void {
    this.commission = {} as IExchangeCalculateResponse;
  }

}
</script>

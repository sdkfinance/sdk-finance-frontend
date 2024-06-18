<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="rate">
      <app-input
        v-model="form.rate"
        :label="
          $t('form.label.rate', {
            inCurrency: modalData.inCurrency.sn,
            outCurrency: modalData.outCurrency.sn,
          })
        "
        placeholder="placeholder.input.specify_amount"
        clearable />
    </app-form-item>

    <app-button
      class="btn-submit"
      full-width
      native-type="submit"
      type="primary">
      {{ $t('action.set_exchange_rate') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
import type { IExchangeRatesRecord, ISetExchangeRatePayload } from '@sdk5/shared/requests';
import { ExchangeRatesRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { SimpleNumberValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppForm,
  AppFormItem,
  AppInput,
  AppButton,
} as const;

@Component({
  name: 'currency-exchange-edit-form',
  components: COMPONENTS,
})
export default class CurrencyExchangeEditForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Object as PropType<IExchangeRatesRecord>, required: true }) readonly modalData!: IExchangeRatesRecord;

  $props!: {
    modalData: IExchangeRatesRecord;
  };

  protected isLoading: boolean = false;

  protected form: Pick<ISetExchangeRatePayload, 'inCurrencyId' | 'outCurrencyId' | 'active' | 'direction'> & {
    rate: number | null;
  } = {
    rate: null,
    inCurrencyId: this.modalData.inCurrency.id,
    outCurrencyId: this.modalData.outCurrency.id,
    direction: 'sell',
    active: true,
  };

  protected rules: Record<keyof Pick<ISetExchangeRatePayload, 'rate'>, unknown> = {
    rate: SimpleNumberValidationRule(),
  };

  protected created(): void {
    this.form.rate = this.modalData?.rate;
  }

  @Emit('exchange-rate-changed')
  protected onExchangeRateChanged(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { error } = await ExchangeRatesRequests.setExchangeRate(this.form as ISetExchangeRatePayload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.onExchangeRateChanged();
  }
}
</script>

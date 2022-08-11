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
        :label="$t('form.label.rate', {
          inCurrency: modalData.inIssuer.sn,
          outCurrency: modalData.outIssuer.sn
        })"
        placeholder="placeholder.input.specify_amount"
        clearable/>
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
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { IPlainObject } from '@/types/interfaces';
import { SimpleNumberValidationRule } from '@/rules/validation';
import { ExchangeRatesRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import { IExchangeRatesRecord, ISetExchangeRatePayload } from '@/services/requests/exchange-rates/ExchangeRates.types';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class CurrencyExchangeEditForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) readonly modalData!: IExchangeRatesRecord;

  protected isLoading: boolean = false;

  protected form: ISetExchangeRatePayload = {
    rate: null,
    inIssuerId: this.modalData.inIssuer.id,
    outIssuerId: this.modalData.outIssuer.id,
    direction: 'sell',
    active: true,
  }

  protected rules: IPlainObject = {
    rate: SimpleNumberValidationRule(),
  }

  protected created(): void {
    this.form.rate = this.modalData?.rate;
  }

  @Emit('exchange-rate-changed')
  protected onExchangeRateChanged(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await ExchangeRatesRequests.setExchangeRate(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.onExchangeRateChanged();
  }

}
</script>

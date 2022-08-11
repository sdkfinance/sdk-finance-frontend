<template>
  <app-form
    ref="form"
    :loading="showSpinner"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_name"
        :label="$t('form.label.name')"/>
    </app-form-item>
    <app-form-item
      prop="snPrefix">
      <app-input
        v-model="form.snPrefix"
        placeholder="placeholder.input.input_sn_prefix"
        :label="$t('form.label.sn_prefix')"/>
    </app-form-item>
    <app-form-item
      prop="orderNumber">
      <app-input
        v-model.trim="form.orderNumber"
        placeholder="placeholder.input.input_order_number"
        :label="$t('form.label.order_number')"/>
    </app-form-item>
    <app-form-item
      prop="orderQuote">
      <app-input
        v-model="form.orderQuote"
        placeholder="placeholder.input.input_order_quote"
        :label="$t('form.label.order_quote')"/>
    </app-form-item>
    <app-form-item
      prop="currencyCode">
      <app-select
        v-model="form.currencyCode"
        :options="currencyList"
        full-width
        option-label="name"
        option-value="code"
        placeholder="placeholder.select.select_currency"
        :label="$t('form.label.currency')">
        <template #option="{scope}">
          {{ scope.name }} ({{ scope.code }})
        </template>
      </app-select>
    </app-form-item>
    <app-form-item
      prop="description">
      <app-input
        v-model="form.description"
        placeholder="placeholder.input.input_description"
        :label="$t('form.label.description')"/>
    </app-form-item>
    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.create') }}
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
import {
  SimpleRequiredValidationRule,
  OnChangeRequiredValidationRule,
  SimpleNumberValidationRule,
} from '@/rules/validation';
import { IssuersRequests } from '@/services/requests';
import { successNotification, errorNotification } from '@/utils';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { ICurrency } from '@/services/requests/currencies/Currency.types';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class CreateIssuerForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, required: true }) private currencyList!: ICurrency[];

  @Prop({ type: Boolean, default: false }) private isLoadingCurrency!: boolean;

  public form: IIssuer = {
    snPrefix: '',
    currencyCode: '',
    name: '',
    description: '',
    active: true,
    orderNumber: null,
    orderQuote: null,
  };

  public rules = {
    snPrefix: SimpleRequiredValidationRule(),
    currencyCode: OnChangeRequiredValidationRule(),
    name: SimpleRequiredValidationRule(),
    orderNumber: SimpleNumberValidationRule(),
    orderQuote: SimpleNumberValidationRule(),
  };

  public isLoading: boolean = false;

  get showSpinner(): boolean {
    return this.isLoadingCurrency || this.isLoading;
  }

  @Emit('created')
  onCreated(): boolean {
    return true;
  }

  public async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await IssuersRequests.create(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    } else {
      successNotification();
      this.onCreated();
    }
  }

}
</script>

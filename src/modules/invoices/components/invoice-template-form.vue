<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    :server-errors="serverErrors"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="delete">
      <button
        class="dotted button-as-text"
        @click.prevent="$emit('delete', templateId)">
        {{ $t('action.delete_template') }}
      </button>
    </app-form-item>
    <app-form-item
      prop="templateName">
      <app-input
        v-model="form.templateName"
        label="form.label.template_name"
        placeholder="placeholder.input.template_name"
        clearable/>
    </app-form-item>

    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        label="form.label.invoice_name"
        placeholder="placeholder.input.invoice_name"
        clearable/>
    </app-form-item>

    <app-form-item prop="payerContact">
      <app-input
        v-model="form.payerContact"
        label="form.label.payer_contact"
        placeholder="placeholder.input.payer_contact"
        clearable/>
    </app-form-item>

    <app-form-item prop="recipientCoin">
      <app-select
        v-model="form.recipientCoin"
        :options="coinsList"
        full-width
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.recipient_coin"
        label="form.label.recipient_coin">
        <template #option="{scope}">
          {{ scope.name }} ({{ scope.serial }})
        </template>
      </app-select>
    </app-form-item>

    <app-form-item prop="expiresAt">
      <app-input label="form.label.expires_at">
        <app-date-picker
          v-model="form.expiresAt"
          full-width
          prefix-icon="el-icon-none"
          placeholder="placeholder.select.select_date"/>
      </app-input>
    </app-form-item>

    <app-form-item prop="productCode">
      <app-input
        v-model="form.productCode"
        label="form.label.product_code"
        placeholder="placeholder.input.product_code"
        clearable/>
    </app-form-item>

    <app-form-item prop="count">
      <app-input
        v-model="form.count"
        label="form.label.count"
        placeholder="placeholder.input.count"
        clearable/>
    </app-form-item>

    <app-form-item prop="productPrice">
      <app-input
        v-model="form.productPrice"
        label="form.label.product_price"
        placeholder="placeholder.input.product_price"
        clearable/>
    </app-form-item>

    <app-form-item prop="amount">
      <app-input
        v-model="form.amount"
        label="form.label.amount"
        placeholder="placeholder.input.amount"
        clearable/>
    </app-form-item>

    <app-form-item prop="description">
      <app-input
        v-model="form.description"
        label="form.label.description"
        placeholder="placeholder.input.description"
        clearable/>
    </app-form-item>

    <app-button
      class="btn-submit"
      full-width
      native-type="submit"
      type="primary">
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import { OnChangeRequiredValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { InvoicesTemplatesRequests, WalletsRequests } from '@/services/requests';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import {
  IInvoiceTemplatesRecord,
  IInvoiceTemplateUpdate,
} from '@/services/requests/invoice-templates/InvoicesTemplates.types';
import { IPlainObject } from '@/types/interfaces';
import { TServerError } from '@/types/interfaces/ServerError.interface';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppSwitch,
    AppFormItem,
    AppSelect,
    AppInput,
    AppButton,
    AppDatePicker,
  },
})
export default class InvoiceTemplateForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: IInvoiceTemplatesRecord;

  protected templateId: string = '';

  protected isLoading: boolean = false;

  protected coinsList: IWalletRecord[] = [];

  protected serverErrors: TServerError[] = [];

  protected form: IInvoiceTemplateUpdate = {
    templateName: '',
    name: '',
    payerContact: '',
    recipientCoin: '',
    expiresAt: '',
    productCode: '',
    count: null,
    productPrice: null,
    amount: null,
    description: '',
  }

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    payerContact: SimpleRequiredValidationRule(),
    productCode: SimpleRequiredValidationRule(),
    count: SimpleRequiredValidationRule(),
    productPrice: SimpleRequiredValidationRule(),
    amount: SimpleRequiredValidationRule(),
    description: SimpleRequiredValidationRule(),
    recipientCoin: OnChangeRequiredValidationRule(),
    expiresAt: OnChangeRequiredValidationRule(),
    templateName: SimpleRequiredValidationRule(),
  }

  @Watch('formData', { immediate: true })
  protected setForm(data: IInvoiceTemplatesRecord): void {
    const {
      id,
      templateName,
      name,
      data: {
        productCode, count, productPrice, description,
      },
      payerContact,
      recipientCoin,
      expiresAt,
      amount,
    } = data;

    this.form = {
      templateName,
      name,
      payerContact,
      recipientCoin,
      expiresAt,
      productCode,
      count,
      productPrice,
      amount,
      description,
    };

    this.templateId = id;
  }

  protected created(): void {
    this.fetchCoins();
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
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
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const {
      name,
      payerContact,
      productCode,
      count,
      productPrice,
      amount,
      description,
      recipientCoin,
      expiresAt,
      templateName,
    } = this.form;

    const invoiceDraft = {
      name,
      payerContact,
      recipientCoin,
      amount: Number(amount),
      expiresAt,
      data: {
        productCode,
        productPrice: Number(productPrice),
        description,
        count: Number(count),
      },
    };

    this.isLoading = true;

    const { error } = await InvoicesTemplatesRequests.updateRecord(this.templateId, {
      name: templateName,
      invoiceDraft,
    });

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.serverErrors = error.errors;

      return;
    }
    this.onSubmit();
  }

}
</script>

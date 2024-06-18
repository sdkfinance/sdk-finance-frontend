<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    :server-errors="serverErrors"
    @submit.native.prevent="handleForm">
    <invoices-created-block
      v-if="isInvoiceCreated && createdInvoiceRecord"
      :invoice="createdInvoiceRecord" />

    <template v-if="!isInvoiceCreated">
      <app-form-item
        v-if="!isResend"
        prop="templateName">
        <app-select
          v-model="form.templateName"
          :options="invoiceTemplates"
          full-width
          option-label="name"
          option-value="name"
          placeholder="placeholder.select.select_invoice_template"
          label="form.label.template"
          @change="chooseTemplate" />
      </app-form-item>

      <app-form-item prop="name">
        <app-input
          v-model="form.name"
          label="form.label.invoice_name"
          placeholder="placeholder.input.invoice_name"
          clearable />
      </app-form-item>

      <app-form-item prop="payerContact">
        <app-input
          v-model="form.payerContact"
          label="form.label.payer_contact"
          placeholder="placeholder.input.payer_contact"
          clearable />
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
          <template #option="{ scope }"> {{ scope.name }} ({{ scope.serial }}) </template>
        </app-select>
      </app-form-item>

      <app-form-item prop="expiresAt">
        <app-input label="form.label.expires_at">
          <app-date-picker
            v-model="form.expiresAt"
            full-width
            placeholder="placeholder.select.select_date" />
        </app-input>
      </app-form-item>

      <app-form-item prop="productCode">
        <app-input
          v-model="form.productCode"
          label="form.label.product_code"
          placeholder="placeholder.input.product_code"
          clearable />
      </app-form-item>

      <app-form-item prop="count">
        <app-input
          v-model="form.count"
          label="form.label.count"
          placeholder="placeholder.input.count"
          clearable />
      </app-form-item>

      <app-form-item prop="productPrice">
        <app-input
          v-model="form.productPrice"
          label="form.label.product_price"
          placeholder="placeholder.input.product_price"
          clearable />
      </app-form-item>

      <app-form-item prop="amount">
        <app-input
          v-model="form.amount"
          label="form.label.amount"
          placeholder="placeholder.input.amount"
          clearable />
      </app-form-item>

      <app-form-item prop="description">
        <app-input
          v-model="form.description"
          label="form.label.description"
          placeholder="placeholder.input.description"
          clearable />
      </app-form-item>

      <app-form-item prop="switch">
        <app-switch
          v-model="isSaveAsTemplateActive"
          label="form.label.save_as_template" />
      </app-form-item>

      <app-form-item
        v-if="isSaveAsTemplateActive"
        prop="createTemplateName">
        <app-input
          v-model="form.createTemplateName"
          label="form.label.template_name"
          placeholder="placeholder.input.template_name"
          clearable />
      </app-form-item>

      <invoices-commission-block
        v-if="isCommissionCalculated"
        :commission="commission" />

      <app-button
        v-if="!isCommissionCalculated"
        class="btn-submit"
        full-width
        type="primary"
        @click.prevent="calculateCommission">
        {{ $t('action.next') }}
      </app-button>

      <app-button
        v-else
        class="btn-submit"
        full-width
        native-type="submit"
        type="primary">
        {{ $t('action.create_invoice') }}
      </app-button>
    </template>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
import type { IInvoiceCreate, IInvoicesCommissionBlock, IInvoicesRecord, IWalletRecord } from '@sdk5/shared/requests';
import { InvoicesRequests, WalletsRequests } from '@sdk5/shared/requests';
import type { IPlainObject, TServerError } from '@sdk5/shared/types';
import { errorNotification, getNextDay } from '@sdk5/shared/utils';
import {
  EmailOrPhoneValidationRule,
  OnChangeRequiredValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
} from '@sdk5/shared/validation';
import { AppButton, AppDatePicker, AppForm, AppFormItem, AppInput, AppSelect, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

import type { IInvoiceTemplatesRecord } from '../../../requests';
import { InvoicesTemplatesRequests } from '../../../requests';
import InvoicesCommissionBlock from './invoices-commission-block.vue';
import InvoicesCreatedBlock from './invoices-created-block.vue';

const NEXT_DAY_ISO_STRING = getNextDay().toISOString();

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
  name: 'create-invoice-form',
  components: COMPONENTS,
})
export default class CreateInvoiceForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Boolean, default: false }) readonly isResend!: boolean;

  @Prop({ type: Object as PropType<IInvoicesRecord>, default: null }) readonly formData!: IInvoicesRecord | null;

  $props!: {
    isResend?: boolean;
    formData?: IInvoicesRecord;
  };

  @Emit('created')
  protected onCreated(): boolean {
    return true;
  }

  @Watch('form', { deep: true })
  onFormChanged() {
    if (this.isCommissionCalculated) {
      this.isCommissionCalculated = false;
    }
  }

  @Watch('formData', { immediate: true })
  protected setForm(data: IInvoiceTemplatesRecord): void {
    if (!data) {
      return;
    }

    const {
      templateName,
      name,
      data: { productCode = '', count = null, productPrice = null, description = '' } = {},
      payerContact,
      recipientCoin,
      expiresAt,
      amount,
    } = data || {};

    this.form = {
      templateName,
      name,
      payerContact,
      recipientCoin,
      expiresAt: expiresAt ?? NEXT_DAY_ISO_STRING,
      productCode,
      count,
      productPrice,
      amount,
      description,
      createTemplateName: '',
    };
  }

  created() {
    if (!this.isResend) {
      this.getInvoiceTemplates();
    }

    this.fetchCoins();
  }

  protected isLoading: boolean = false;

  protected isSaveAsTemplateActive: boolean = false;

  protected invoiceTemplates: IInvoiceTemplatesRecord[] = [];

  protected coinsList: IWalletRecord[] = [];

  protected createdInvoiceRecord: IInvoicesRecord | null = null;

  protected isCommissionCalculated: boolean = false;

  protected isInvoiceCreated: boolean = false;

  protected commission: IInvoicesCommissionBlock | null = null;

  protected serverErrors: TServerError[] = [];

  protected form: IInvoiceCreate = {
    templateName: '',
    name: '',
    payerContact: '',
    recipientCoin: '',
    expiresAt: NEXT_DAY_ISO_STRING,
    productCode: '',
    count: null,
    productPrice: null,
    amount: null,
    description: '',
    createTemplateName: '',
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    payerContact: EmailOrPhoneValidationRule(true, 'blur'),
    productCode: SimpleRequiredValidationRule(),
    count: SimpleNumberValidationRule(),
    productPrice: SimpleNumberValidationRule(),
    amount: SimpleNumberValidationRule(),
    description: SimpleRequiredValidationRule(),
    recipientCoin: OnChangeRequiredValidationRule(),
    expiresAt: OnChangeRequiredValidationRule(),
    createTemplateName: SimpleRequiredValidationRule(),
  };

  protected get formCountAndProductPriceValues() {
    const { count, productPrice } = this.form;
    return [count, productPrice];
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

  protected chooseTemplate(templateName: string): void {
    const chosenTemplate = this.invoiceTemplates.filter((template) => template.name === templateName)[0] || {};

    const {
      name,
      payerContact,
      recipientCoin,
      expiresAt,
      amount,
      description = '',
      data: { productCode = '', count = null, productPrice = null } = {},
    } = chosenTemplate || {};

    this.form = {
      name,
      payerContact,
      recipientCoin,
      expiresAt,
      productCode,
      count,
      productPrice,
      amount,
      description,
      createTemplateName: '',
    };
  }

  protected async getInvoiceTemplates(): Promise<void> {
    this.isLoading = true;

    const { response, error } = await InvoicesTemplatesRequests.fetchRecords();

    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.invoiceTemplates = response?.records || [];
  }

  protected async calculateCommission(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const { payerContact, recipientCoin, amount } = this.form;

    const { response } = await InvoicesRequests.calcInvoiceCommissionAsMerch({
      payerContact,
      recipientCoin,
      amount,
    });

    if (!response) {
      return;
    }

    const {
      commissionAmountPush,
      senderAmountPush,
      currency: { code: currency },
    } = response;

    this.commission = {
      payerContact,
      commissionAmountPush,
      senderAmountPush,
      currency,
    };

    this.isCommissionCalculated = true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const {
      name,
      payerContact,
      productCode = '',
      count,
      productPrice,
      amount,
      description,
      recipientCoin,
      expiresAt,
      createTemplateName,
    } = this.form || {};

    const options = {
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

    const { response, error } = await InvoicesRequests.createInvoice(options);

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.serverErrors = error.errors;

      return;
    }

    if (this.isSaveAsTemplateActive) {
      this.isLoading = true;

      await InvoicesTemplatesRequests.createRecord({
        name: createTemplateName,
        invoiceDraft: {
          ...options,
        },
      });

      this.isLoading = false;
    }

    this.createdInvoiceRecord = response.invoice || [];
    this.isInvoiceCreated = true;
    this.onCreated();
  }

  @Watch('formCountAndProductPriceValues', { deep: true })
  protected formChangeHandler(values: (number | null)[]) {
    const [count, productPrice] = values;
    const productPriceNumber = parseInt(`${productPrice}`, 10);
    const countNumber = parseInt(`${count}`, 10);

    if (Number.isNaN(productPriceNumber) || Number.isNaN(countNumber)) {
      return;
    }

    this.form.amount = productPriceNumber * countNumber;
  }
}
</script>

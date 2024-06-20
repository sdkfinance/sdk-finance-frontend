<template>
  <app-form
    ref="appFormRef"
    :loading="isLoaderVisible"
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

      <app-form-item prop="sendPaymentLink">
        <app-switch
          v-model="form.sendPaymentLink"
          label="form.label.send_payment_link_to_the_client"
          is-label-after />
      </app-form-item>

      <app-form-item prop="recipientCoin">
        <app-select
          v-model="form.recipientCoin"
          :options="coinList"
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

<script setup lang="ts">
import { useGetWalletsApi } from '@sdk5/shared/composables';
import type { IInvoiceCreate, IInvoiceCreateOptions, IInvoicesCommissionBlock, IInvoicesRecord } from '@sdk5/shared/requests';
import { InvoicesRequests } from '@sdk5/shared/requests';
import type { IPlainObject, TServerError } from '@sdk5/shared/types';
import { errorNotification, getNextDay } from '@sdk5/shared/utils';
import {
  EmailOrPhoneValidationRule,
  OnChangeRequiredValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
} from '@sdk5/shared/validation';
import { AppButton, AppDatePicker, AppForm, AppFormItem, AppInput, AppSelect, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import type { IInvoiceTemplatesRecord } from '../../../requests';
import { InvoicesTemplatesRequests } from '../../../requests';
import InvoicesCommissionBlock from './invoices-commission-block.vue';
import InvoicesCreatedBlock from './invoices-created-block.vue';

const NEXT_DAY_ISO_STRING = getNextDay().toISOString();

const props = withDefaults(
  defineProps<{
    isResend?: boolean;
    formData?: IInvoiceTemplatesRecord | null;
  }>(),
  {
    isResend: false,
    formData: null,
  },
);
const emit = defineEmits(['created']);

const rules: IPlainObject = {
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

const { coinList, isFetching: isWalletsFetching } = useGetWalletsApi();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const form = ref<IInvoiceCreate>({
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
  sendPaymentLink: false,
});
const serverErrors = ref([] as TServerError[]);
const commission = ref(null as IInvoicesCommissionBlock | null);
const createdInvoiceRecord = ref(null as IInvoicesRecord | null);
const invoiceTemplates = ref([] as IInvoiceTemplatesRecord[]);
const isInvoiceCreated = ref(false);
const isCommissionCalculated = ref(false);
const isSaveAsTemplateActive = ref(false);
const isLoading = ref(false);

const isLoaderVisible = computed(() => isLoading.value || isWalletsFetching.value);
const formCountAndProductPriceValues = computed(() => {
  const { count, productPrice } = form.value;
  return [count, productPrice];
});

const onCreated = () => {
  emit('created', true);
};
const chooseTemplate = (templateName: string) => {
  const chosenTemplate = (invoiceTemplates.value.filter((template) => template.name === templateName)[0] || {}) as IInvoiceTemplatesRecord;

  const {
    name,
    payerContact,
    recipientCoin,
    expiresAt,
    amount,
    description = '',
    data: { productCode = '', count = null, productPrice = null } = {},
  } = chosenTemplate || {};

  form.value = {
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
};
const getInvoiceTemplates = async () => {
  isLoading.value = true;
  const { response, error } = await InvoicesTemplatesRequests.fetchRecords();
  isLoading.value = false;

  if (error) {
    errorNotification(error);
  }

  invoiceTemplates.value = response?.records || [];
};
const calculateCommission = async () => {
  const isValid = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  const { payerContact, recipientCoin, amount } = form.value;

  const { response, error } = await InvoicesRequests.calcInvoiceCommissionAsMerch({
    payerContact,
    recipientCoin,
    amount,
  });

  if (error !== null) {
    errorNotification(error);
    return;
  }

  const {
    commissionAmountPush,
    senderAmountPush,
    currency: { code: currency },
  } = response;

  commission.value = {
    payerContact,
    commissionAmountPush,
    senderAmountPush,
    currency,
  };

  isCommissionCalculated.value = true;
};
const handleForm = async () => {
  const isValid = await appFormRef.value.validate();

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
    sendPaymentLink,
  } = form.value || {};

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
    sendPaymentLink,
  } satisfies IInvoiceCreateOptions;

  isLoading.value = true;
  const { response, error } = await InvoicesRequests.createInvoice(options);
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    serverErrors.value = error.errors;

    return;
  }

  if (isSaveAsTemplateActive.value) {
    isLoading.value = true;

    await InvoicesTemplatesRequests.createRecord({
      name: createTemplateName,
      invoiceDraft: {
        ...options,
      },
    });

    isLoading.value = false;
  }

  createdInvoiceRecord.value = response.invoice || [];
  isInvoiceCreated.value = true;
  onCreated();
};
const setForm = (data: IInvoiceTemplatesRecord | null) => {
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

  form.value = {
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
};
const onFormChanged = () => {
  if (isCommissionCalculated.value) {
    isCommissionCalculated.value = false;
  }
};
const formChangeHandler = (values: (number | null)[]) => {
  const [count, productPrice] = values;
  const productPriceNumber = parseInt(`${productPrice}`, 10);
  const countNumber = parseInt(`${count}`, 10);

  if (Number.isNaN(productPriceNumber) || Number.isNaN(countNumber)) {
    return;
  }

  form.value.amount = productPriceNumber * countNumber;
};

onMounted(() => {
  if (!props.isResend) {
    getInvoiceTemplates();
  }
});

watch(form, onFormChanged, { deep: true });
watch(() => props.formData, setForm, { immediate: true });
watch(formCountAndProductPriceValues, formChangeHandler, { deep: true });
</script>

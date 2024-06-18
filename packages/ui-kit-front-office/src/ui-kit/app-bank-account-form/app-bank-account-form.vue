<template>
  <app-form
    ref="appFormRef"
    :model="form"
    :rules="rules"
    :loading="isFormLoading"
    class="bank-account-form"
    @submit.native.prevent="formSubmitHandler">
    <div class="bank-account-form__header">
      <app-form-item prop="isDefault">
        <app-switch
          v-model="form.isDefault"
          is-label-after
          label="form.label.use_as_default_bank_account" />
      </app-form-item>
      <div class="bank-account-form__title">
        {{ $t('pages.bank_accounts.bank_account_details') }}
      </div>
    </div>
    <div class="bank-account-form__main">
      <app-form-item prop="bankAccountNumber">
        <app-input
          v-model="form.bankAccountNumber"
          size="large"
          placeholder="placeholder.input.enter_bank_account_number"
          label="form.label.bank_account_number" />
      </app-form-item>
      <app-form-item prop="iban">
        <app-input
          v-model="form.iban"
          size="large"
          placeholder="placeholder.input.enter_or_generate_iban"
          label="form.label.iban">
          <template #label-action>
            <div
              v-if="!isDetailsForm"
              class="bank-account-form__generate-iban">
              <app-button
                type="secondary"
                native-type="button"
                size="small"
                transparent
                @click="generateIbanButtonClickHandler">
                {{ $t('action.generate_iban') }}
              </app-button>
            </div>
          </template>
        </app-input>
      </app-form-item>
      <app-form-item prop="bankId">
        <app-select
          v-model="form.bankId"
          size="large"
          placeholder="placeholder.select.choose_bank"
          label="form.label.bank"
          option-value="value"
          option-label="label"
          :options="catalogDataValueLabelRecords" />
      </app-form-item>
      <app-form-item prop="fullName">
        <app-input
          v-model="form.fullName"
          size="large"
          placeholder="placeholder.input.enter_full_name"
          label="form.label.full_name" />
      </app-form-item>
    </div>

    <div
      v-if="isDetailsForm"
      class="bank-account-form__bank-details">
      <div class="bank-account-form__bank-details-title">
        {{ $t('pages.bank_accounts.bank_details') }}
      </div>
      <bank-details-list
        class="bank-account-form__bank-details-list"
        :details-map="bankDetailsMap" />
    </div>

    <div class="bank-account-form__actions">
      <app-button
        type="primary"
        size="big"
        full-width
        native-type="submit">
        {{ $t(submitButtonText) }}
      </app-button>

      <app-button
        type="secondary"
        size="big"
        native-type="button"
        full-width
        @click="cancelButtonClickHandler">
        {{ $t('action.cancel') }}
      </app-button>
    </div>
  </app-form>
</template>

<script setup lang="ts">
import { useFetchBankCatalog } from '@sdk5/shared/composables';
import config from '@sdk5/shared/config';
import { type IBankAccountRecord, IbanManagementRequests, type ICreateOrUpdateBankAccountWithBankIdRequest } from '@sdk5/shared/requests';
import type { TValueLabelRecord } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { computed, ref, watch } from 'vue';

import { AppButton, AppForm, AppFormItem, AppInput, AppSelect, AppSwitch } from '../../ui-framework';
import { AppBankDetailsList as BankDetailsList } from '../app-bank-details-list';

const props = defineProps<{
  bankAccountFormData?: IBankAccountRecord | null;
}>();

const emit = defineEmits<{
  (event: 'cancel'): void;
  (event: 'create-bank-account', payload: ICreateOrUpdateBankAccountWithBankIdRequest): void;
  (event: 'update-bank-account', payload: ICreateOrUpdateBankAccountWithBankIdRequest & { bankAccountId: string }): void;
}>();

const { catalogData, isLoading: isBankCatalogLoading } = useFetchBankCatalog({ immediate: true });
const appFormRef = ref(null as unknown as InstanceType<typeof AppForm>);
const isLoading = ref(false);
const form = ref<Partial<ICreateOrUpdateBankAccountWithBankIdRequest>>({
  bankAccountNumber: '',
  bankId: '',
  fullName: '',
  iban: '',
  isDefault: false,
});

const catalogDataValueLabelRecords = computed<TValueLabelRecord[]>(() => {
  if (!catalogData.value) {
    return [];
  }

  return catalogData.value.map((item) => ({
    value: item.bankId,
    label: item.name,
  }));
});
const isFormLoading = computed(() => isLoading.value || isBankCatalogLoading.value);
const isDetailsForm = computed(() => !!props.bankAccountFormData);
const rules = computed<Record<keyof typeof form.value, unknown>>(() => {
  return {
    bankAccountNumber: SimpleRequiredValidationRule(),
    fullName: SimpleRequiredValidationRule(),
    iban: SimpleRequiredValidationRule(),
    bankId: SimpleRequiredValidationRule(),
    isDefault: null,
  };
});

const bankDetailsMap = computed(() => {
  const { name, address, bic, city, swift, zipCode, countryCode } = props.bankAccountFormData?.details ?? {};
  return new Map([
    ['form.label.beneficiary', name ?? config.emptyChar],
    ['form.label.bic', bic ?? config.emptyChar],
    ['form.label.swift', swift ?? config.emptyChar],
    ['form.label.beneficiary_address', address ?? config.emptyChar],
    ['form.label.city', city ?? config.emptyChar],
    ['form.label.country', countryCode ?? config.emptyChar],
    ['form.label.zip_code', zipCode ?? config.emptyChar],
  ]);
});
const submitButtonText = computed(() => (isDetailsForm.value ? 'action.update_bank_account' : 'action.add_bank_account'));

const emitCancelEvent = () => {
  emit('cancel');
};
const emitCreateBankAccountEvent = (bankAccountPayload: ICreateOrUpdateBankAccountWithBankIdRequest) => {
  emit('create-bank-account', bankAccountPayload);
};
const emitUpdateBankAccountEvent = (bankAccountPayload: ICreateOrUpdateBankAccountWithBankIdRequest & { bankAccountId: string }) => {
  emit('update-bank-account', bankAccountPayload);
};
const cancelButtonClickHandler = () => {
  emitCancelEvent();
};
const generateIban = async (bankId: string) => {
  isLoading.value = true;
  const { response, error } = await IbanManagementRequests.generateIban(bankId);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return '';
  }

  return response?.iban ?? '';
};
const validateIban = async (iban: string) => {
  isLoading.value = true;
  const { response, error } = await IbanManagementRequests.validateIban(iban);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return false;
  }

  return response.ibanIsValid ?? false;
};
const generateIbanButtonClickHandler = async () => {
  if (!(await appFormRef.value.validateField('bankId'))) {
    return;
  }

  if (!form.value.bankId) {
    return;
  }

  const generatedIban = await generateIban(form.value.bankId);
  form.value.iban = generatedIban;

  if (form.value.iban) {
    appFormRef.value.clearValidate('iban');
  }
};

const formSubmitHandler = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { iban } = form.value as Required<ICreateOrUpdateBankAccountWithBankIdRequest>;

  const isIbanValid = await validateIban(iban);

  if (!isIbanValid) {
    errorNotification('notification.invalid_iban');
    return;
  }

  const payload = form.value as ICreateOrUpdateBankAccountWithBankIdRequest;

  if (isDetailsForm.value) {
    if (!props.bankAccountFormData?.id) {
      throw new Error('bankAccountFormData.id is required');
    }

    emitUpdateBankAccountEvent({
      bankAccountId: props.bankAccountFormData.id,
      ...payload,
    });
    return;
  }

  emitCreateBankAccountEvent(payload);
};

const bankAccountFormDataChangeHandler = (formData?: IBankAccountRecord | null) => {
  if (!formData) {
    return;
  }

  const {
    details: { bankAccountNumber, iban, fullName },
    default: isDefault,
  } = formData;
  form.value.bankAccountNumber = bankAccountNumber;
  form.value.fullName = fullName;
  form.value.iban = iban;
  form.value.isDefault = isDefault;
};

watch(() => props.bankAccountFormData, bankAccountFormDataChangeHandler, { immediate: true });
</script>

<style lang="scss">
.bank-account-form {
  .app-form-item:last-of-type {
    @apply mb-[2rem];
  }

  &__actions {
    @apply w-full flex flex-col gap-y-[1rem];

    .app-button {
      @apply ml-0;
    }
  }

  &__header {
    .app-form-item {
      @apply mb-[1rem];
    }
  }

  &__title,
  &__bank-details-title {
    @apply text-xl font-semibold text-gray-500 leading-[1.5rem] mb-[1rem];
  }

  &__bank-details {
    @apply mb-[2rem];
  }

  &__generate-iban {
    @apply flex justify-end w-full h-full;

    .app-button.btn {
      @apply p-0;
    }
  }
}
</style>

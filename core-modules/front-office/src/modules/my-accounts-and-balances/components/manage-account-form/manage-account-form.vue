<template>
  <app-form
    ref="appFormRef"
    :model="form"
    :rules="rules"
    :loading="isLoading"
    class="form"
    @submit.native.prevent="handleFormSubmit">
    <app-form-item
      v-if="isDeleteButtonVisible"
      prop="delete">
      <button
        type="button"
        class="dotted button-as-text"
        @click="deleteButtonClickHandler">
        {{ $t('action.delete_account') }}
      </button>
    </app-form-item>
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        :size="APP_INPUT_SIZE.large"
        label="form.label.account_name"
        placeholder="placeholder.input.input_account_name" />
    </app-form-item>

    <app-form-item
      v-if="!update"
      prop="customSerial">
      <app-input
        v-model="form.customSerial"
        label="form.label.wallet_serial"
        placeholder="placeholder.input.enter_wallet_serial"
        size="large" />
    </app-form-item>

    <app-form-item
      v-if="isCurrencySelectVisible"
      prop="currencyId">
      <app-select
        v-model="form.currencyId"
        :options="currencyListWithDisplayName"
        :size="APP_SELECT_SIZE.large"
        label="form.label.currency"
        placeholder="placeholder.select.choose_currency"
        value-key="currency.name"
        option-label="displayName"
        option-value="id" />
    </app-form-item>
    <app-button
      native-type="submit"
      :type="APP_BUTTON_TYPES.primary"
      :size="APP_BUTTON_SIZE.big"
      full-width>
      {{ submitButtonText }}
    </app-button>
  </app-form>
</template>

<script setup lang="ts">
import { useGetCurrenciesApi } from '@sdk5/shared/composables';
import { useI18n } from '@sdk5/shared/i18n';
import type { IWalletBody } from '@sdk5/shared/requests';
import { SimpleRequiredValidationRule, WalletSerialValidator } from '@sdk5/shared/validation';
import {
  APP_BUTTON_SIZE,
  APP_BUTTON_TYPES,
  APP_INPUT_SIZE,
  APP_SELECT_SIZE,
  AppButton,
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
} from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

import type { TUpdateAccountPayload } from './types';

const props = withDefaults(
  defineProps<{
    update?: boolean;
    editWalletData?: TUpdateAccountPayload | null;
  }>(),
  {
    editWalletData: null,
    update: false,
  },
);
const emit = defineEmits<{
  (event: 'delete-account', payload: TUpdateAccountPayload): void;
  (event: 'update-account', payload: TUpdateAccountPayload): void;
  (event: 'add-account', payload: IWalletBody): void;
}>();

const { t } = useI18n();

const { currencyListWithDisplayName, isFetching: isGetCurrenciesFetching } = useGetCurrenciesApi();

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const form = ref<IWalletBody>({
  name: '',
  currencyId: '',
  type: 'client',
  customSerial: undefined,
});

const isLoading = computed(() => isGetCurrenciesFetching.value);
const isDeleteButtonVisible = computed(() => props.update);
const isCurrencySelectVisible = computed(() => !props.update);
const submitButtonText = computed(() => {
  const messageKey = props.update ? 'action.update' : 'action.add_account';
  return t(messageKey).toString();
});
const rules = computed<Record<keyof Pick<IWalletBody, 'name' | 'currencyId' | 'customSerial'>, unknown>>(() => ({
  name: SimpleRequiredValidationRule(),
  currencyId: !props.update ? SimpleRequiredValidationRule() : null,
  customSerial: WalletSerialValidator(false),
}));

const editWalletDataChangeHandler = (data?: TUpdateAccountPayload | null) => {
  if (!props.update || !data?.name) {
    return;
  }

  form.value.name = data.name;
};

const deleteButtonClickHandler = () => {
  if (!props.editWalletData) {
    return;
  }

  const { name, serial } = props.editWalletData;

  emit('delete-account', { name, serial });
};

const handleFormSubmit = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  if (props.update) {
    if (!props.editWalletData || !props.editWalletData.serial) {
      return;
    }

    emit('update-account', { name: form.value.name, serial: props.editWalletData.serial });
    return;
  }

  emit('add-account', form.value);
};

watch(() => props.editWalletData, editWalletDataChangeHandler, { immediate: true });
</script>

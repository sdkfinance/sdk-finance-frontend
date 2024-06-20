<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.accounts.add_account') }}
    </template>
    <app-form
      ref="appFormRef"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item prop="name">
        <app-input
          v-model="form.name"
          label="form.label.account_name"
          placeholder="placeholder.input.input_account_name"
          size="large" />
      </app-form-item>
      <app-form-item
        v-if="ENV_VARIABLES.createWalletCustomSerialInputVisible"
        prop="customSerial">
        <app-input
          v-model="form.customSerial"
          label="form.label.wallet_serial"
          placeholder="placeholder.input.enter_wallet_serial"
          size="large" />
      </app-form-item>

      <app-form-item prop="currencyId">
        <app-select
          v-model="form.currencyId"
          clearable
          class="el-form-item"
          label="form.label.currency"
          full-width
          size="large"
          placeholder="placeholder.select.choose_currency"
          value-key="currency.name"
          :options="currencyListWithDisplayName"
          option-label="displayName"
          option-value="id" />
      </app-form-item>

      <app-button
        native-type="submit"
        full-width>
        {{ $t('action.add_account') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script setup lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { useCreateWalletApi, useGetCurrenciesApi, useGetWalletsApi } from '@sdk5/shared/composables';
import { type IWalletBody } from '@sdk5/shared/requests';
import { SimpleRequiredValidationRule, WalletSerialValidator } from '@sdk5/shared/validation';
import { computed, type Ref, ref } from 'vue';

import { AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '../../ui-framework';
import { AppFormWrapper } from '../../ui-kit';

const emit = defineEmits<{
  (event: 'submit', payload: IWalletBody): void;
}>();

const rules: Record<keyof Pick<IWalletBody, 'name' | 'currencyId' | 'customSerial'>, unknown> = {
  name: SimpleRequiredValidationRule(),
  currencyId: SimpleRequiredValidationRule(),
  customSerial: WalletSerialValidator(false),
};

const { currencyListWithDisplayName, isFetching: isGetCurrenciesFetching } = useGetCurrenciesApi();
const { mutateAsync: processAccountCreation, isPending: isCreateWalletPending } = useCreateWalletApi();
const { invalidateWalletsQuery } = useGetWalletsApi({ queryEnabled: false });

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const form = ref<IWalletBody>({
  name: '',
  currencyId: '',
  type: 'client',
  customSerial: undefined,
});

const isLoading = computed(() => isGetCurrenciesFetching.value || isCreateWalletPending.value);

const handleForm = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { error } = await processAccountCreation(form.value);

  if (error === null) {
    invalidateWalletsQuery();
    emit('submit', form.value);
  }
};
</script>

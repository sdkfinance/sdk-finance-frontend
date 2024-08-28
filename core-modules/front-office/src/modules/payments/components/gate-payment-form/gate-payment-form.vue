<template>
  <app-step-controller
    class="gate-payment-form"
    :total-steps="1"
    is-close-visible
    :back-name="backName">
    <template #default="{ goToBackPage }">
      <app-form-wrapper class="gate-payment-form__form-wrapper">
        <template #title>
          {{ $t(formTitle) }}
        </template>
        <app-form
          ref="appFormRef"
          :model="formData"
          :rules="formValidationRules"
          :loading="isLoaderVisible"
          @submit.native.prevent="formSubmitHandler">
          <app-form-item prop="account">
            <account-select
              v-model="formData.account"
              label="form.label.account"
              size="large" />
          </app-form-item>
          <app-form-item
            v-if="isGateProviderSelectVisible"
            prop="gateProviderId">
            <app-select
              v-model="formData.gateProviderId"
              :options="availableGateMethods"
              label="form.label.gate_provider"
              placeholder="placeholder.select.choose_gate_provider"
              option-value="gateProvider.id"
              option-label="gateProvider.name"
              size="large" />
          </app-form-item>
          <app-form-item
            v-if="isPaymentServiceSelectVisible"
            prop="paymentService">
            <app-select
              v-model="formData.paymentService"
              :options="mappedPaymentServices"
              size="large"
              option-value="service"
              option-label="name"
              label="form.label.payment_service"
              placeholder="placeholder.select.choose_payment_service">
            </app-select>
          </app-form-item>

          <template v-if="mainFormContentVisible">
            <slot
              name="default"
              v-bind="{ goToBackPage }" />
            <app-form-item prop="amount">
              <app-input
                v-model="formData.amount"
                size="large"
                label="form.label.amount"
                placeholder="placeholder.input.amount" />
              <calculated-fee
                v-if="calculatedCommission"
                class="gate-payment-form__fee"
                :amount="calculatedCommission.commissionAmount"
                :currency-symbol="calculatedCommission.currency.symbol" />
            </app-form-item>

            <app-button
              native-type="submit"
              type="primary"
              size="big"
              :disabled="isSubmitButtonDisabled"
              full-width>
              {{ $t(submitButtonText) }}
            </app-button>
          </template>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script setup lang="ts">
import type { IGateSubmitPayerBody, IGateTransactionResponse, IPaymentProviderRecord } from '@sdk5/shared';
import {
  errorNotification,
  SimpleNumberRangeValidationRule,
  SimpleRequiredValidationRule,
  TX_TYPES,
  useCalculateGateCommissionApi,
  useCreateGateTransactionApi,
  useSubmitGateTransactionApi,
} from '@sdk5/shared';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppSelect, AppStepController } from '@sdk5/ui-kit-front-office';
import { useVModel } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';

import AccountSelect from '../../../user-dashboard/components/account-select.vue';
import CalculatedFee from '../calculated-fee.vue';
import type { IGatePaymentCommonFormData, ISuccessOperationEmitPayload } from './types';

const AVAILABLE_TX_TYPES = [TX_TYPES.topup, TX_TYPES.redeem] as const;

const props = withDefaults(
  defineProps<{
    requestPending?: boolean;
    mainFormContentVisible?: boolean;
    gateMethodsFetched?: boolean;
    backName: string;
    formTitle: string;
    txType: (typeof AVAILABLE_TX_TYPES)[number];
    value: Partial<IGatePaymentCommonFormData>;
    formValidationRules?: Record<string, unknown>;
    availableGateMethods: IPaymentProviderRecord[];
  }>(),
  {
    requestPending: false,
    mainFormContentVisible: false,
    gateMethodsFetched: false,
    formValidationRules: () => ({}),
  },
);
const emit = defineEmits<{
  (event: 'input', payload: Partial<IGatePaymentCommonFormData>): void;
  (event: 'operation-success', payload: ISuccessOperationEmitPayload): void;
  (event: 'transaction-created', payload: IGateTransactionResponse): void;
}>();

const DEFAULT_ERROR_MESSAGE = 'notification.error';
const COMMON_FORM_VALIDATION_RULES: Record<keyof IGatePaymentCommonFormData, unknown> = {
  account: SimpleRequiredValidationRule(),
  gateProviderId: SimpleRequiredValidationRule(),
  paymentService: SimpleRequiredValidationRule(),
  amount: SimpleNumberRangeValidationRule(),
};

const {
  isPending: isCalculateGateCommissionPending,
  calculatedCommission,
  mutate: calculateCommission,
  clearCalculatedCommission,
} = useCalculateGateCommissionApi();
const { mutateAsync: createTransaction, isPending: isCreateGateTransactionPending } = useCreateGateTransactionApi({ showErrorNotification: false });
const { mutateAsync: submitTransaction, isPending: isSubmitGateTransactionPending } = useSubmitGateTransactionApi({ showErrorNotification: false });

const formData = useVModel(props, 'value', emit, { deep: true, eventName: 'input' });
const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const formValidationRules = computed(() => ({
  ...COMMON_FORM_VALIDATION_RULES,
  ...props.formValidationRules,
}));
const isLoaderVisible = computed(
  () =>
    props.requestPending || isCalculateGateCommissionPending.value || isCreateGateTransactionPending.value || isSubmitGateTransactionPending.value,
);
const isOperationCommissionCalculated = computed(() => !!calculatedCommission.value);
const selectedGateMethod = computed(() =>
  props.availableGateMethods.find((gateMethod) => gateMethod.gateProvider.id === formData.value.gateProviderId),
);
const selectedGateMethodServices = computed(() => selectedGateMethod.value?.services ?? []);
const activeSelectedGateMethodServices = computed(() =>
  selectedGateMethodServices.value.filter(
    (paymentService) => paymentService.active && paymentService.enabled && paymentService.currencyCode === formData.value.account?.currency.code,
  ),
);
const mappedPaymentServices = computed(() =>
  activeSelectedGateMethodServices.value.map((paymentService) => ({
    ...paymentService,
    icon: undefined,
    image: paymentService.icon,
  })),
);
const isPaymentServiceSelectVisible = computed(() => mappedPaymentServices.value.length > 1);
const isGateProviderSelectVisible = computed(() => props.availableGateMethods.length > 1);
const isSubmitButtonDisabled = computed(() => {
  const { amount, account } = formData.value;
  return !(typeof amount !== 'undefined' && account);
});
const submitButtonText = computed(() => (calculatedCommission.value ? 'action.process' : 'action.next'));

const processSubmitTransaction = async (payload: IGateSubmitPayerBody & { txId: string }) => {
  if (!payload) {
    return;
  }

  const { txId, ...submitTransactionPayload } = payload;
  const { response: submitTransactionResponse, error: submitTransactionError } = await submitTransaction({
    ...submitTransactionPayload,
    txId,
  });

  if (submitTransactionError !== null || !submitTransactionResponse?.transaction || submitTransactionResponse.transaction.errorCode) {
    errorNotification(submitTransactionError || submitTransactionResponse.transaction.errorCode || DEFAULT_ERROR_MESSAGE);
    return;
  }

  if (submitTransactionResponse.form) {
    const url = new URL(submitTransactionResponse.form.url);

    if (Object.keys(submitTransactionResponse.form.parameters).length > 0) {
      Object.entries(submitTransactionResponse.form.parameters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    window.open(url.toString(), '_self');
    return;
  }

  emit('operation-success', {
    ...submitTransactionResponse,
    calculatedCommission: calculatedCommission.value,
  });
};
const processTransaction = async () => {
  if (!selectedGateMethod.value) {
    return;
  }

  const { account, amount, gateProviderId } = formData.value as IGatePaymentCommonFormData;

  const { response: createTransactionResponse, error: createTransactionError } = await createTransaction({
    amount,
    coin: account.serial,
    method: { gateProviderId, way: selectedGateMethod.value.way },
    type: props.txType,
  });

  if (createTransactionError !== null || !createTransactionResponse?.transaction || createTransactionResponse.transaction.errorCode) {
    errorNotification(createTransactionError || createTransactionResponse.transaction.errorCode || DEFAULT_ERROR_MESSAGE);
    return;
  }

  emit('transaction-created', createTransactionResponse);
};
const formSubmitHandler = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { account, amount, gateProviderId } = formData.value as IGatePaymentCommonFormData;

  if (!isOperationCommissionCalculated.value) {
    calculateCommission({
      amount,
      gateProviderId,
      serial: account.serial,
      txType: props.txType,
    });

    return;
  }

  processTransaction();
};

watch(mappedPaymentServices, (paymentServices) => {
  formData.value.paymentService = paymentServices.length === 1 ? paymentServices.at(0)?.service : undefined;
});
watch(
  () => props.availableGateMethods,
  (gateMethods) => {
    nextTick(() => {
      formData.value.gateProviderId = gateMethods.length === 1 ? gateMethods.at(0)?.gateProvider.id : undefined;
    });
  },
);
watch(
  () => props.gateMethodsFetched,
  (gateMethodsFetched) => {
    if (gateMethodsFetched && props.availableGateMethods.length === 0) {
      errorNotification('notification.no_gate_methods_for_selected_account');
    }
  },
);
watch(
  () => formData.value.amount,
  () => {
    clearCalculatedCommission();
  },
);
watch(
  () => formData.value.account,
  () => {
    (Object.keys(formData.value) as (keyof typeof formData.value)[]).forEach((key) => {
      if (key !== 'account') {
        formData.value[key] = undefined;
      }
    });
  },
);

defineExpose({
  processSubmitTransaction,
});
</script>

<style lang="scss">
.gate-payment-form {
  &__form-wrapper {
    @apply max-w-[512px] mx-auto;
  }

  &__fee {
    @apply mt-[1rem];
  }
}
</style>

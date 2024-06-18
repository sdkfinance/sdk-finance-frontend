<template>
  <app-step-controller
    class="top-up-corefy"
    :total-steps="1"
    is-close-visible
    back-name="user-top-up-payment-card-operations">
    <template #default>
      <app-form-wrapper class="top-up-corefy__form-wrapper">
        <template #title>
          {{ $t('pages.user_dashboard.payments.top_up_corefy_title') }}
        </template>
        <app-form
          ref="appFormRef"
          :model="form"
          :rules="rules"
          :loading="loaderVisible"
          @submit.native.prevent>
          <div class="top-up-corefy__subtitle">
            {{ $t('pages.user_dashboard.payments.top_up_corefy_subtitle') }}
          </div>
          <app-form-item prop="account">
            <account-select
              v-model="form.account"
              label="form.label.account" />
          </app-form-item>
          <!-- Temporary hidden -->
          <!-- <app-form-item prop="paymentService">
            <app-select
              v-model="form.paymentService"
              placeholder="placeholder.select.choose_payment_service"
              label="form.label.payment_service"
              :options="paymentServices"
              :disabled="!paymentServices"
              option-label="service"
              option-value="service"
              size="large" />
          </app-form-item> -->
          <app-form-item prop="tokenizeCard">
            <app-switch
              v-model="form.tokenizeCard"
              is-label-after
              label="action.tokenize_card" />
          </app-form-item>
          <app-form-item prop="amount">
            <app-input
              v-model="form.amount"
              size="large"
              label="form.label.transaction_amount" />
          </app-form-item>
          <div class="top-up-corefy__fee">
            <template v-if="isCommissionExist">
              <operation-commission>
                <template #label-1>
                  {{ $t('form.label.fee') }}
                </template>
                <template #value-1>
                  {{ topUpCommissionAmountString }}
                </template>
              </operation-commission>
            </template>
            <top-up-no-fee v-else />
          </div>
          <app-button
            type="secondary"
            native-type="button"
            :disabled="isNextButtonDisabled"
            @click="handleFormNext">
            {{ $t('action.next') }}
          </app-button>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script setup lang="ts">
import { useCalculateGateCommissionApi, useCreateGateTransactionApi, useSubmitGateTransactionApi } from '@sdk5/shared/composables';
import { TX_TYPES } from '@sdk5/shared/constants';
import type { ICoin, IGateCreateTransactionBody, IGateSubmitPayerBody } from '@sdk5/shared/requests';
import { OnChangeRequiredValidationRule, SimpleNumberValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppStepController, AppSwitch } from '@sdk5/ui-kit-front-office';
import { computed, type Ref, ref, watch } from 'vue';

import AccountSelect from '../user-dashboard/components/account-select.vue';
import OperationCommission from '../user-dashboard/components/operation-commission.vue';
import TopUpNoFee from './components/top-up-no-fee.vue';

const COREFY_TOP_UP_TX_TYPE = TX_TYPES.topup;
const COREFY_GATE_PROVIDER_ID = 'Corefy';
const COREFY_GATE_METHOD_WAY = 'CARD';

type TTopUpCorefyForm = {
  account: ICoin;
  amount: number;
  tokenizeCard: boolean;
};

const {
  isPending: isCalculateGateCommissionPending,
  calculatedCommission: topUpCommission,
  calculateCommissionDebounced,
} = useCalculateGateCommissionApi();
const { mutateAsync: createTransaction, isPending: isCreateGateTransactionPending } = useCreateGateTransactionApi();
const { mutateAsync: submitTransaction, isPending: isSubmitGateTransactionPending } = useSubmitGateTransactionApi();

const rules: Record<keyof TTopUpCorefyForm, unknown> = {
  account: OnChangeRequiredValidationRule(),
  amount: SimpleNumberValidationRule(),
  tokenizeCard: null,
};

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const form = ref<Partial<TTopUpCorefyForm>>({
  tokenizeCard: false,
});

const loaderVisible = computed(
  () => isCalculateGateCommissionPending.value || isCreateGateTransactionPending.value || isSubmitGateTransactionPending.value,
);
const isCommissionCalculated = computed(() => topUpCommission.value !== null);
const isCommissionExist = computed(() => isCommissionCalculated.value && topUpCommission.value!.commissionAmount > 0);
const isNextButtonDisabled = computed(() => loaderVisible.value);
const topUpCommissionAmountString = computed(() => {
  if (!isCommissionExist.value) {
    return '';
  }

  return `${topUpCommission.value!.commissionAmount} ${topUpCommission.value!.currency?.symbol ?? ''}`;
});
const selectAccountCurrencyCode = computed(() => form.value?.account?.currency?.code ?? null);
const currentPaymentService = computed(() =>
  selectAccountCurrencyCode.value ? `payment_card_${selectAccountCurrencyCode.value.toLowerCase()}_hpp` : null,
);

const processTransaction = async (createTransactionPayload: IGateCreateTransactionBody & { paymentServiceName: string; tokenize: boolean }) => {
  const { paymentServiceName, tokenize, ...createPayload } = createTransactionPayload;
  const { response: createTransactionResponse } = await createTransaction(createPayload);

  if (!createTransactionResponse || !createTransactionResponse.transaction) {
    return;
  }

  const submitTransactionPayload: IGateSubmitPayerBody = {
    optionName: 'default',
    fields: {
      service: paymentServiceName,
      testMode: true,
      referenceId: createTransactionResponse.transaction.id,
      tokenize,
    },
  };

  const { response: submitTransactionResponse } = await submitTransaction({
    ...submitTransactionPayload,
    txId: createTransactionResponse.transaction.id,
  });

  if (!submitTransactionResponse?.form) {
    return;
  }

  const url = new URL(submitTransactionResponse.form.url);

  if (Object.keys(submitTransactionResponse.form.parameters).length > 0) {
    Object.entries(submitTransactionResponse.form.parameters).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  window.open(url.toString(), '_self');
};

const handleFormNext = async () => {
  if (!(await appFormRef.value.validate()) || !currentPaymentService.value) {
    return;
  }

  const { account, amount, tokenizeCard } = form.value as TTopUpCorefyForm;

  processTransaction({
    amount: amount as number,
    coin: account!.serial,
    method: { gateProviderId: COREFY_GATE_PROVIDER_ID, way: COREFY_GATE_METHOD_WAY },
    type: COREFY_TOP_UP_TX_TYPE,
    paymentServiceName: currentPaymentService.value,
    tokenize: tokenizeCard,
  });
};

const formAmountChangeHandler = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { account, amount } = form.value;

  if (!account || typeof amount === 'undefined') {
    return;
  }

  const { serial } = account;

  calculateCommissionDebounced({
    amount: Number(amount),
    gateProviderId: COREFY_GATE_PROVIDER_ID,
    serial,
    txType: COREFY_TOP_UP_TX_TYPE,
  });
};

watch(() => form.value.amount, formAmountChangeHandler);
</script>

<style lang="scss">
.top-up-corefy {
  &__form-wrapper {
    @apply max-w-[512px] mx-auto;
  }

  &__subtitle {
    @apply mb-[2rem] text-gray-500 font-medium text-xl leading-[140%];
  }

  &__fee {
    @apply mb-[2rem];
  }

  .app-form-wrapper {
    @apply mt-0;
  }
}
</style>

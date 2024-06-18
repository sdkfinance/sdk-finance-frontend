<template>
  <app-step-controller
    class="withdraw-corefy"
    back-name="user-withdrawal-via-debit-card"
    is-close-visible
    :total-steps="1">
    <template #default="{ goToBackPage }">
      <app-form-wrapper class="withdraw-corefy__form-wrapper">
        <template #title>
          {{ $t('pages.user_dashboard.payments.corefy') }}
        </template>
        <app-form
          ref="appFormRef"
          :model="formData"
          :rules="validationRules"
          :loading="isLoaderVisible"
          class="withdraw-corefy__form"
          @submit.native.prevent="formSubmitHandler">
          <div class="withdraw-corefy__form-subtitle">
            {{ $t('pages.user_dashboard.payments.withdrawal_via_bank_transfer_subtitle') }}
          </div>
          <app-form-item prop="accountFrom">
            <account-select
              v-model="formData.accountFrom"
              label="form.label.account_from" />
          </app-form-item>
          <!-- Temporary hidden -->
          <!-- <app-form-item prop="paymentService">
            <app-select
              v-model="formData.paymentService"
              placeholder="placeholder.select.choose_payment_service"
              label="form.label.payment_service"
              :options="paymentServices"
              :disabled="!paymentServices"
              option-label="service"
              option-value="service"
              size="large" />
          </app-form-item> -->
          <app-form-item prop="toCard">
            <app-select
              v-model="formData.toCard"
              size="large"
              label="form.label.card"
              placeholder="placeholder.select.choose_card"
              option-label="mask"
              option-value="token"
              :options="userCardTokens" />
            <template #action>
              <app-button
                native-type="button"
                type="secondary"
                size="small"
                icon="icon-plus"
                no-padding
                transparent
                :disabled="!selectedWalletSerial"
                @click="addCardAction">
                {{ $t('action.add_card') }}
              </app-button>
            </template>
          </app-form-item>
          <app-form-item prop="amount">
            <app-input
              v-model="formData.amount"
              size="large"
              label="form.label.amount"
              placeholder="placeholder.input.amount" />
            <calculated-fee
              v-if="withdrawCommission"
              class="withdraw-corefy__fee"
              :amount="withdrawCommission.commissionAmount"
              :currency-symbol="withdrawCommission.currency.symbol" />
          </app-form-item>

          <app-button
            native-type="submit"
            type="primary"
            size="big"
            :disabled="isSubmitButtonDisabled"
            full-width>
            {{ $t(submitButtonText) }}
          </app-button>
        </app-form>
      </app-form-wrapper>
      <app-modal
        ref="withdrawResultModal"
        is-centred
        is-full-width
        @closed="goToBackPage()">
        <template #default="{ onSubmit }">
          <app-info-modal
            v-if="!!withdrawResultModalData"
            :title="withdrawResultModalData.title"
            :subtitle="withdrawResultModalData.subtitle"
            :type="withdrawResultModalData.modalType"
            confirm-text="action.done"
            :is-cancel-visible="false"
            @confirm="
              onSubmit();
              goToBackPage();
            " />
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script setup lang="ts">
import {
  useCalculateGateCommissionApi,
  useCreateCardTokenApi,
  useCreateGateTransactionApi,
  useSubmitGateTransactionApi,
  useViewCardTokensApi,
} from '@sdk5/shared/composables';
import { TX_TYPES } from '@sdk5/shared/constants';
import { useI18n } from '@sdk5/shared/i18n';
import type { ICoin } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { SimpleNumberRangeValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import {
  AppButton,
  AppForm,
  AppFormItem,
  AppFormWrapper,
  AppInfoModal,
  AppInput,
  AppModal,
  AppSelect,
  AppStepController,
  InfoModalTypes,
  type TModalTypes,
} from '@sdk5/ui-kit-front-office';
import { computed, type Ref, ref } from 'vue';

import AccountSelect from '../user-dashboard/components/account-select.vue';
import CalculatedFee from './components/calculated-fee.vue';

type TWithdrawCorefyPayload = {
  accountFrom: ICoin;
  toCard: string;
  amount: number;
};
type WithdrawResultModalData = {
  title: string;
  subtitle: string;
  modalType: TModalTypes;
};

const COREFY_REDEEM_TX_TYPE = TX_TYPES.redeem;
const COREFY_PROVIDER_ID = 'Corefy';
const COREFY_GATE_METHOD_WAY = 'CARD';
const COREFY_REDEEM_PAYMENT_SERVICE = 'card_token';

const {
  isPending: isCalculateGateCommissionPending,
  calculatedCommission: withdrawCommission,
  mutateAsync: calculateCommission,
} = useCalculateGateCommissionApi();
const { mutateAsync: createTransaction, isPending: isCreateGateTransactionPending } = useCreateGateTransactionApi();
const { mutateAsync: submitTransaction, isPending: isSubmitGateTransactionPending } = useSubmitGateTransactionApi();
const { mutateAsync: createCardToken, isPending: isCreateCardTokenMutationPending } = useCreateCardTokenApi();
const { cardTokenRecords: userCardTokens, isFetching: isCardTokensFetching } = useViewCardTokensApi({ pageNumber: 0, pageSize: 10 });

const validationRules: Record<keyof TWithdrawCorefyPayload, unknown> = {
  accountFrom: SimpleRequiredValidationRule(),
  toCard: SimpleRequiredValidationRule(),
  amount: SimpleNumberRangeValidationRule(),
};

const { t } = useI18n();

const withdrawResultModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const formData = ref({} as Partial<TWithdrawCorefyPayload>);
const withdrawResultModalData = ref(null as WithdrawResultModalData | null);

const isLoaderVisible = computed(
  () =>
    isCalculateGateCommissionPending.value ||
    isCreateGateTransactionPending.value ||
    isSubmitGateTransactionPending.value ||
    isCardTokensFetching.value ||
    isCreateCardTokenMutationPending.value,
);
const selectedWalletSerial = computed(() => formData.value.accountFrom?.serial);
const selectedWalletCurrencySymbol = computed(() => formData.value.accountFrom?.currency.symbol);
const selectedWalletCurrencyCode = computed(() => formData.value.accountFrom?.currency.code);
const isWithdrawCommissionCalculated = computed(() => !!withdrawCommission.value);
const isSubmitButtonDisabled = computed(() => {
  const { amount, toCard, accountFrom } = formData.value;
  return !(typeof amount !== 'undefined' && toCard && accountFrom);
});
const submitButtonText = computed(() => (isWithdrawCommissionCalculated.value ? 'action.process' : 'action.next'));
const withdrawAmountString = computed(() => `${selectedWalletCurrencySymbol.value}${formData.value.amount}`);
const feeAmountString = computed(() =>
  withdrawCommission.value ? `${withdrawCommission.value.currency.symbol}${withdrawCommission.value.commissionAmount}` : '',
);
const withdrawResultModalDataList = computed<Record<string, WithdrawResultModalData>>(() => ({
  success: {
    title: t('pages.user_dashboard.payments.withdrawal_corefy_success_title', {
      amount: withdrawAmountString.value,
      feeAmount: feeAmountString.value,
    }).toString(),
    subtitle: 'pages.user_dashboard.payments.withdrawal_success_subtitle',
    modalType: InfoModalTypes.success,
  },
}));

const openTopUpResultModal = async (statusName = 'success') => {
  withdrawResultModalData.value = withdrawResultModalDataList.value[statusName] as WithdrawResultModalData;
  await withdrawResultModal.value.open();
  withdrawResultModalData.value = null;
};

const addCardAction = async () => {
  if (!selectedWalletCurrencyCode.value || !selectedWalletSerial.value) {
    return;
  }

  const { response } = await createCardToken({
    walletSerial: selectedWalletSerial.value,
    currencyCode: selectedWalletCurrencyCode.value,
    gateProviderId: COREFY_PROVIDER_ID,
    way: COREFY_GATE_METHOD_WAY,
  });

  if (!response || !response.form) {
    errorNotification('notification.error');
    return;
  }

  window.open(response.form.url, '_self');
};

const formSubmitHandler = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const { amount, toCard, accountFrom } = formData.value as TWithdrawCorefyPayload;

  if (!isWithdrawCommissionCalculated.value) {
    calculateCommission({
      amount,
      gateProviderId: COREFY_PROVIDER_ID,
      serial: accountFrom.serial,
      txType: COREFY_REDEEM_TX_TYPE,
    });

    return;
  }

  const { response } = await createTransaction({
    amount,
    coin: accountFrom.serial,
    method: { gateProviderId: COREFY_PROVIDER_ID, way: COREFY_GATE_METHOD_WAY },
    type: COREFY_REDEEM_TX_TYPE,
  });

  if (!response?.transaction) {
    errorNotification('notification.error');
    return;
  }

  const { transaction } = response;

  const submitTransactionResponse = await submitTransaction({
    optionName: 'default',
    fields: {
      service: COREFY_REDEEM_PAYMENT_SERVICE,
      testMode: true,
      cardToken: toCard,
    },
    txId: transaction.id,
  });

  if (!submitTransactionResponse) {
    return;
  }

  openTopUpResultModal();

  formData.value = {};
};
</script>

<style lang="scss">
.withdraw-corefy {
  &__fee {
    @apply mt-[1rem];
  }

  &__form-wrapper {
    @apply max-w-[512px] mx-auto mt-0;
  }

  &__form {
    &-subtitle {
      @apply mb-[2rem] text-gray-500 font-medium text-xl leading-[140%];
    }
  }
}
</style>

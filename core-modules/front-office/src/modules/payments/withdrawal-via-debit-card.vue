<template>
  <div class="withdrawal-card">
    <gate-payment-form
      ref="gatePaymentFormRef"
      v-model="formData"
      :back-name="backName"
      :tx-type="DEFAULT_TX_TYPE"
      :request-pending="isRequestPending"
      :form-validation-rules="FORM_VALIDATION_RULES"
      :gate-methods-fetched="isGateMethodsFetched"
      :available-gate-methods="availableGateMethods"
      :main-form-content-visible="isMainFormContentVisible"
      form-title="pages.user_dashboard.payments.withdrawal_via_debit_card_title"
      @transaction-created="transactionCreatedHandler"
      @operation-success="operationSuccessHandler">
      <template #default="{ goToBackPage }">
        <template v-if="isCorefyProviderSelected">
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
                v-if="ENV_VARIABLES.userDashboardWithdrawalDebitCardAddCardActionVisible"
                native-type="button"
                type="secondary"
                size="small"
                icon="icon-plus"
                no-padding
                transparent
                :disabled="isAddCardTokenButtonDisabled"
                @click="addCardTokenAction">
                {{ $t('action.add_card') }}
              </app-button>
            </template>
          </app-form-item>
        </template>
        <app-modal
          ref="withdrawResultModalRef"
          is-centred
          is-full-width
          @closed="goToBackPage()">
          <template #default="{ onSubmit }">
            <app-info-modal
              v-if="!!withdrawResultModalData"
              :title="withdrawResultModalData.title"
              :subtitle="withdrawResultModalData.subtitle"
              type="success"
              confirm-text="action.done"
              :is-cancel-visible="false"
              @confirm="
                onSubmit();
                goToBackPage();
              " />
          </template>
        </app-modal>
      </template>
    </gate-payment-form>
  </div>
</template>

<script setup lang="ts">
import type { IGateTransactionResponse, IPaymentProviderBody, TTxType, TViewCardTokensRequestPayload } from '@sdk5/shared';
import {
  ENV_VARIABLES,
  errorNotification,
  SimpleRequiredValidationRule,
  useCreateCardTokenApi,
  useI18n,
  useViewCardTokensApi,
  useViewGateMethodsApi,
} from '@sdk5/shared';
import { AppButton, AppFormItem, AppInfoModal, AppModal, AppSelect } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import GatePaymentForm from './components/gate-payment-form/gate-payment-form.vue';
import type { IGatePaymentCommonFormData, ISuccessOperationEmitPayload } from './components/gate-payment-form/types';

interface IWithdrawalFormData extends IGatePaymentCommonFormData {
  toCard: string;
}
interface IWithdrawResultModalData {
  title: string;
  subtitle: string;
}

const backName = ENV_VARIABLES.withdrawalRegularBankTransferVisible ? 'user-withdrawal-operations' : 'user-dashboard';

const COREFY_GATE_PROVIDER_ID = 'Corefy';
const DEFAULT_TX_TYPE: TTxType = 'REDEEM';
const INITIAL_FORM_STATE: Partial<IWithdrawalFormData> = {
  amount: undefined,
  paymentService: undefined,
  account: undefined,
  gateProviderId: undefined,
  toCard: undefined,
};
const FORM_VALIDATION_RULES = {
  toCard: SimpleRequiredValidationRule(),
};

const { t } = useI18n();

const { mutateAsync: createCardToken, isPending: isCreateCardTokenPending } = useCreateCardTokenApi();

const gatePaymentFormRef = ref(null) as unknown as Ref<InstanceType<typeof GatePaymentForm>>;
const withdrawResultModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;

const withdrawResultModalData = ref<IWithdrawResultModalData | null>(null);
const formData = ref<Partial<IWithdrawalFormData>>({
  ...INITIAL_FORM_STATE,
});

const isMainFormContentVisible = computed(() => {
  const { account, gateProviderId, paymentService } = formData.value;

  return !!account && !!gateProviderId && !!paymentService;
});
const viewGateMethodsPayload = computed<IPaymentProviderBody | undefined>(() => {
  return formData.value.account
    ? {
        serial: formData.value.account.serial,
        txType: DEFAULT_TX_TYPE,
      }
    : undefined;
});
const { activeGateMethods, isFetching: isGateMethodsFetching, isFetched: isGateMethodsFetched } = useViewGateMethodsApi(viewGateMethodsPayload);
const isViewCardTokenAvailable = computed(() => isMainFormContentVisible.value);
const viewCardTokensPayload = computed(() =>
  isViewCardTokenAvailable.value
    ? ({
        pageNumber: 0,
        pageSize: 10,
        filter: {
          currencyCode: formData.value.account?.currency.code,
        },
      } satisfies TViewCardTokensRequestPayload)
    : undefined,
);
const {
  cardTokenRecords: userCardTokens,
  isFetching: isCardTokensFetching,
  invalidateQuery: invalidateCardTokens,
} = useViewCardTokensApi(viewCardTokensPayload);
const isAddCardTokenButtonDisabled = computed(() => !formData.value.account);
const isRequestPending = computed(() => isGateMethodsFetching.value || isCreateCardTokenPending.value || isCardTokensFetching.value);
const availableGateMethods = computed(() => activeGateMethods.value.filter((gateMethod) => gateMethod.way === 'CARD'));
const selectedGateProvider = computed(() =>
  availableGateMethods.value.find((gateMethod) => gateMethod.gateProvider.id === formData.value.gateProviderId),
);
const isCorefyProviderSelected = computed(() => selectedGateProvider.value?.gateProvider.id === COREFY_GATE_PROVIDER_ID);

const resetForm = () => {
  formData.value = {
    ...INITIAL_FORM_STATE,
  };
};
const openWithdrawResultModal = async (payload: { amountString: string; feeAmountString: string }) => {
  const { amountString, feeAmountString } = payload;
  withdrawResultModalData.value = {
    title: t('pages.user_dashboard.payments.withdrawal_corefy_success_title', {
      amount: amountString,
      feeAmount: feeAmountString,
    }).toString(),
    subtitle: t('pages.user_dashboard.payments.withdrawal_success_subtitle').toString(),
  };
  await withdrawResultModalRef.value.open();
  withdrawResultModalData.value = null;
};
const addCardTokenAction = async () => {
  if (!selectedGateProvider.value) {
    return;
  }

  const { account, gateProviderId } = formData.value;

  if (!account || !gateProviderId || !isCorefyProviderSelected.value) {
    return;
  }

  const { response } = await createCardToken({
    walletSerial: account.serial,
    currencyCode: account.currency.code,
    gateProviderId,
    way: selectedGateProvider.value.way,
  });

  if (!response || !response.form) {
    errorNotification('notification.error');
    return;
  }

  invalidateCardTokens();

  window.open(response.form.url, '_self');
};
const transactionCreatedHandler = (payload: IGateTransactionResponse) => {
  const { paymentService, toCard } = formData.value as IWithdrawalFormData;

  const submitTransactionPayload = {
    optionName: 'default',
    fields: {
      service: paymentService,
      testMode: true,
      cardToken: toCard,
    },
  };
  gatePaymentFormRef.value.processSubmitTransaction({
    ...submitTransactionPayload,
    txId: payload.transaction.id,
  });
};
const operationSuccessHandler = async (payload: ISuccessOperationEmitPayload) => {
  const { calculatedCommission, transaction } = payload;
  await openWithdrawResultModal({
    amountString: `${transaction.coin?.currency.symbol}${transaction.sourceAmount}`,
    feeAmountString: calculatedCommission ? `${calculatedCommission.currency.symbol}${calculatedCommission.commissionAmount}` : '',
  });
  resetForm();
};
</script>

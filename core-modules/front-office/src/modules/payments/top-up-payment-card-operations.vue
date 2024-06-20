<template>
  <div class="top-up-card">
    <gate-payment-form
      ref="gatePaymentFormRef"
      v-model="formData"
      :back-name="backName"
      :request-pending="requestPending"
      :form-validation-rules="formValidationRules"
      :gate-methods-fetched="isGateMethodsFetched"
      form-title="pages.user_dashboard.payments.top_up_card_title"
      :tx-type="DEFAULT_TX_TYPE"
      :available-gate-methods="availableGateMethods"
      :main-form-content-visible="isMainFormContentVisible"
      @transaction-created="transactionCreatedHandler"
      @operation-success="operationSuccessHandler">
      <template #default="{ goToBackPage }">
        <template v-if="isCorefyProviderSelected && !ENV_VARIABLES.topUpAlwaysEnableCardTokenization">
          <app-form-item prop="tokenizeCard">
            <app-switch
              v-model="formData.tokenizeCard"
              is-label-after
              label="action.tokenize_card" />
          </app-form-item>
        </template>
        <template v-if="isMockProviderSelected">
          <div class="top-up-card__inputs">
            <app-form-item prop="cardNumber">
              <app-input-card-number v-model="formData.cardNumber" />
            </app-form-item>
            <app-form-item prop="expDate">
              <app-input
                v-model="formData.expDate"
                v-mask="'##/##'"
                style="width: 110px"
                label="form.label.expiry_date" />
            </app-form-item>
            <app-form-item prop="cvv">
              <app-input
                v-model="formData.cvv"
                v-mask="'###'"
                type="password"
                style="width: 110px"
                label="form.label.cvv" />
            </app-form-item>
          </div>
        </template>
        <app-modal
          ref="topUpResultModalRef"
          is-centred
          is-full-width
          @closed="goToBackPage()">
          <template #default="{ onSubmit }">
            <app-info-modal
              v-if="!!topUpResultModalData"
              :title="topUpResultModalData.title"
              :subtitle="topUpResultModalData.subtitle"
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
import type { IGateSubmitPayerBody, IGateTransactionResponse, IPaymentProviderBody, TTxType } from '@sdk5/shared';
import { CardNumberValidator, ENV_VARIABLES, ExpDateValidator, MixMaxValidation, useI18n, useViewGateMethodsApi } from '@sdk5/shared';
import { AppFormItem, AppInfoModal, AppInput, AppInputCardNumber, AppModal, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';
import { mask as vMask } from 'vue-the-mask';

import GatePaymentForm from './components/gate-payment-form/gate-payment-form.vue';
import type { IGatePaymentCommonFormData } from './components/gate-payment-form/types';

interface ITopUpFormData extends IGatePaymentCommonFormData {
  tokenizeCard: boolean;
  cardNumber: number;
  expDate: string;
  cvv: string;
}
interface IUTopUpResultModalData {
  title: string;
  subtitle: string;
}

const backName = ENV_VARIABLES.topUpRegularBankTransferVisible ? 'user-top-up-operations' : 'user-dashboard';

const DEFAULT_TX_TYPE: TTxType = 'TOPUP';
const COREFY_GATE_PROVIDER_ID = 'Corefy';
const MOCK_TOP_UP_PROVIDER_NAME = 'SDK.Finance Top up';

const INITIAL_FORM_STATE: Partial<ITopUpFormData> = {
  amount: undefined,
  tokenizeCard: undefined,
  paymentService: undefined,
  account: undefined,
  gateProviderId: undefined,
  cardNumber: undefined,
  expDate: undefined,
  cvv: undefined,
};

const { t } = useI18n();

const topUpResultModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
const gatePaymentFormRef = ref(null) as unknown as Ref<InstanceType<typeof GatePaymentForm>>;

const topUpResultModalData = ref(null as IUTopUpResultModalData | null);
const formData = ref<Partial<ITopUpFormData>>({
  ...INITIAL_FORM_STATE,
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

const requestPending = computed(() => isGateMethodsFetching.value);
const availableGateMethods = computed(() =>
  activeGateMethods.value.filter(
    (gateMethod) => gateMethod.way === 'CARD' || (gateMethod.way === 'EMONEY' && gateMethod.gateProvider.name === MOCK_TOP_UP_PROVIDER_NAME),
  ),
);
const selectedGateProvider = computed(() =>
  availableGateMethods.value.find((gateMethod) => gateMethod.gateProvider.id === formData.value.gateProviderId),
);
const isCorefyProviderSelected = computed(() => selectedGateProvider.value?.gateProvider.id === COREFY_GATE_PROVIDER_ID);
const isMockProviderSelected = computed(() => selectedGateProvider.value?.gateProvider.name === MOCK_TOP_UP_PROVIDER_NAME);
const isMainFormContentVisible = computed(() => {
  const { account, gateProviderId, paymentService } = formData.value;

  return !!account && !!gateProviderId && (!isCorefyProviderSelected.value || !!paymentService);
});
const formValidationRules = computed(() => {
  if (isMockProviderSelected.value) {
    return {
      cardNumber: CardNumberValidator(),
      expDate: ExpDateValidator(),
      cvv: MixMaxValidation(3, 3),
    };
  }

  return {};
});

const resetForm = () => {
  formData.value = {
    ...INITIAL_FORM_STATE,
  };
};
const openTopUpResultModal = async () => {
  topUpResultModalData.value = {
    subtitle: t('pages.user_dashboard.payments.success_top_up_subtitle').toString(),
    title: t('pages.user_dashboard.payments.success_top_up', {
      accountName: formData.value.account?.name,
      currency: formData.value.account?.currency.symbol,
      amount: formData.value.amount,
    }).toString(),
  };
  await topUpResultModalRef.value.open();
  topUpResultModalData.value = null;
};
const operationSuccessHandler = async () => {
  if (isMockProviderSelected.value) {
    await openTopUpResultModal();
  }

  resetForm();
};
const transactionCreatedHandler = (payload: IGateTransactionResponse) => {
  let submitTransactionPayload: IGateSubmitPayerBody | null = null;
  const { paymentService, tokenizeCard } = formData.value as ITopUpFormData;

  if (isCorefyProviderSelected.value) {
    submitTransactionPayload = {
      optionName: 'default',
      fields: {
        service: paymentService,
        testMode: true,
        referenceId: payload.transaction.id,
        tokenize: ENV_VARIABLES.topUpAlwaysEnableCardTokenization || tokenizeCard,
      },
    };
  }

  if (isMockProviderSelected.value) {
    submitTransactionPayload = {
      optionName: 'default',
      fields: {
        phone: '380999999999',
      },
    };
  }

  if (submitTransactionPayload === null) {
    return;
  }

  gatePaymentFormRef.value.processSubmitTransaction({
    ...submitTransactionPayload,
    txId: payload.transaction.id,
  });
};
</script>

<style lang="scss">
.top-up-card {
  &__inputs {
    @apply w-full flex gap-x-16 gap-y-[0.5rem] flex-wrap;

    .app-form-item__wrapper {
      @apply first:flex-grow;
    }

    .app-form-item {
      @apply mb-0;
    }
  }
}
</style>

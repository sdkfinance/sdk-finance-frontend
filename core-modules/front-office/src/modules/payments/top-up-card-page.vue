<template>
  <app-step-controller
    class="top-up-card"
    :total-steps="2"
    back-name="user-top-up-payment-card-operations"
    is-close-visible>
    <template #default="{ currentStep, nextStep, goToBackPage }">
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          {{ $t('pages.user_dashboard.payments.top_up_via_debit_card') }}
        </template>
        <app-step-progress
          class="top-up-card__progress"
          :total-steps="2"
          :current-step="currentStep">
          <template #title-1>
            {{ $t('pages.user_dashboard.payments.card_details') }}
          </template>
          <template #title-2>
            {{ $t('pages.user_dashboard.payments.amount') }}
          </template>
        </app-step-progress>
        <app-form
          ref="appFormRef"
          :loading="isLoading"
          :model="form"
          :rules="rules"
          @submit.native.prevent>
          <transition-group name="page">
            <div
              v-if="currentStep === 1"
              key="cardForm">
              <div class="top-up-card__subtitle">
                {{ $t('pages.user_dashboard.payments.enter_card_details') }}
              </div>
              <div class="top-up-card__inputs">
                <app-form-item prop="cardNumber">
                  <app-input-card-number v-model="form.cardNumber" />
                </app-form-item>
                <app-form-item prop="expDate">
                  <app-input
                    v-model="form.expDate"
                    v-mask="'##/##'"
                    style="width: 110px"
                    label="form.label.expiry_date" />
                </app-form-item>
                <app-form-item prop="cvv">
                  <app-input
                    v-model="form.cvv"
                    v-mask="'###'"
                    type="password"
                    style="width: 110px"
                    label="form.label.cvv" />
                </app-form-item>
              </div>
            </div>
            <div
              v-else-if="currentStep === 2"
              key="accountForm">
              <div class="top-up-card__subtitle">
                {{ $t('pages.user_dashboard.payments.select_account') }}
              </div>
              <app-form-item prop="account">
                <account-select
                  v-model="form.account"
                  label="form.label.account" />
              </app-form-item>
              <app-form-item prop="amount">
                <app-input
                  v-model="form.amount"
                  label="form.label.transaction_amount" />
              </app-form-item>
              <top-up-no-fee />
            </div>
          </transition-group>
          <app-button
            native-type="button"
            @click="handlerForm(nextStep, currentStep)">
            {{ $t('action.next') }}
          </app-button>
        </app-form>
      </app-form-wrapper>
      <app-modal
        ref="topUpResultModal"
        is-centred
        is-full-width
        @closed="goToBackPage()">
        <template #default="{ onSubmit }">
          <app-info-modal
            v-if="!!currentTopUpResultModalData"
            :title="currentTopUpResultModalData.title"
            :subtitle="currentTopUpResultModalData.subtitle"
            :type="currentTopUpResultModalData.modalType"
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
import type { ICoin, IGateCreateTransactionBody, IPaymentProviderRecord } from '@sdk5/shared/requests';
import { GateRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import {
  CardNumberValidator,
  ExpDateValidator,
  MixMaxValidation,
  OnChangeRequiredValidationRule,
  SimpleNumberValidationRule,
} from '@sdk5/shared/validation';
import type { TModalTypes } from '@sdk5/ui-kit-front-office';
import {
  AppButton,
  AppForm,
  AppFormItem,
  AppFormWrapper,
  AppInfoModal,
  AppInput,
  AppInputCardNumber,
  AppModal,
  AppStepController,
  AppStepProgress,
  InfoModalTypes,
} from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, getCurrentInstance, ref } from 'vue';
import { mask as vMask } from 'vue-the-mask';

import AccountSelect from '../user-dashboard/components/account-select.vue';
import TopUpNoFee from './components/top-up-no-fee.vue';

const TopUpResultStatuses = {
  success: 'success',
  failed: 'failed',
} as const;

type TopUpResultStatusKey = keyof typeof TopUpResultStatuses;
type TopUpResultModalData = {
  title: string;
  subtitle: string;
  modalType: TModalTypes;
};

type TTopUpForm = {
  cardNumber: string;
  expDate: string;
  cvv: string;
  account: ICoin | null;
  amount: number | string;
};

const currentInstance = getCurrentInstance()?.proxy;

const rules: Record<keyof TTopUpForm, unknown> = {
  cardNumber: CardNumberValidator(),
  expDate: ExpDateValidator(),
  cvv: MixMaxValidation(3, 3),
  account: OnChangeRequiredValidationRule(),
  amount: SimpleNumberValidationRule(),
};

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const topUpResultModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
const isLoading = ref(false);
const form = ref({
  cardNumber: '',
  expDate: '',
  cvv: '',
  account: null,
  amount: '',
} as TTopUpForm);
const gateMethodList = ref([] as IPaymentProviderRecord[]);
const currentTopUpResultModalData = ref(null as TopUpResultModalData | null);

const provider = computed(
  () => gateMethodList.value.find(({ gateProvider }) => gateProvider.name === 'SDK.Finance Top up') || ({} as IPaymentProviderRecord),
);
const topUpResultModalDataList = computed(() => ({
  [TopUpResultStatuses.success]: {
    title: currentInstance!
      .$t('pages.user_dashboard.payments.success_top_up', {
        accountName: form.value.account?.name,
        currency: form.value.account?.currency.symbol,
        amount: form.value.amount,
      })
      .toString(),
    subtitle: 'pages.user_dashboard.payments.success_top_up_subtitle',
    modalType: InfoModalTypes.success,
  },
  [TopUpResultStatuses.failed]: {
    title: currentInstance!.$t('pages.user_dashboard.payments.failed_top_up').toString(),
    subtitle: 'pages.user_dashboard.payments.failed_top_up_subtitle',
    modalType: InfoModalTypes.error,
  },
}));

const openTopUpResultModal = async (statusName: TopUpResultStatusKey) => {
  currentTopUpResultModalData.value = topUpResultModalDataList.value[statusName];
  await topUpResultModal.value.open();
  currentTopUpResultModalData.value = null;
};

const fetchMethods = async (serial: string) => {
  const { response, error } = await GateRequests.getMethods({ serial, txType: 'TOPUP' });

  if (error) {
    errorNotification(error);
    return;
  }

  gateMethodList.value = response?.records || [];
};

const handlerForm = async (nextStep: Function, currentStep: number): Promise<void> => {
  const isValid = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  if (currentStep === 1) {
    nextStep();
    return;
  }

  isLoading.value = true;
  const { amount, account } = form.value;
  const { serial } = account as ICoin;

  await fetchMethods(serial);

  const { gateProvider, way } = provider.value;

  if (!gateProvider || !way) {
    isLoading.value = false;
    return;
  }

  const sendData: IGateCreateTransactionBody = {
    amount: Number(amount),
    coin: serial,
    method: { gateProviderId: gateProvider.id, way },
    type: 'TOPUP',
  };

  const { response: responseTx, error: errorTx } = await GateRequests.createTransaction(sendData);

  if (errorTx) {
    errorNotification(errorTx);
    isLoading.value = false;
    return;
  }

  const { error } = await GateRequests.submitPayer(responseTx?.transaction.id || '', {
    optionName: 'default',
    fields: {
      phone: '380999999999',
    },
  });
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  openTopUpResultModal(TopUpResultStatuses.success);
};
</script>

<style lang="scss">
.top-up-card {
  &__subtitle {
    @apply text-gray-500 text-xl mb-32 font-medium;
  }

  &__progress {
    @apply max-w-240 ml-auto mr-auto mb-48;
  }

  &__inputs {
    @apply flex gap-x-16 gap-y-[0.5rem] flex-wrap mb-[2rem];

    .app-form-item {
      @apply mb-0 first:flex-grow;
    }
  }

  &__fee {
    @apply text-blue-600 text-base flex items-center;

    &-icon {
      @apply w-18 h-18 rounded-full flex justify-center items-center;
      @apply leading-none bg-blue-300 text-primary text-11 font-bold mr-8;
    }
  }
}
</style>

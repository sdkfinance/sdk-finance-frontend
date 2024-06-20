<template>
  <app-step-controller
    is-close-visible
    back-name="user-withdrawal-operations"
    :total-steps="1"
    class="withdrawal-bank">
    <template #default="{ goToBackPage }">
      <app-form-wrapper class="withdrawal-bank__form-wrapper">
        <template #title>
          {{ $t('pages.user_dashboard.payments.withdrawal_via_bank_transfer_title') }}
        </template>
        <div class="withdrawal-bank__subtitle">
          {{ $t('pages.user_dashboard.payments.withdrawal_via_bank_transfer_subtitle') }}
        </div>
        <app-form
          ref="appFormRef"
          :model="form"
          :rules="rules"
          :loading="isLoading"
          @submit.native.prevent="handleFormSubmit">
          <app-form-item prop="accountFrom">
            <account-select
              v-model="form.accountFrom"
              label="form.label.account_from" />
          </app-form-item>
          <app-form-item prop="bankAccountId">
            <app-select
              v-model="form.bankAccountId"
              :options="selectedWalletBankAccountWithDisplayName"
              :disabled="isBankAccountSelectDisabled"
              option-value="id"
              option-label="displayName"
              label="form.label.bank_account_id"
              placeholder="form.label.bank_account_id" />
          </app-form-item>
          <app-form-item prop="description">
            <app-input
              v-model="form.description"
              type="textarea"
              placeholder="form.label.add_note"
              label="form.label.add_note" />
          </app-form-item>
          <app-form-item prop="amount">
            <app-input
              v-model="form.amount"
              placeholder="form.label.amount"
              label="form.label.amount" />
          </app-form-item>

          <template v-if="calculatedCommission !== null">
            <operation-commission
              class="withdrawal-bank__commission"
              :rows="2">
              <template #label-1>
                {{ $t('form.label.recipient_gets') }}
              </template>
              <template #value-1>
                {{ `${calculatedCommission.recipientAmountPush} ${calculatedCommission.currency.code}` }}
              </template>
              <template #label-2>
                {{ $t('form.label.fee') }}
              </template>
              <template #value-2>
                {{ `${calculatedCommission.commissionAmountPush} ${calculatedCommission.currency.code}` }}
              </template>
            </operation-commission>
          </template>

          <app-button
            :disabled="isSubmitButtonDisabled"
            native-type="submit"
            type="secondary"
            full-width>
            {{ $t('action.create_withdrawal_request') }}
          </app-button>
        </app-form>
      </app-form-wrapper>

      <app-modal
        ref="appModalRef"
        is-centred
        is-full-width
        @closed="goToBackPage">
        <template #default="{ onSubmit }">
          <app-info-modal
            :title="infoModalData.title"
            :subtitle="infoModalData.subtitle"
            :type="InfoModalTypes.success"
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
import { useI18n } from '@sdk5/shared/i18n';
import type { IBankAccountRecord, IBankWithdrawalCommissionResponse, ICoin, ICreateWithdrawalRequestPayload } from '@sdk5/shared/requests';
import { BankAccountsRequests, BankWithdrawalsRequests, WalletsRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
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
} from '@sdk5/ui-kit-front-office';
import { useDebounceFn } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import AccountSelect from '../user-dashboard/components/account-select.vue';
import OperationCommission from '../user-dashboard/components/operation-commission.vue';

type TWithdrawalViaBankForm = Pick<Partial<ICreateWithdrawalRequestPayload>, 'amount' | 'bankAccountId' | 'customInformation' | 'description'> & {
  accountFrom?: ICoin;
};
type TFormCommissionFields = Pick<TWithdrawalViaBankForm, 'amount'> & {
  coinSerial: ICoin['serial'];
};

type TInfoModalData = {
  title: string;
  subtitle: string;
};

const { t } = useI18n();

const rules: Record<keyof TWithdrawalViaBankForm, unknown> = {
  amount: SimpleRequiredValidationRule(),
  accountFrom: SimpleRequiredValidationRule(),
  bankAccountId: null,
  customInformation: null,
  description: null,
};

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const appModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;

const isLoading = ref(false);
const calculatedCommission = ref(null as IBankWithdrawalCommissionResponse | null);
const userCoins = ref([] as ICoin[]);
const bankAccounts = ref([] as IBankAccountRecord[]);
const form = ref<TWithdrawalViaBankForm>({
  accountFrom: undefined,
  amount: undefined,
  bankAccountId: undefined,
  customInformation: undefined,
  description: undefined,
});
const infoModalData = ref<TInfoModalData>({
  title: '',
  subtitle: '',
});

const isBankAccountSelectDisabled = computed(() => !form.value.accountFrom?.serial);
const isSubmitButtonDisabled = computed(() => isLoading.value || calculatedCommission.value === null);
const selectedWalletBankAccounts = computed(() =>
  bankAccounts.value.filter((account) => form.value.accountFrom?.serial && form.value.accountFrom?.serial === account.coinSerial),
);

const selectedWalletBankAccountWithDisplayName = computed(() =>
  selectedWalletBankAccounts.value.map((account) => ({
    ...account,
    displayName: `${account.details.name} (${account.details.iban})`,
  })),
);
const formCommissionFields = computed(() => {
  return {
    amount: form.value.amount,
    coinSerial: form.value.accountFrom?.serial,
  } satisfies Partial<TFormCommissionFields>;
});

const setInfoModalData = (options: TInfoModalData) => {
  infoModalData.value = {
    ...options,
  };
};
const clearInfoModalData = () => {
  infoModalData.value = {
    title: '',
    subtitle: '',
  };
};
const findUserCoinBySerial = (serial: string) => {
  return userCoins.value.find((coin) => coin.serial === serial);
};
const openInfoModal = async (modalData: TInfoModalData) => {
  setInfoModalData(modalData);
  await appModalRef.value.open();
  clearInfoModalData();
};
const fetchUserCoins = async () => {
  const { response, error } = await WalletsRequests.getWallets();

  if (error !== null) {
    errorNotification(error);
    return;
  }

  userCoins.value = response?.coins ?? [];
};
const fetchBankAccounts = async () => {
  const { response, error } = await BankAccountsRequests.getMyBankAccounts();

  if (error !== null) {
    errorNotification(error);
    return;
  }

  bankAccounts.value = response?.records ?? [];
};
const fetchInitialData = async () => {
  isLoading.value = true;
  await Promise.all([fetchUserCoins(), fetchBankAccounts()]);
  isLoading.value = false;
};
const calculateWithdrawalCommission = async (payload: Pick<ICreateWithdrawalRequestPayload, 'amount' | 'coinSerial'>) => {
  const { amount, coinSerial } = payload;
  isLoading.value = true;
  const { response, error } = await BankWithdrawalsRequests.calculateCommission(coinSerial, amount);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  calculatedCommission.value = response;
};
const createWithdrawalRequest = async (payload: ICreateWithdrawalRequestPayload) => {
  isLoading.value = true;
  const { error } = await BankWithdrawalsRequests.createWithdrawalRequest(payload);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  const { amount, coinSerial } = payload;

  const userCoin = findUserCoinBySerial(coinSerial);

  openInfoModal({
    subtitle: t('pages.user_dashboard.payments.withdrawal_success_subtitle').toString(),
    title: t('pages.user_dashboard.payments.withdrawal_success_title', {
      accountName: userCoin?.name ?? '',
      currency: userCoin?.currency?.symbol ?? '',
      amount,
    }).toString(),
  });
};
const handleFormSubmit = async () => {
  if (!(await appFormRef.value.validate())) {
    return;
  }

  const {
    accountFrom: { serial: coinSerial },
    amount,
    bankAccountId,
    customInformation,
    description,
  } = form.value as Required<TWithdrawalViaBankForm>;

  const payload: ICreateWithdrawalRequestPayload = {
    amount,
    coinSerial,
    bankAccountId,
    customInformation,
    description,
  };

  createWithdrawalRequest(payload);
};
const calculateWithdrawalCommissionDebounced = useDebounceFn(calculateWithdrawalCommission, 900);
const formCommissionFieldsChangeHandler = (formCommissionFieldsOption: Partial<TFormCommissionFields>) => {
  const { amount, coinSerial } = formCommissionFieldsOption;
  const amountNumber = parseInt(`${amount}`, 10);

  if (!Number.isNaN(amountNumber) && coinSerial) {
    calculateWithdrawalCommissionDebounced({ amount: amountNumber, coinSerial });
  }
};

watch(formCommissionFields, formCommissionFieldsChangeHandler, { deep: true });

onMounted(() => {
  fetchInitialData();
});
</script>

<style lang="scss">
.withdrawal-bank {
  &__subtitle {
    @apply text-gray-500 text-xl mb-32 font-medium;
  }

  &__form-wrapper {
    @apply max-w-540 ml-auto mr-auto;
  }

  &__commission {
    @apply mb-36;
  }
}

@media print {
  .app-form-wrapper__title,
  .withdrawal-bank__subtitle,
  .app-select,
  .app-step-controller__close,
  .app-step-controller__back {
    display: none !important;
  }
}
</style>

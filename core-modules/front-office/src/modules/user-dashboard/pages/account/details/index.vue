<template>
  <div
    v-loading="isLoading"
    class="bank-accounts">
    <div class="bank-accounts__header">
      <div class="bank-accounts__title">
        {{ $t('navigation.link.bank_accounts') }}
      </div>
      <app-button
        type="secondary"
        icon="icon-plus"
        native-type="button"
        size="medium"
        transparent
        @click="addAccountButtonClickHandler">
        {{ $t('action.add_bank_account') }}
      </app-button>
    </div>
    <div class="bank-accounts__list">
      <template v-for="bankAccount of bankAccounts">
        <bank-account-card
          :key="bankAccount.id"
          :bank-account="bankAccount"
          @edit="bankAccountCardEditHandler" />
      </template>
    </div>
    <modal
      v-model="bankAccountModalVisible"
      width="360px"
      :title="bankAccountModalTitle">
      <bank-account-form
        :bank-account-form-data="bankAccountModalFormData"
        @cancel="bankAccountModalCancelHandler"
        @create-bank-account="createBankAccountHandler"
        @update-bank-account="updateBankAccountHandler" />
    </modal>
    <modal
      v-model="checkingBankAccountInfoModalVisible"
      title="pages.bank_accounts.checking_bank_account_information_modal.title">
      <checking-bank-account-info-block @done="bankInfoApprovalDoneHandler" />
    </modal>
  </div>
</template>

<script setup lang="ts">
import type { IBankAccountRecord, ICoin, ICreateOrUpdateBankAccountWithBankIdRequest } from '@sdk5/shared/requests';
import { BankAccountsRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppBankAccountForm as BankAccountForm, AppButton, Modal } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

import BankAccountCard from '../../../components/bank-accounts/bank-account-card.vue';
import CheckingBankAccountInfoBlock from '../../../components/bank-accounts/checking-bank-account-info-block.vue';

const props = defineProps<{
  account: ICoin;
}>();

const [bankAccountModalVisible, toggleCheckingBankAccountInfoModalVisibility] = useToggle(false);
const [checkingBankAccountInfoModalVisible, toggleBankInfoApprovalModalVisibility] = useToggle(false);
const isLoading = ref(false);
const bankAccounts = ref<Array<IBankAccountRecord>>([]);

const bankAccountModalFormData = ref(null as IBankAccountRecord | null);

const serial = computed(() => props.account?.serial);
const bankAccountModalTitle = computed(() =>
  bankAccountModalFormData.value ? 'pages.bank_accounts.bank_account_details' : 'action.add_bank_account',
);

const addAccountButtonClickHandler = () => {
  toggleCheckingBankAccountInfoModalVisibility(true);
};
const bankAccountModalCancelHandler = () => {
  toggleCheckingBankAccountInfoModalVisibility(false);
};
const bankAccountCardEditHandler = (bankAccount: IBankAccountRecord) => {
  toggleCheckingBankAccountInfoModalVisibility(true);
  bankAccountModalFormData.value = bankAccount;
};
const getBankAccounts = async (coinSerial: string) => {
  isLoading.value = true;
  const { response, error } = await BankAccountsRequests.viewMyBankAccounts({ filter: { coinSerial } });
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  bankAccounts.value = response?.records || [];
};
const createBankAccount = async (payload: ICreateOrUpdateBankAccountWithBankIdRequest) => {
  isLoading.value = true;
  const { error } = await BankAccountsRequests.createNewBankAccount(serial.value, payload);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  toggleBankInfoApprovalModalVisibility(true);
};
const updateBankAccount = async (bankAccountId: string, payload: ICreateOrUpdateBankAccountWithBankIdRequest) => {
  isLoading.value = true;
  const { error } = await BankAccountsRequests.updateBankAccount(bankAccountId, payload);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  successNotification();
  getBankAccounts(serial.value);
};
const createBankAccountHandler = (payload: ICreateOrUpdateBankAccountWithBankIdRequest) => {
  toggleCheckingBankAccountInfoModalVisibility(false);
  createBankAccount(payload);
};
const bankInfoApprovalDoneHandler = () => {
  toggleBankInfoApprovalModalVisibility(false);
  successNotification();
  getBankAccounts(serial.value);
};
const accountSerialChangeHandler = (coinSerial?: string) => {
  if (coinSerial) {
    getBankAccounts(coinSerial);
  }
};
const bankAccountModalVisibleChangeHandler = (value: boolean) => {
  if (!value) {
    bankAccountModalFormData.value = null;
  }
};
const updateBankAccountHandler = (payload: ICreateOrUpdateBankAccountWithBankIdRequest & { bankAccountId: string }) => {
  const { bankAccountId, ...updatePayload } = payload;
  toggleCheckingBankAccountInfoModalVisibility(false);
  updateBankAccount(bankAccountId, updatePayload);
};

watch(serial, accountSerialChangeHandler, { immediate: true });
watch(bankAccountModalVisible, bankAccountModalVisibleChangeHandler);
</script>

<style lang="scss">
.bank-accounts {
  @apply flex flex-col gap-y-[2rem] mt-[2.5rem];

  &__header {
    @apply flex items-center justify-between;
  }

  &__title {
    @apply text-xl font-medium text-gray-500 leading-[135%];
  }

  &__list {
    @apply grid gap-[1.5rem] sm:grid-cols-2 grid-cols-1;
  }
}
</style>

<template>
  <div
    v-loading="isLoading"
    class="accounts-page">
    <accounts-table
      :wallets="wallets"
      @add-account="addAccountClickHandler"
      @edit-account="editAccountClickHandler" />

    <recent-operations-table :accounts="wallets" />

    <modal
      v-model="addAccountModalVisible"
      title="action.add_account"
      width="320px">
      <manage-account-form @add-account="addAccountHandler" />
    </modal>
    <modal
      v-model="editAccountModalVisible"
      :title="editAccountModalData.title"
      width="320px">
      <manage-account-form
        update
        :edit-wallet-data="editAccountModalData.editWalletData"
        @delete-account="deleteAccountHandler"
        @update-account="updateAccountHandler" />
    </modal>
    <confirm-modal
      ref="confirmModalRef"
      :title="confirmModalTitle" />
  </div>
</template>

<script setup lang="ts">
import { useCreateWalletApi, useDeleteWalletApi, useGetWalletsApi, useUpdateWalletApi } from '@sdk5/shared/composables';
import { useI18n } from '@sdk5/shared/i18n';
import type { IWalletBody, IWalletRecord } from '@sdk5/shared/requests';
import { ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';

import AccountsTable from '../components/accounts-table.vue';
import type { TUpdateAccountPayload } from '../components/manage-account-form';
import ManageAccountForm from '../components/manage-account-form';
import RecentOperationsTable from '../components/recent-operations-table.vue';

const { t } = useI18n();

const { data: wallets, isFetching: isGetWalletsFetching } = useGetWalletsApi();
const { mutateAsync: processAccountCreation, isPending: isCreateWalletPending } = useCreateWalletApi();
const { mutateAsync: processAccountUpdate, isPending: isUpdateWalletPending } = useUpdateWalletApi();
const { mutateAsync: processAccountDelete, isPending: isDeleteWalletPending } = useDeleteWalletApi();

const [addAccountModalVisible, toggleAddAccountModal] = useToggle(false);
const [editAccountModalVisible, toggleEditAccountModal] = useToggle(false);

const confirmModalRef = ref(null) as unknown as Ref<InstanceType<typeof ConfirmModal>>;

const confirmModalTitle = ref('');
const editAccountModalData = ref({
  title: '',
  editWalletData: {
    name: '',
    serial: '',
  } as TUpdateAccountPayload,
});

const isLoading = computed(
  () => isGetWalletsFetching.value || isCreateWalletPending.value || isUpdateWalletPending.value || isDeleteWalletPending.value,
);

const setConfirmModalTitle = (title: string) => {
  confirmModalTitle.value = title;
};

const openConfirmModal = async (title: string) => {
  setConfirmModalTitle(title);
  const submitted = await confirmModalRef.value.open();
  setConfirmModalTitle('');
  return submitted;
};

const setEditAccountModalData = (wallet: IWalletRecord) => {
  const { serial, name } = wallet;
  editAccountModalData.value = {
    title: t('action.edit_named_account', { name }).toString(),
    editWalletData: {
      name,
      serial,
    },
  };
};

const clearEditAccountModalData = () => {
  editAccountModalData.value = {
    title: '',
    editWalletData: {
      name: '',
      serial: '',
    },
  };
};

const addAccountClickHandler = () => {
  toggleAddAccountModal(true);
};

const addAccountHandler = (payload: IWalletBody) => {
  toggleAddAccountModal(false);
  processAccountCreation(payload);
};

const updateAccountHandler = (payload: TUpdateAccountPayload) => {
  toggleEditAccountModal(false);
  processAccountUpdate(payload);
};

const editAccountClickHandler = (wallet: IWalletRecord) => {
  if (!wallet) {
    return;
  }

  setEditAccountModalData(wallet);
  toggleEditAccountModal(true);
};

const editAccountModalVisibleChangeHandle = (value: boolean) => {
  if (!value) {
    clearEditAccountModalData();
  }
};

const deleteAccountHandler = async (payload: TUpdateAccountPayload) => {
  const { name, serial } = payload;
  toggleEditAccountModal(false);
  const submitted = await openConfirmModal(t('pages.wallets.confirm_delete_named_wallet', { name }).toString());

  if (!submitted) {
    return;
  }

  processAccountDelete(serial);
};

watch(editAccountModalVisible, editAccountModalVisibleChangeHandle);
</script>

<style lang="scss">
.accounts-page {
  @apply flex flex-col gap-y-[3rem] overflow-hidden;
}
</style>

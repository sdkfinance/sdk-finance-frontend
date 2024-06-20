<template>
  <div v-loading="isLoading">
    <subscriptions-table
      :subscriptions="subscriptionsData"
      @add-subscription="addSubscriptionClickHandler"
      @edit-subscription="editSubscriptionClickHandler" />
    <modal
      v-model="addSubscriptionModalVisible"
      width="320px"
      title="pages.wallets.modal.add_subscription">
      <create-subscription-form @submit="addSubscriptionSubmitHandler" />
    </modal>
    <modal
      v-model="editSubscriptionModalVisible"
      width="320px"
      :title="editSubscriptionModalData.title">
      <create-subscription-form
        :edit-form-data="editSubscriptionModalData.formData"
        @submit="addSubscriptionSubmitHandler"
        @delete="subscriptionsDeleteHandler"
        @change-subscription-status="changeSubscriptionStatusHandler" />
    </modal>
    <confirm-modal
      ref="confirmModalRef"
      width="320px"
      :title="confirmModalTitle" />
  </div>
</template>

<script setup lang="ts">
import { SUBSCRIPTION_STATUS } from '@sdk5/shared/constants';
import { useI18n } from '@sdk5/shared/i18n';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { onMounted, ref, watch } from 'vue';

import type { ISubscriptionRecord } from '../../../requests';
import { SubscriptionsRequests } from '../../../requests';
import CreateSubscriptionForm from '../../wallets/components/forms/create-subscription-form/create-subscription-form.vue';
import type { TChangeSubscriptionStatusEmitPayload } from '../../wallets/components/forms/create-subscription-form/types';
import SubscriptionsTable from '../components/subscriptions-table.vue';

const { t } = useI18n();

const confirmModalRef = ref(null) as unknown as Ref<InstanceType<typeof ConfirmModal>>;

const [addSubscriptionModalVisible, toggleAddSubscriptionModal] = useToggle(false);
const [editSubscriptionModalVisible, toggleEditSubscriptionModal] = useToggle(false);

const subscriptionsData = ref([] as ISubscriptionRecord[]);
const isLoading = ref(false);
const confirmModalTitle = ref('');
const editSubscriptionModalData = ref({
  title: '',
  formData: null as ISubscriptionRecord | null,
});

const fetchSubscription = async () => {
  isLoading.value = true;
  const { response, error } = await SubscriptionsRequests.getSubscription();
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  subscriptionsData.value = response?.subscriptions || [];
};
const processSubscriptionDelete = async (subscriptionId: string) => {
  isLoading.value = true;
  const { error } = await SubscriptionsRequests.deleteSubscription(subscriptionId);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  successNotification();
  fetchSubscription();
};
const processChangeSubscriptionStatus = async (payload: TChangeSubscriptionStatusEmitPayload) => {
  const { status, subscriptionId } = payload;

  if (status !== SUBSCRIPTION_STATUS.ACTIVE && status !== SUBSCRIPTION_STATUS.STOPPED) {
    return;
  }

  const updateFunction = status === SUBSCRIPTION_STATUS.ACTIVE ? SubscriptionsRequests.activateSubscription : SubscriptionsRequests.stopSubscription;

  isLoading.value = true;
  const { error } = await updateFunction(subscriptionId);
  isLoading.value = false;

  if (error !== null) {
    errorNotification(error);
    return;
  }

  successNotification();
  fetchSubscription();
};
const setConfirmModalTitle = (title: string) => {
  confirmModalTitle.value = title;
};
const openConfirmModal = async (title: string) => {
  setConfirmModalTitle(title);
  const submitted = await confirmModalRef.value.open();
  setConfirmModalTitle('');
  return submitted;
};
const setEditSubscriptionModalData = (payload: ISubscriptionRecord) => {
  const { name } = payload;
  editSubscriptionModalData.value = {
    title: t('pages.wallets.modal.edit_names_subscription', { name }).toString(),
    formData: payload,
  };
};
const clearEditSubscriptionModalData = () => {
  editSubscriptionModalData.value = {
    title: '',
    formData: null,
  };
};
const addSubscriptionClickHandler = () => {
  toggleAddSubscriptionModal(true);
};
const editSubscriptionClickHandler = (payload: ISubscriptionRecord) => {
  toggleEditSubscriptionModal(true);
  setEditSubscriptionModalData(payload);
};
const addSubscriptionSubmitHandler = () => {
  toggleAddSubscriptionModal(false);
  fetchSubscription();
};
const subscriptionsDeleteHandler = async (payload: ISubscriptionRecord) => {
  toggleEditSubscriptionModal(false);
  const { id } = payload;
  const submitted = await openConfirmModal(t('pages.wallets.confirm_delete_subscription').toString());

  if (!submitted) {
    return;
  }

  processSubscriptionDelete(id);
};
const changeSubscriptionStatusHandler = async (payload: TChangeSubscriptionStatusEmitPayload) => {
  const { subscriptionId, status } = payload;

  if (!subscriptionId || !status) {
    return;
  }

  toggleEditSubscriptionModal(false);

  if (status === SUBSCRIPTION_STATUS.ACTIVE) {
    processChangeSubscriptionStatus(payload);
    return;
  }

  const submitted = await openConfirmModal(t('pages.wallets.confirm_stop_subscription').toString());

  if (!submitted) {
    return;
  }

  processChangeSubscriptionStatus(payload);
};
const editSubscriptionModalVisibleChangeHandler = (value: boolean) => {
  if (!value) {
    clearEditSubscriptionModalData();
  }
};

watch(editSubscriptionModalVisible, editSubscriptionModalVisibleChangeHandler);

onMounted(() => {
  fetchSubscription();
});
</script>

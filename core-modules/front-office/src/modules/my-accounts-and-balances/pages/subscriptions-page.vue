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
        update
        :edit-form-data="editSubscriptionModalData.formData"
        @delete="subscriptionsDeleteHandler"
        @change-subscription-status="changeSubscriptionStatusHandler" />
    </modal>
    <confirm-modal
      ref="confirmModalRef"
      width="320px"
      :title="confirmModalTitle" />
  </div>
</template>

<script lang="ts">
import { SUBSCRIPTION_STATUS } from '@sdk5/shared/constants';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';

import type { ISubscriptionRecord } from '../../../requests';
import { SubscriptionsRequests } from '../../../requests';
import type { TChangeSubscriptionStatusEmitPayload } from '../../wallets/components/forms/create-subscription-form';
import CreateSubscriptionForm from '../../wallets/components/forms/create-subscription-form';
import SubscriptionsTable from '../components/subscriptions-table.vue';

const COMPONENTS = {
  SubscriptionsTable,
  Modal,
  ConfirmModal,
  CreateSubscriptionForm,
} as const;

@Component({
  name: 'subscriptions-page',
  components: COMPONENTS,
})
export default class SubscriptionsPage extends Vue {
  static components: typeof COMPONENTS;

  @Ref('confirmModalRef') readonly confirmModalRef!: ConfirmModal;

  protected isLoading = false;

  protected addSubscriptionModalVisible = false;

  protected editSubscriptionModalVisible = false;

  protected confirmModalTitle = '';

  protected editSubscriptionModalData = {
    title: '',
    formData: null as ISubscriptionRecord | null,
  };

  protected subscriptionsData: ISubscriptionRecord[] = [];

  protected setConfirmModalTitle(title: string) {
    this.confirmModalTitle = title;
  }

  protected setEditSubscriptionModalData(payload: ISubscriptionRecord) {
    const { name } = payload;
    this.editSubscriptionModalData = {
      title: this.$t('pages.wallets.modal.edit_names_subscription', { name }).toString(),
      formData: payload,
    };
  }

  protected clearEditSubscriptionModalData() {
    this.editSubscriptionModalData = {
      title: '',
      formData: null,
    };
  }

  protected toggleAddSubscriptionModal(value: boolean) {
    this.addSubscriptionModalVisible = value;
  }

  protected toggleEditSubscriptionModal(value: boolean) {
    this.editSubscriptionModalVisible = value;
  }

  protected addSubscriptionClickHandler() {
    this.toggleAddSubscriptionModal(true);
  }

  protected editSubscriptionClickHandler(payload: ISubscriptionRecord) {
    this.toggleEditSubscriptionModal(true);
    this.setEditSubscriptionModalData(payload);
  }

  protected addSubscriptionSubmitHandler() {
    this.toggleAddSubscriptionModal(false);
    this.fetchSubscription();
  }

  protected async subscriptionsDeleteHandler(payload: ISubscriptionRecord) {
    this.toggleEditSubscriptionModal(false);
    const { id } = payload;
    const submitted = await this.openConfirmModal(this.$t('pages.wallets.confirm_delete_subscription').toString());

    if (!submitted) {
      return;
    }

    this.processSubscriptionDelete(id);
  }

  protected async changeSubscriptionStatusHandler(payload: TChangeSubscriptionStatusEmitPayload) {
    const { subscriptionId, status } = payload;

    if (!subscriptionId || !status) {
      return;
    }

    this.toggleEditSubscriptionModal(false);

    if (status === SUBSCRIPTION_STATUS.ACTIVE) {
      this.processChangeSubscriptionStatus(payload);
      return;
    }

    const submitted = await this.openConfirmModal(this.$t('pages.wallets.confirm_stop_subscription').toString());

    if (!submitted) {
      return;
    }

    this.processChangeSubscriptionStatus(payload);
  }

  protected async openConfirmModal(title: string) {
    this.setConfirmModalTitle(title);
    const submitted = await this.confirmModalRef.open();
    this.setConfirmModalTitle('');
    return submitted;
  }

  protected async fetchSubscription(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await SubscriptionsRequests.getSubscription();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.subscriptionsData = response?.subscriptions || [];
  }

  protected async processChangeSubscriptionStatus(payload: TChangeSubscriptionStatusEmitPayload) {
    const { status, subscriptionId } = payload;

    if (status !== SUBSCRIPTION_STATUS.ACTIVE && status !== SUBSCRIPTION_STATUS.STOPPED) {
      return;
    }

    const updateFunction =
      status === SUBSCRIPTION_STATUS.ACTIVE ? SubscriptionsRequests.activateSubscription : SubscriptionsRequests.stopSubscription;

    this.isLoading = true;
    const { error } = await updateFunction(subscriptionId);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.fetchSubscription();
  }

  protected async processSubscriptionDelete(subscriptionId: string) {
    this.isLoading = true;
    const { error } = await SubscriptionsRequests.deleteSubscription(subscriptionId);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.fetchSubscription();
  }

  @Watch('editSubscriptionModalVisible')
  protected editSubscriptionModalVisibleChangeHandler(value: boolean) {
    if (!value) {
      this.clearEditSubscriptionModalData();
    }
  }

  created() {
    this.fetchSubscription();
  }
}
</script>

<template>
  <div class="wallets__block">
    <div class="wallets__subtitle">
      {{ $t('pages.wallets.subscription') }}
      <button
        class="button-as-text"
        @click="openCreateModal">
        + {{ $t('action.add_subscription') }}
      </button>
    </div>
    <div
      v-loading="isSubscriptionsLoading"
      class="wallets__carousel">
      <app-carousel
        v-if="!isNoDataSubscriptions"
        :slides="subscriptionsData">
        <template slot-scope="{ slideData, index }">
          <subscription-card
            :index="index"
            :data="slideData"
            @start="onStart"
            @stop="onStop"
            @delete="deleteSubscription"/>
        </template>
      </app-carousel>
    </div>
    <modal
      v-model="isCreateSubscriptionModalVisible"
      :title="$t('pages.wallets.modal.create_subscription')"
      width="380px">
      <create-subscription-form
        @submit="onCreated"/>
    </modal>
    <confirm-modal
      ref="deleteSubscriptionModal"
      title="pages.wallets.confirm_delete_subscription"/>
    <confirm-modal
      ref="stopSubscriptionModal"
      title="pages.wallets.confirm_stop_subscription"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';

import AppCarousel from '@/components/app-carousel.vue';
import ConfirmModal from '@/components/confirm-modal.vue';
import Modal from '@/components/modal.vue';
import NoDataPlaceholder from '@/components/no-data-placeholder.vue';
import SubscriptionCard from '@/modules/wallets/components/cards/subscription-card.vue';
import CreateSubscriptionForm from '@/modules/wallets/components/forms/create-subscription-form.vue';
import { SubscriptionsRequests } from '@/services/requests';
import { ISubscriptionRecord } from '@/services/requests/subscriptions/Subscriptions.types';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppCarousel,
    SubscriptionCard,
    NoDataPlaceholder,
    Modal,
    CreateSubscriptionForm,
    ConfirmModal,
  },
})
export default class SubscriptionsBlock extends Vue {

  @Ref('deleteSubscriptionModal') readonly deleteSubscriptionModal!: ConfirmModal;

  @Ref('stopSubscriptionModal') readonly stopSubscriptionModal!: ConfirmModal;

  protected subscriptionsData: ISubscriptionRecord[] = [];

  protected isSubscriptionsLoading: boolean = false;

  protected isCreateSubscriptionModalVisible: boolean = false;

  protected get isNoDataSubscriptions(): boolean {
    return !this.subscriptionsData.length;
  }

  protected async fetchSubscription(): Promise<void> {
    this.isSubscriptionsLoading = true;
    const { response, error } = await SubscriptionsRequests.getSubscription();
    this.isSubscriptionsLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.subscriptionsData = response?.subscriptions || [];
  }

  protected openCreateModal(): void {
    this.isCreateSubscriptionModalVisible = true;
  }

  protected onCreated(): void {
    this.isCreateSubscriptionModalVisible = false;
    successNotification();
    this.fetchSubscription();
  }

  protected async onStart(id: string): Promise<void> {
    const { error } = await SubscriptionsRequests.activateSubscription(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchSubscription();
  }

  protected async onStop(id: string): Promise<void> {
    const value = await this.stopSubscriptionModal.open();
    if (!value) {
      return;
    }
    const { error } = await SubscriptionsRequests.stopSubscription(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchSubscription();
  }

  protected async deleteSubscription(id: string): Promise<void> {
    const value = await this.deleteSubscriptionModal.open();
    if (!value) {
      return;
    }
    const { error } = await SubscriptionsRequests.deleteSubscription(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchSubscription();
  }

  created() {
    this.fetchSubscription();
  }

}
</script>

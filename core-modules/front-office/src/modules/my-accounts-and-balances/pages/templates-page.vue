<template>
  <div v-loading="isLoading">
    <templates-table
      :transfer-template-records="transferTemplates"
      @add-template="addTemplateClickHandler"
      @edit-template="editTemplateClickHandler"
      @repeat-template="repeatTemplateClickHandler" />
    <modal
      v-model="addTemplateModalVisible"
      title="Add template"
      width="320px">
      <transfer-template-form
        :coins-list="wallets"
        @submit="addTemplateSubmitHandler" />
    </modal>
    <modal
      v-model="editTemplateModalVisible"
      title="Edit template"
      width="320px">
      <transfer-template-form
        :coins-list="wallets"
        :form-data="editTemplateData"
        is-update
        @submit="editTemplateSubmitHandler"
        @delete="deleteTemplateHandler" />
    </modal>
    <modal
      v-model="transferToWalletModalVisible"
      title="pages.wallets.modal.transfer_to_wallet"
      width="380px">
      <transfer-to-wallet-form
        :coins-list="wallets"
        :form-data="editTemplateData"
        is-repeat
        @submit="transferSubmitHandler" />
    </modal>
    <confirm-modal
      ref="confirmModalRef"
      :title="confirmModalTitle" />
  </div>
</template>

<script lang="ts">
import type { IWalletRecord } from '@sdk5/shared/requests';
import { WalletsRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { ConfirmModal, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';

import type { ITransferTemplateRecord } from '../../../requests';
import { TemplatesRequests } from '../../../requests';
import TransferTemplateForm from '../../wallets/components/forms/transfer-template-form.vue';
import TransferToWalletForm from '../../wallets/components/forms/transfer-to-wallet-form.vue';
import TemplatesTable from '../components/templates-table.vue';

const COMPONENTS = {
  TemplatesTable,
  Modal,
  TransferTemplateForm,
  TransferToWalletForm,
  ConfirmModal,
} as const;

@Component({
  name: 'templates-page',
  components: COMPONENTS,
})
export default class TemplatesPage extends Vue {
  static components: typeof COMPONENTS;

  @Ref('confirmModalRef') readonly confirmModalRef!: ConfirmModal;

  protected isLoading = false;

  protected transferTemplates: ITransferTemplateRecord[] = [];

  protected wallets: IWalletRecord[] = [];

  protected addTemplateModalVisible = false;

  protected editTemplateModalVisible = false;

  protected transferToWalletModalVisible = false;

  protected confirmModalTitle = '';

  protected editTemplateData: ITransferTemplateRecord | null = null;

  protected async fetchTemplates() {
    this.isLoading = true;
    const { response, error } = await TemplatesRequests.getTemplateTransfers();
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    this.transferTemplates = response?.transferTemplates ?? [];
  }

  protected setConfirmModalTitle(title: string) {
    this.confirmModalTitle = title;
  }

  protected toggleAddTemplateModal(value: boolean) {
    this.addTemplateModalVisible = value;
  }

  protected toggleEditTemplateModal(value: boolean) {
    this.editTemplateModalVisible = value;
  }

  protected toggleTransferToWalletModal(value: boolean) {
    this.transferToWalletModalVisible = value;
  }

  protected addTemplateClickHandler() {
    this.toggleAddTemplateModal(true);
  }

  protected editTemplateClickHandler(template: ITransferTemplateRecord) {
    this.setEditTemplateModalData(template);
    this.toggleEditTemplateModal(true);
  }

  protected repeatTemplateClickHandler(template: ITransferTemplateRecord) {
    this.toggleTransferToWalletModal(true);
    this.setEditTemplateModalData(template);
  }

  protected addTemplateSubmitHandler() {
    this.toggleAddTemplateModal(false);
    this.fetchTemplates();
  }

  protected editTemplateSubmitHandler() {
    this.toggleEditTemplateModal(false);
    this.fetchTemplates();
  }

  protected transferSubmitHandler() {
    this.toggleTransferToWalletModal(false);
  }

  protected setEditTemplateModalData(payload: ITransferTemplateRecord) {
    this.editTemplateData = payload;
  }

  protected clearEditTemplateModalData() {
    this.editTemplateData = null;
  }

  protected async openConfirmModal(title: string) {
    this.setConfirmModalTitle(title);
    const submitted = await this.confirmModalRef.open();
    this.setConfirmModalTitle('');
    return submitted;
  }

  protected async deleteTemplateHandler(payload: ITransferTemplateRecord) {
    this.toggleEditTemplateModal(false);
    const { name, id } = payload;
    const submitted = await this.openConfirmModal(this.$t('pages.wallets.confirm_delete_named_template', { name }).toString());

    if (!submitted) {
      return;
    }

    this.processTemplateDelete(id);
  }

  protected async fetchWallets(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await WalletsRequests.getWallets();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.wallets = response?.coins || [];
  }

  protected async processTemplateDelete(id: string) {
    this.isLoading = true;
    const { error } = await TemplatesRequests.deleteTemplateTransfer(id);
    this.isLoading = false;

    if (error !== null) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.fetchTemplates();
  }

  @Watch('transferToWalletModalVisible')
  @Watch('editTemplateModalVisible')
  protected modalWithDataChangeHandler(value: boolean) {
    if (!value) {
      this.clearEditTemplateModalData();
    }
  }

  created() {
    this.fetchTemplates();
    this.fetchWallets();
  }
}
</script>

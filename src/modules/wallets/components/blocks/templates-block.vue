<template>
  <div class="wallets__block">
    <div class="wallets__subtitle">
      {{ $t('pages.wallets.templates') }}
      <button
        class="button-as-text"
        @click="isTransferCreateTemplateModalVisible = true">
        + {{ $t('action.add_template') }}
      </button>
    </div>
    <div
      v-loading="isTemplatesLoading"
      class="wallets__carousel">
      <app-carousel
        v-if="!isNoDataTemplates"
        :slides="templatesData">
        <template slot-scope="{ slideData, index }">
          <template-card
            :index="index"
            :template-data="slideData"
            @repeat="openRepeatModal"
            @edit="openEditTemplateModal"/>
        </template>
      </app-carousel>
    </div>
    <modal
      v-model="isTransferCreateTemplateModalVisible"
      :title="$t('pages.wallets.modal.add_template')"
      width="380px">
      <transfer-template-form
        :coins-list="coinsData"
        :is-loading="isWalletLoading"
        @submit="onTemplateSubmit"/>
    </modal>
    <modal
      v-model="isTransferUpdateTemplateModalVisible"
      :title="$t('pages.wallets.modal.edit_template')"
      width="380px">
      <transfer-template-form
        :coins-list="coinsData"
        :is-loading="isWalletLoading"
        :form-data="templateFormData"
        :is-update="true"
        @delete="deleteTemplate"
        @submit="onTemplateSubmit"/>
    </modal>
    <modal
      v-model="isTransferToWalletModalVisible"
      :title="$t('pages.wallets.modal.transfer_to_wallet')"
      width="380px">
      <transfer-to-wallet-form
        :coins-list="coinsData"
        :form-data="templateFormData"
        :is-repeat="isRepeat"
        :is-loading="isWalletLoading"
        @submit="onTemplateSubmit"/>
    </modal>
    <confirm-modal
      ref="deleteTemplateModal"
      title="pages.wallets.confirm_delete_template"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';
import TemplateCard from '@/modules/wallets/components/cards/template-card.vue';
import AppCarousel from '@/components/app-carousel.vue';
import ConfirmModal from '@/components/confirm-modal.vue';
import Modal from '@/components/modal.vue';
import TransferTemplateForm from '@/modules/wallets/components/forms/transfer-template-form.vue';
import TransferToWalletForm from '@/modules/wallets/components/forms/transfer-to-wallet-form.vue';
import NoDataPlaceholder from '@/components/no-data-placeholder.vue';
import { ITransferTemplateRecord } from '@/services/requests/templates/Templates.types';
import { TemplatesRequests } from '@/services/requests/templates/TemplatesRequests';
import { errorNotification, successNotification } from '@/utils';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';

@Component({
  components: {
    TemplateCard,
    AppCarousel,
    ConfirmModal,
    Modal,
    TransferTemplateForm,
    TransferToWalletForm,
    NoDataPlaceholder,
  },
})
export default class TemplatesBlock extends Vue {

  @Ref('deleteTemplateModal') readonly deleteTemplateModal!: ConfirmModal;

  @Prop({ type: Array, default: () => ([]) }) readonly coinsData!: IWalletRecord[];

  @Prop({ type: Boolean, default: false }) readonly isWalletLoading!: boolean;

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected templatesData: ITransferTemplateRecord[] = [];

  protected templateFormData: Partial<ITransferTemplateRecord> = {};

  protected isTransferCreateTemplateModalVisible: boolean = false;

  protected isTransferUpdateTemplateModalVisible: boolean = false;

  protected isTransferToWalletModalVisible: boolean = false;

  protected isTemplatesLoading: boolean = false;

  protected isRepeat: boolean = false;

  protected get isNoDataTemplates(): boolean {
    return !this.templatesData.length;
  }

  protected async fetchTemplates(): Promise<void> {
    this.isTemplatesLoading = true;
    const { response, error } = await TemplatesRequests.getTemplateTransfers();
    this.isTemplatesLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.templatesData = response?.transferTemplates || [];
  }

  protected openEditTemplateModal(data: ITransferTemplateRecord): void {
    this.isTransferUpdateTemplateModalVisible = true;
    this.templateFormData = data;
  }

  protected onTemplateSubmit(): void {
    this.isTransferCreateTemplateModalVisible = false;
    this.isTransferUpdateTemplateModalVisible = false;
    this.isTransferToWalletModalVisible = false;
    this.fetchTemplates();
    this.onSubmit();
  }

  protected openRepeatModal(data: ITransferTemplateRecord): void {
    this.templateFormData = data;
    this.openTransferModal(true);
  }

  public openTransferModal(isRepeat: boolean = false): void {
    this.isRepeat = isRepeat;
    this.isTransferToWalletModalVisible = true;
  }

  protected async deleteTemplate(id: string): Promise<void> {
    const value = await this.deleteTemplateModal.open();
    if (!value) {
      return;
    }
    const { error } = await TemplatesRequests.deleteTemplateTransfer(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.isTransferUpdateTemplateModalVisible = false;
    await this.fetchTemplates();
  }

  async created() {
    await this.fetchTemplates();
  }

}
</script>

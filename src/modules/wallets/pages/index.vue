<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.wallets.title') }}
      </template>
    </main-head>
    <div class="wallets">
      <div class="wallets__header">
        <div
          v-loading="isWalletLoading"
          class="wallets__cards">
          <app-carousel
            v-if="coinsData.length"
            key-prop="serial"
            :slides="coinsData">
            <template slot-scope="{ slideData }">
              <wallet-card
                :wallet-data="slideData"
                @update="updateWallet"
                @delete="deleteWallet"/>
            </template>
          </app-carousel>
        </div>
        <main-actions
          @currency-exchange="isCurrencyExchangeVisible = true"
          @withdrawal="isWithdrawalModalVisible = true"
          @transfer-to-wallet="openTransferModal"
          @add-wallet="openCreateWalletModal"
          @top-up="openTopUpModal"/>
      </div>
      <templates-block
        ref="templates"
        :coins-data="coinsData"
        :is-wallet-loading="isWalletLoading"
        @submit="refreshData"/>
      <subscriptions-block/>
      <operations-block
        ref="operations"
        :coins-data="coinsData"/>
    </div>
    <currency-exchange-block
      v-model="isCurrencyExchangeVisible"
      :coins-list="coinsData"
      :is-loading="isWalletLoading"
      @on-exchange="refreshData"/>
    <modal
      v-model="isCreateWalletModalVisible"
      :title="$t('pages.wallets.modal.create_wallet')"
      width="380px">
      <create-wallet-form
        :issuer-list="filteredIssuerList"
        :is-loading="isLoadingModalData"
        @submit="onWalletCreated"/>
    </modal>
    <modal
      v-model="isTopUpModalVisible"
      :title="topUpModalTitle"
      width="380px"
      @change="onTopUpModalClose">
      <top-up-form
        :coins-list="coinsData"
        :is-loading="isWalletLoading"
        @submit="onTopUpCreated"/>
    </modal>
    <modal
      v-model="isWithdrawalModalVisible"
      :title="$t('pages.wallets.modal.withdrawal')"
      width="380px">
      <withdrawal-form
        :coins-list="coinsData"
        :is-loading="isWalletLoading"
        @submit="refreshData"/>
    </modal>
    <confirm-modal
      ref="deleteWalletModal"
      title="pages.wallets.confirm_delete_wallet"/>
  </section>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import MainHead from '@/components/main-head.vue';
import AppCarousel from '@/components/app-carousel.vue';
import WalletCard from '@/modules/wallets/components/cards/wallet-card.vue';
import MainActions from '@/modules/wallets/components/main-actions.vue';
import CreateWalletForm from '@/modules/wallets/components/forms/create-wallet-form.vue';
import TopUpForm from '@/modules/wallets/components/forms/top-up-form.vue';
import WithdrawalForm from '@/modules/wallets/components/forms/withdrawal-form/index.vue';
import ConfirmModal from '@/components/confirm-modal.vue';
import Modal from '@/components/modal.vue';
import { WalletsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import { CatalogModule } from '@/store/modules/dynamic';
import TemplatesBlock from '@/modules/wallets/components/blocks/templates-block.vue';
import SubscriptionsBlock from '@/modules/wallets/components/blocks/subscriptions-block.vue';
import OperationsBlock from '@/modules/wallets/components/blocks/operations-block.vue';
import CurrencyExchangeBlock from '@/modules/wallets/components/blocks/currency-exchange-block.vue';

@Component({
  components: {
    MainHead,
    WalletCard,
    AppCarousel,
    MainActions,
    ConfirmModal,
    Modal,
    CreateWalletForm,
    TopUpForm,
    WithdrawalForm,
    TemplatesBlock,
    SubscriptionsBlock,
    OperationsBlock,
    CurrencyExchangeBlock,
  },
})
export default class WalletsPage extends Vue {

  @Ref('deleteWalletModal') readonly deleteWalletModal!: ConfirmModal;

  @Ref('templates') readonly templates!: TemplatesBlock;

  @Ref('operations') readonly operations!: OperationsBlock;

  protected isWalletLoading: boolean = false;

  protected isLoadingModalData: boolean = false;

  protected isCreateWalletModalVisible: boolean = false;

  protected isTopUpModalVisible: boolean = false;

  protected isCurrencyExchangeVisible: boolean = false;

  protected isWithdrawalModalVisible: boolean = false;

  protected isTopUpFinished: boolean = false;

  protected coinsData: IWalletRecord[] = [];

  protected get filteredIssuerList() {
    return CatalogModule.issuerList.filter((issuer) => (
      !this.coinsData.find(({ issuer: { id } }) => issuer.id === id)
    ));
  }

  protected get topUpModalTitle(): string {
    return this.isTopUpFinished
      ? 'pages.wallets.modal.created_top_up_modal_title'
      : 'pages.wallets.modal.create_top_up_modal_title';
  }

  protected async fetchWallets(): Promise<void> {
    this.isWalletLoading = true;
    const { response, error } = await WalletsRequests.getWallets();
    this.isWalletLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.coinsData = response?.coins || [];
  }

  protected async refreshData() {
    await this.fetchWallets();
    await this.fetchOperations();
  }

  protected async updateWallet({ name, serial }: { name: string; serial: string }): Promise<void> {
    const { error } = await WalletsRequests.updateWallet(serial, { name });

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

  protected async deleteWallet(serial: string): Promise<void> {
    const value = await this.deleteWalletModal.open();

    if (!value) return;

    const { error } = await WalletsRequests.deleteWallet(serial);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchWallets();
  }

  protected async openCreateWalletModal(): Promise<void> {
    this.isCreateWalletModalVisible = true;
    if (CatalogModule.issuerList.length) return;

    this.isLoadingModalData = true;
    await CatalogModule.fetchIssuers();
    this.isLoadingModalData = false;
  }

  protected openTopUpModal(): void {
    this.isTopUpFinished = false;
    this.isTopUpModalVisible = true;
  }

  protected onWalletCreated(): void {
    this.isCreateWalletModalVisible = false;
    this.fetchWallets();
  }

  protected onTopUpCreated(): void {
    this.isTopUpFinished = true;
  }

  protected onTopUpModalClose() {
    if (this.isTopUpFinished) this.refreshData();
  }

  protected openTransferModal(): void {
    this.templates.openTransferModal();
  }

  protected fetchOperations(): void {
    this.operations.fetchTransactions();
  }

  async created() {
    await this.fetchWallets();
    this.fetchOperations();
  }

}
</script>

<style lang="scss">
.wallets {
  &__header {
    display: flex;
    align-items: stretch;
    margin-bottom: 48px;
  }

  &__block {
    margin-bottom: 48px;
  }

  &__cards {
    width: 460px;
  }

  &__actions {
    width: auto;
  }

  &__carousel {
    width: 100%;
    margin-bottom: 48px;
  }

  &__subtitle {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 32px;

    .button-as-text {
      font-weight: 600;
      font-size: 14px;
      margin-left: 10px;

      .icon {
        font-size: 6px;
        margin-left: 4px;
      }
    }
  }
}
</style>

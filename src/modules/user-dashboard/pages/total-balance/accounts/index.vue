<template>
  <div>
    <div class="section-header">
      <span class="section-header__headline">
        {{ $t('pages.accounts.title') }}
      </span>

      <app-button
        class="section-header__button"
        icon="icon-plus"
        transparent
        @click="openAddAccountModal">
        <span class="button-label">
          {{ $t('action.add_account') }}
        </span>
      </app-button>
    </div>

    <div
      v-loading="isWalletsLoading"
      class="cards-container">
      <app-wallet-card
        v-for="(card, i) in coinList"
        :key="`wallet_${i}`"
        :title="card.name"
        :subtitle="card.serial"
        :prefix-symbol="card.issuer.symbol"
        :img-url="card.image"
        :value="card.availableAmount"
        :to="{name: 'user-dashboard-account', params: {serial: card.serial}}"/>
    </div>

    <app-modal
      ref="accountFormModal"
      modal-body-class="max-w-520"
      is-full-width>
      <template #default="{onSubmit}">
        <account-form-modal
          @submit="onSubmit"/>
      </template>
    </app-modal>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppWalletCard from '@/components/ui-kit/app-wallet-card.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import AccountFormModal from '@/shared-components/account-form-modal.vue';
import { UserCoins } from '@/store/modules';

@Component({
  components: {
    AppModal,
    AppWalletCard,
    AppButton,
    AccountFormModal,
  },
})
export default class AccountPage extends Vue {

  @Ref('accountFormModal') readonly accountFormModal!: AppModal;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isWalletsLoading: boolean = false;

  protected async created(): Promise<void> {
    await this.refreshCoins();
  }

  protected async refreshCoins(): Promise<void> {
    this.isWalletsLoading = true;
    await this.userCoinsModule.fetchCoins(true);
    this.isWalletsLoading = false;
  }

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected async openAddAccountModal(): Promise<void> {
    const isSubmitted = await this.accountFormModal.open();

    if (isSubmitted) {
      await this.refreshCoins();
    }
  }

}
</script>

<style lang="scss">
.section-header {
  @apply flex justify-between items-center mb-24;

  &__headline {
    @apply font-medium text-xl;
  }

  .btn-icon--left {
    @apply mr-0 md:mr-3;
  }
}

.cards-container {
  @apply grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 sm:min-h-150;
}

.button-label {
  @apply hidden md:inline;
}

.form-account {
  @apply flex flex-col;

  &__item {
    @apply mb-32;
  }

  &__button {
    @apply max-w-300 mx-auto w-full;
  }
}
</style>

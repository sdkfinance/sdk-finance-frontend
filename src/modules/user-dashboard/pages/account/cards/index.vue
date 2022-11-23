<template>
  <div class="cards-page">
    <div class="cards-page__header">
      <span class="cards-page__title">
        {{ $t('pages.user_dashboard.cards.title') }}
      </span>

      <app-button
        icon="icon-plus"
        transparent
        @click="openAddCardModal">
        <span class="button-label">
          {{ $t('action.add_card') }}
        </span>
      </app-button>
    </div>

    <div
      class="cards-page__container">
      <app-smart-card
        v-for="(card, i) in currentSmartCards"
        :key="`card_${i}`"
        :title="card.name"
        :card-number="card.cardNumber"
        :to="{name: 'user-dashboard-account-card', params: { id: currentSerial, cardId: card.id}}"
        class="cards-page__card">
        <app-card-progress
          :amount="account.amount"
          :available-amount="account.availableAmount"
          :currency-symbol="account.issuer.symbol"/>
      </app-smart-card>
    </div>

    <app-modal
      ref="appModal"
      modal-body-class="max-w-520"
      is-full-width>
      <template #default="{ onSubmit }">
        <smart-card-form @submitted="onSubmit"/>
      </template>
    </app-modal>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop,
  Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppCardProgress from '@/components/ui-kit/app-card-progress.vue';
import AppSmartCard from '@/components/ui-kit/app-smart-card.vue';
import AppWalletCard from '@/components/ui-kit/app-wallet-card.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import SmartCardForm from '@/modules/user-dashboard/pages/account/cards/components/smart-card-form.vue';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { ISmartCardShort } from '@/services/requests/smart-cards/SmartCards.types';
import { UserCoins } from '@/store/modules';

@Component({
  components: {
    SmartCardForm,
    AppCardProgress,
    AppWalletCard,
    AppButton,
    AppModal,
    AppSmartCard,
  },
})
export default class CardsPage extends Vue {

  @Ref('appModal') readonly appModal!: AppModal;

  @Prop({ type: Object, default: () => ({}) }) readonly account!: ICoin

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected currentSerial: string = this.$route.params?.serial;

  protected get currentSmartCards(): ISmartCardShort[] {
    return this.account?.smartCards || [];
  }

  protected async openAddCardModal(): Promise<void> {
    const isSubmit = await this.appModal.open();
    if (!isSubmit) {
      return;
    }

    await this.userCoinsModule.fetchCoins(true);
  }

}
</script>

<style lang="scss">
.cards-page {
  &__header {
    @apply flex justify-between items-center mb-24;

    .btn-icon--left {
      @apply mr-0 md:mr-8;
    }
  }

  &__title {
    @apply font-medium text-xl;
  }

  &__container {
    @apply grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 sm:min-h-150;
  }
}

.button-label {
  @apply hidden md:inline;
}
</style>

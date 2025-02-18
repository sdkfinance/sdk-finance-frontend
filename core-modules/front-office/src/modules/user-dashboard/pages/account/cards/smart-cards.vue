<template>
  <div class="cards-page">
    <div class="cards-page__header">
      <span class="cards-page__title">
        {{ $t('pages.user_dashboard.in_system_cards.title') }}
      </span>

      <app-button
        icon="icon-plus"
        transparent
        @click="openAddCardModal">
        <span class="button-label">
          {{ $t('action.add_in_system_card') }}
        </span>
      </app-button>
    </div>

    <div class="cards-page__container">
      <app-smart-card
        v-for="(card, i) in currentSmartCards"
        :key="`card_${i}`"
        :title="card.name"
        :card-number="card.cardNumber"
        :to="{ name: 'user-dashboard-account-in-system-card', params: { id: currentSerial, cardId: card.id } }"
        class="cards-page__card">
        <app-card-progress
          :amount="account.amount"
          :available-amount="account.availableAmount"
          :currency-symbol="account.currency.symbol" />
      </app-smart-card>
    </div>

    <app-modal
      ref="appModal"
      modal-body-class="max-w-520"
      is-full-width>
      <template #default="{ onSubmit }">
        <smart-card-form @submitted="onSubmit" />
      </template>
    </app-modal>
  </div>
</template>

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import type { ISmartCardShort } from '@sdk5/shared/types';
import { AppButton, AppCardProgress, AppModal, AppSmartCard, AppWalletCard } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../../store/modules';
import SmartCardForm from './components/smart-card-form.vue';

const COMPONENTS = {
  SmartCardForm,
  AppCardProgress,
  AppWalletCard,
  AppButton,
  AppModal,
  AppSmartCard,
} as const;

@Component({
  components: COMPONENTS,
})
export default class CardsPage extends Vue {
  static components: typeof COMPONENTS;

  @Ref('appModal') readonly appModal!: AppModal;

  @Prop({ type: Object as PropType<ICoin>, default: () => ({}) }) readonly account!: ICoin;

  $props!: {
    account?: ICoin;
  };

  @Emit('updated-settings')
  protected updatedSettings(): boolean {
    return true;
  }

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
    this.updatedSettings();
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

<template>
  <div
    v-loading="isLoading"
    class="card-page">
    <div class="card-page__row">
      <div class="card-page__main">
        <div class="card-page__card-text">
          <img
            src="/images/icons/masterpass.svg"
            class="w-18 h-18"
            alt="">
          {{ maskedCardNumber }} • {{ card.expirationDate }}
        </div>
        <div class="card-page__title">
          {{ card.name }}
        </div>
        <app-card-progress
          class="card-page__progress"
          :amount="currentAccount.amount"
          :available-amount="currentAccount.availableAmount"
          :currency-symbol="currentCurrency"/>
      </div>
      <div class="card-page__card">
        <app-card-preview
          :card-number="card.cardNumber"
          :exp-date="card.expirationDate"
          :full-name="card.name"/>
      </div>
    </div>

    <app-tab-links
      :tabs="tabs"
      secondary/>
    <router-view
      :card="card"
      @updated-settings="getCardDetails"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import { IRouteConfig } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppButtonsMobile from '@/components/ui-kit/app-buttons-mobile.vue';
import { CARD_CHILDREN } from '@/modules/user-dashboard/routes/CARD_CHILDREN';
import AppCardProgress from '@/components/ui-kit/app-card-progress.vue';
import { getDisplayCardNumber } from '@/modules/user-dashboard/utils/getDisplayCardNumber';
import { SmartCardsRequests } from '@/services/requests/smart-cards/SmartCardsRequests';
import { errorNotification } from '@/utils';
import { UserCoins } from '@/store/modules';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { ISmartCardRecord } from '@/services/requests/smart-cards/SmartCards.types';
import AppCardPreview from '@/components/ui-kit/app-card-preview.vue';

@Component({
  components: {
    AppCardPreview,
    AppCardProgress,
    AppButton,
    AppButtonsMobile,
    AppTabLinks,
  },
})
export default class CardPage extends Vue {

  protected tabs: IRouteConfig[] = CARD_CHILDREN;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected currentSerial: string = this.$route.params?.serial;

  protected card: ISmartCardRecord = {} as ISmartCardRecord;

  protected cardId: string = this.$route.params?.cardId;

  protected isLoading: boolean = false;

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected get currentAccount(): ICoin {
    return this.coinList.find(({ serial }) => serial === this.currentSerial) || {} as ICoin;
  }

  protected get currentCurrency(): string {
    return this.currentAccount?.issuer?.symbol || '';
  }

  protected get maskedCardNumber(): string {
    return getDisplayCardNumber(this.card?.cardNumber || '');
  }

  protected async created(): Promise<void> {
    this.isLoading = true;

    await Promise.all([
      this.userCoinsModule.fetchCoins(),
      this.getCardDetails(),
    ]);

    this.isLoading = false;
  }

  protected async getCardDetails(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await SmartCardsRequests.getUserCardById(this.cardId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    [this.card] = response?.records || [{} as ISmartCardRecord];
  }

}
</script>

<style lang="scss">
.card-page {
  &__row {
    @apply flex justify-between relative;
  }

  &__main {
    max-width: 384px;

    @apply flex-1 mr-32;

    @media (max-width: theme('screens.sm')) {
      margin-right: calc(10% + 32px);
    }
  }

  &__card {
    @apply absolute sm:static flex-shrink-0;

    @media (max-width: theme('screens.sm')) {
      left: 90%;
    }
  }

  &__card-text {
    @apply flex items-center text-gray-400 font-semibold mb-12;

    img {
      @apply mr-8;
    }
  }

  &__title {
    @apply text-blue-700 text-3xl sm:text-40 mb-16;
  }

  &__progress {
    @apply mb-80;
  }
}
</style>

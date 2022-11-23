<template>
  <div
    v-loading="isLoading"
    class="total-balance">
    <div
      class="total-balance__welcome">
      👋 {{ $t('pages.user_dashboard.total_balance.welcome') }}, {{ personName }}
    </div>

    <div class="total-balance__title">
      {{ $t('pages.user_dashboard.total_balance.title') }}
      <span
        class="total-balance__title-amount">{{ prefixedTotalBalance }}</span>
      <app-select
        v-model="selectedWallet"
        value-key="issuer.currency"
        class="total-balance__dropdown"
        is-dropdown
        style="width: 100px"
        :options="coinList"
        option-label="issuer.currency"
        @change="onWalletChange"/>
    </div>

    <frequently-used-activities
      class="total-balance__actions"
      :coin-list="coinList"
      @updateData="updateData"/>

    <app-tab-links
      :tabs="tabs"
      secondary/>

    <router-view ref="routerViewNode"/>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppButtonsMobile from '@/components/ui-kit/app-buttons-mobile.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import ExchangeFormModal from '@/modules/user-dashboard/components/exchange-form-modal.vue';
import FrequentlyUsedActivities from '@/modules/user-dashboard/components/frequently-used-activities.vue';
import { TOTAL_BALANCE_CHILDREN } from '@/modules/user-dashboard/routes/TOTAL_BALANCE_CHILDREN';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { Profile, UserCoins } from '@/store/modules';
import { IRouteConfig } from '@/types/interfaces';
import { prefixedMoneyAmount } from '@/utils/moneyAmountFormat';

interface IRouterView {
  updateData?: Function;
}

@Component({
  components: {
    FrequentlyUsedActivities,
    AppModal,
    AppSelect,
    AppButton,
    AppButtonsMobile,
    AppTabLinks,
    ExchangeFormModal,
  },
})
export default class TotalBalancePage extends Vue {

  @Ref('routerViewNode') readonly routerViewNode!: IRouterView;

  protected tabs: IRouteConfig[] = TOTAL_BALANCE_CHILDREN;

  protected profileModule = getModule(Profile, this.$store);

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isLoading: boolean = false;

  protected currentWallet: ICoin | null = null;

  protected get selectedWallet(): ICoin {
    return this.currentWallet || this.coinList[0];
  }

  protected set selectedWallet(value: ICoin) {
    this.currentWallet = value;
  }

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins?.reduce((acc: ICoin[], coin: ICoin) => {
      const { id, currency } = coin?.issuer;
      const isCurrencyExist = acc.find((item) => item?.issuer?.currency === currency && item?.issuer?.id === id);

      return isCurrencyExist ? acc : [...acc, coin];
    }, []);
  }

  protected get selectedCurrency(): string {
    return this.selectedWallet?.issuer?.currency || this.coinList[0]?.issuer?.currency;
  }

  protected get personName(): string {
    return this.profileModule.personName;
  }

  protected get prefixedTotalBalance(): string {
    return prefixedMoneyAmount(this.userCoinsModule.totalBalance, this.selectedWallet?.issuer.symbol);
  }

  protected async updateData(): Promise<void> {
    await this.refreshCoins();

    if (this.routerViewNode.updateData) {
      await this.routerViewNode.updateData();
    }
  }

  protected async created(): Promise<void> {
    this.isLoading = true;
    await this.userCoinsModule.fetchCoins();
    await this.userCoinsModule.fetchCoinDetails(this.selectedCurrency);
    this.isLoading = false;
  }

  protected async refreshCoins(): Promise<void> {
    this.isLoading = true;
    await this.userCoinsModule.fetchCoins(true);
    this.isLoading = false;
  }

  protected async onWalletChange(wallet: ICoin) {
    this.isLoading = true;
    await this.userCoinsModule.fetchCoinDetails(wallet.issuer.currency);
    this.isLoading = false;
  }

}
</script>

<style lang="scss">
.total-balance {
  &__title {
    @apply text-blue-700 text-40 mb-24;

    &-amount {
      @apply text-blue-accent text-40 mr-10;
    }
  }

  &__welcome {
    @apply mb-12 text-gray-400 text-xl;
  }

  &__actions {
    @apply mb-100;
  }

  &__wrapper {
    @apply flex leading-9;
  }

  &__dropdown {
    bottom: 10px;
    line-height: 33px;

    @apply inline-block relative;
  }
}
</style>

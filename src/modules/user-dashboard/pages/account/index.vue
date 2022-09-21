<template>
  <div
    v-loading="isLoading"
    class="account-details">
    <div class="account-details__welcome">
      <img
        v-if="currentIssuer.currency"
        :src="`/images/currencies/${currentIssuer.currency.toLowerCase()}.svg`"
        alt=""
        class="account-details__welcome-icon"> {{ currentAccount.name }}
    </div>
    <div class="account-details__title">
      {{ currentIssuer.symbol }} {{ currentAccount.availableAmount }}
    </div>
    <frequently-used-activities
      class="account-details__actions"
      :coin-list="coinList"
      @updateData="updateData"/>
    <app-tab-links
      :tabs="tabs"
      secondary/>
    <router-view
      ref="routerViewNode"
      :account="currentAccount"
      @updated-settings="fetchAccounts"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import { IRouteConfig } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import { UserCoins } from '@/store/modules';
import AppButtonsMobile from '@/components/ui-kit/app-buttons-mobile.vue';
import { ACCOUNT_CHILDREN } from '@/modules/user-dashboard/routes/ACCOUNT_CHILDREN';
import { ICoin, ICoinIssuer } from '@/services/requests/organizations/Coin.types';
import FrequentlyUsedActivities from '@/modules/user-dashboard/components/frequently-used-activities.vue';

interface IRouterView {
  updateData?: Function;
}

@Component({
  components: {
    FrequentlyUsedActivities,
    AppButton,
    AppButtonsMobile,
    AppTabLinks,
  },
})
export default class AccountPage extends Vue {

  @Ref('routerViewNode') readonly routerViewNode!: IRouterView;

  protected tabs: IRouteConfig[] = ACCOUNT_CHILDREN;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isLoading: boolean = false;

  protected serial: string = this.$route.params?.serial || '';

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected get currentAccount(): ICoin {
    return this.coinList.find(({ serial }) => serial === this.serial) || {} as ICoin;
  }

  protected get currentIssuer(): ICoinIssuer {
    return this.currentAccount?.issuer || {} as ICoinIssuer;
  }

  protected async updateData(): Promise<void> {
    if (this.routerViewNode.updateData) {
      await this.routerViewNode.updateData();
    }
  }

  protected async fetchAccounts(force: boolean) {
    this.isLoading = true;
    await this.userCoinsModule.fetchCoins(force);
    this.isLoading = false;
  }

  protected async created(): Promise<void> {
    await this.fetchAccounts(false);
  }

}
</script>

<style lang="scss">
.account-details {
  &__title {
    @apply text-blue-700 text-40 mb-24;

    &-amount {
      @apply text-blue-accent text-40;
    }
  }

  &__welcome {
    @apply mb-12 text-gray-400 text-xl flex items-center;

    &-icon {
      @apply w-18 h-18 mr-8;
    }
  }

  &__actions {
    @apply mb-100;
  }
}
</style>

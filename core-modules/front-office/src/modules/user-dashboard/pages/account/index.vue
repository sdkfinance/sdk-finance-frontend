<template>
  <div
    v-loading="isLoading"
    class="account-details">
    <div class="account-details__welcome">
      <img
        v-if="currentCurrency.code"
        :src="`/images/currencies/${currentCurrency.code.toLowerCase()}.svg`"
        alt=""
        class="account-details__welcome-icon" />
      {{ currentAccount.name }}
    </div>
    <div class="account-details__title">{{ currentCurrency.symbol }} {{ currentAccount.availableAmount }}</div>
    <frequently-used-activities
      class="account-details__actions"
      :coin-list="coinList"
      @updateData="updateData" />
    <app-tab-links
      :tabs="tabs"
      secondary />
    <router-view
      ref="routerViewNode"
      :account="currentAccount"
      @updated-settings="fetchAccounts" />
  </div>
</template>

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import type { IRouteConfig } from '@sdk5/shared/types';
import { AppButton, AppButtonsMobile, AppTabLinks } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../store/modules';
import FrequentlyUsedActivities from '../../components/frequently-used-activities.vue';
import { ACCOUNT_CHILDREN } from '../../routes/ACCOUNT_CHILDREN';

interface IRouterView {
  updateData?: Function;
}

const COMPONENTS = {
  FrequentlyUsedActivities,
  AppButton,
  AppButtonsMobile,
  AppTabLinks,
} as const;

@Component({
  components: COMPONENTS,
})
export default class AccountPage extends Vue {
  static components: typeof COMPONENTS;

  @Ref('routerViewNode') readonly routerViewNode!: IRouterView;

  protected tabs: IRouteConfig[] = ACCOUNT_CHILDREN;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isLoading: boolean = false;

  protected serial: string = this.$route.params?.serial || '';

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected get currentAccount(): ICoin {
    return this.coinList.find(({ serial }) => serial === this.serial) || ({} as ICoin);
  }

  protected get currentCurrency() {
    return this.currentAccount?.currency || {};
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

<template>
  <div
    v-loading="isLoaderVisible"
    class="total-balance">
    <div class="total-balance__welcome">👋 {{ $t('pages.user_dashboard.total_balance.welcome') }}, {{ personName }}</div>

    <div class="total-balance__title">
      {{ $t('pages.user_dashboard.total_balance.title') }}
      <span class="total-balance__title-amount">{{ prefixedTotalBalance }}</span>
      <app-select
        v-model="selectedWallet"
        value-key="currency.code"
        class="total-balance__dropdown"
        is-dropdown
        style="width: 100px"
        :options="coinList"
        option-label="currency.code"
        :fit-popper-width="false" />
    </div>

    <frequently-used-activities
      class="total-balance__actions"
      :coin-list="coinList"
      @updateData="updateData" />

    <app-tab-links
      :tabs="tabs"
      secondary />

    <router-view ref="routerViewNode" />
  </div>
</template>

<script setup lang="ts">
import { useGetVuexModule, useGetWalletsApi } from '@sdk5/shared/composables';
import type { ICoin } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { IRouteConfig } from '@sdk5/shared/types';
import { prefixedMoneyAmount } from '@sdk5/shared/utils';
import { AppSelect, AppTabLinks } from '@sdk5/ui-kit-front-office';
import { computed, ref, watch } from 'vue';
import { RouterView } from 'vue-router';

import { UserCoins } from '../../../../store/modules';
import FrequentlyUsedActivities from '../../components/frequently-used-activities.vue';
import { ACCOUNTS_ROUTE, SUMMARY_ROUTE, TRANSACTIONS_ROUTE } from '../../routes/TOTAL_BALANCE_CHILDREN';

interface IRouterView {
  updateData?: Function;
}

const tabs: IRouteConfig[] = [ACCOUNTS_ROUTE, TRANSACTIONS_ROUTE, SUMMARY_ROUTE];

const profileModule = useGetVuexModule(Profile);
const userCoinsModule = useGetVuexModule(UserCoins);

const { mappedCoins, isFetching: isWalletsFetching, refetch: refreshCoins } = useGetWalletsApi();

const routerViewNode = ref(null as unknown as InstanceType<typeof RouterView> & IRouterView);
const isLoading = ref(false);
const currentWallet = ref(null as ICoin | null);

const personName = computed(() => profileModule.personName);
const isLoaderVisible = computed(() => isWalletsFetching.value || isLoading.value);
const coinList = computed<ICoin[]>(() => {
  return mappedCoins.value.reduce((acc: ICoin[], coin: ICoin) => {
    const { id, code: currency } = coin?.currency;
    const isCurrencyExist = acc.find((item) => item?.currency?.code === currency && item?.currency?.id === id);

    return isCurrencyExist ? acc : [...acc, coin];
  }, []);
});
const selectedWallet = computed({
  get() {
    return (currentWallet.value || coinList.value[0]) as ICoin;
  },
  set(value: ICoin) {
    currentWallet.value = value;
  },
});
const selectedCurrency = computed(() => selectedWallet.value?.currency?.id || coinList.value[0]?.currency?.id);
const prefixedTotalBalance = computed(() => prefixedMoneyAmount(userCoinsModule.totalBalance, selectedWallet.value?.currency.symbol));

const updateData = async () => {
  await refreshCoins();

  if (routerViewNode.value.updateData) {
    await routerViewNode.value.updateData();
  }
};

const fetchCoinsDetails = async (currencyId: string) => {
  isLoading.value = true;
  await userCoinsModule.fetchCoinDetails(currencyId);
  isLoading.value = false;
};

watch(
  selectedCurrency,
  async (currency) => {
    if (!currency) {
      return;
    }

    fetchCoinsDetails(currency);
  },
  { immediate: true },
);
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

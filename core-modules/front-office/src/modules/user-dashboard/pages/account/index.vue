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
      :coin-list="coinsList" />
    <app-tab-links
      :tabs="tabs"
      secondary />
    <router-view
      ref="routerViewNode"
      :account="currentAccount"
      @updated-settings="fetchAccounts" />
  </div>
</template>

<script setup lang="ts">
import { useGetWalletsApi } from '@sdk5/shared';
import type { ICoin, ICurrencyShort } from '@sdk5/shared/requests';
import { AppTabLinks } from '@sdk5/ui-kit-front-office';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import FrequentlyUsedActivities from '../../components/frequently-used-activities.vue';
import { ACCOUNT_CHILDREN } from '../../routes/ACCOUNT_CHILDREN';

interface IRouterView {
  updateData?: Function;
}

const tabs = ACCOUNT_CHILDREN;

const route = useRoute();

const { mappedCoins: coinsList, refetch: fetchAccounts } = useGetWalletsApi();

const routerViewNode = ref(null as IRouterView | null);
const isLoading = ref(false);

const serial = computed(() => route.params.serial || '');
const currentAccount = computed(() => coinsList.value.find((coin: ICoin) => coin.serial === serial.value) || ({} as ICoin));
const currentCurrency = computed(() => currentAccount.value?.currency || ({} as ICurrencyShort));
</script>

<style lang="scss">
.account-details {
  &__title {
    @apply text-primary text-40 mb-24;

    &-amount {
      @apply text-primary text-40;
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

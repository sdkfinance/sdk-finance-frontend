<template>
  <payment-operations-layout
    v-loading="isLoaderVisible"
    class="gold-rates-page">
    <template #title>
      {{ $t('pages.user_dashboard.currency_rates.gold_rates') }}
    </template>
    <div class="gold-rates-page-content">
      <app-switch
        v-model="switchValue"
        left-label="form.label.grams"
        right-label="form.label.ounces"
        is-dynamic-label-color />
      <gold-rates-table :table-data="ratesData" />
    </div>
  </payment-operations-layout>
</template>

<script setup lang="ts">
import { useGetCurrenciesApi, useViewExchangeRatesApi } from '@sdk5/shared/composables';
import type { IExchangeRatesViewBody, TExchangeRatePair } from '@sdk5/shared/requests';
import { AppSwitch } from '@sdk5/ui-kit-front-office';
import { computed, ref } from 'vue';

import PaymentOperationsLayout from '../../user-dashboard/layouts/payment-operations-layout.vue';
import GoldRatesTable from '../components/gold-rates-table.vue';
import { useExchangeRates } from '../composables/useExchangeRates';

const switchValue = ref(false);

const CURRENCY_CODES_PAIRS: [string, string][] = [
  ['USD', 'GOLD'],
  ['EUR', 'GOLD'],
  ['BTC', 'GOLD'],
];

const { currencies, isFetching: isCurrenciesFetching } = useGetCurrenciesApi();

const currencyIdsFromPairs = computed(() => {
  const usedCurrencies = [...new Set(CURRENCY_CODES_PAIRS.flat())];
  const currencyCodesMap = new Map<string, string>();

  usedCurrencies.forEach((currency) => {
    const currencyId = currencies.value.find((c) => c.code === currency)?.id;

    if (currencyId) {
      currencyCodesMap.set(currency, currencyId);
    }
  });

  return currencyCodesMap;
});

const requestRatePairs = computed(() =>
  CURRENCY_CODES_PAIRS.map<TExchangeRatePair[]>((currencyPair) => {
    const [currencyCodeA, currencyCodeB] = currencyPair;

    if (!currencyCodeA || !currencyCodeB) {
      return [];
    }

    const currencyIdA = currencyIdsFromPairs.value.get(currencyCodeA);
    const currencyIdB = currencyIdsFromPairs.value.get(currencyCodeB);

    if (!currencyIdA || !currencyIdB) {
      return [];
    }

    return [
      {
        inCurrencyId: currencyIdA,
        outCurrencyId: currencyIdB,
      },
      {
        inCurrencyId: currencyIdB,
        outCurrencyId: currencyIdA,
      },
    ];
  }).flat(),
);
const isEnabled = computed(() => requestRatePairs.value.length > 0);
const viewExchangeRatesOptions = computed<IExchangeRatesViewBody>(() => ({
  ratePairs: requestRatePairs.value,
}));

const { exchangeRates, isFetching: isExchangeRatesFetching } = useViewExchangeRatesApi(viewExchangeRatesOptions, isEnabled);
const { ratesData } = useExchangeRates(CURRENCY_CODES_PAIRS, exchangeRates);

const isLoaderVisible = computed(() => isCurrenciesFetching.value || isExchangeRatesFetching.value);
</script>

<style lang="scss">
.gold-rates-page.payment-operations {
  @apply max-w-max;
}

.gold-rates-page-content {
  @apply flex flex-col items-center gap-y-[1rem];
}
</style>

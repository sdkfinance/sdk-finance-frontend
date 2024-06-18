import type { IExchangeRatesRecord } from '@sdk5/shared/requests';
import type { MaybeRef } from '@sdk5/shared/types';
import { isRef, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue';

import type { TGoldRatesTableData } from '../types/gold-rates-table.types';

export const useExchangeRates = (currencyPairs: MaybeRef<[string, string][]>, exchangeRatesData: MaybeRef<IExchangeRatesRecord[]>) => {
  let stopCurrencyPairWatch: () => void;
  let stopExchangeRatesWatch: () => void;

  const ratesData = ref([] as TGoldRatesTableData[]);

  const getExchangeRateData = (sellCurrency: string, buyCurrency: string, rates: IExchangeRatesRecord[]) => {
    return rates.reduce(
      (acc, rate) => {
        if (rate.inCurrency.code === buyCurrency && rate.outCurrency.code === sellCurrency) {
          acc.buyRate = rate.rate;
        }

        if (rate.inCurrency.code === sellCurrency && rate.outCurrency.code === buyCurrency) {
          acc.sellRate = rate.rate;
        }

        return acc;
      },
      { buyRate: null, sellRate: null } as Pick<TGoldRatesTableData, 'buyRate' | 'sellRate'>,
    );
  };

  const combineExchangeRatesData = (pairs: [string, string][], ratesRecords: IExchangeRatesRecord[]) => {
    ratesData.value = [];

    if (ratesRecords.length === 0) {
      return;
    }

    pairs.forEach((pair) => {
      const [sellCurrency, buyCurrency] = pair;
      const inCurrency = ratesRecords.find((rate) => rate.inCurrency.code === sellCurrency)?.inCurrency;
      const outCurrency = ratesRecords.find((rate) => rate.outCurrency.code === buyCurrency)?.outCurrency;

      if (inCurrency && outCurrency) {
        const { buyRate, sellRate } = getExchangeRateData(sellCurrency, buyCurrency, ratesRecords);
        ratesData.value.push({
          inCurrency,
          outCurrency,
          buyRate,
          sellRate,
        });
      }
    });
  };

  if (isRef(currencyPairs)) {
    stopCurrencyPairWatch = watch(currencyPairs, (_currencyPairs) => {
      combineExchangeRatesData(_currencyPairs, unref(exchangeRatesData));
    });
  }

  if (isRef(exchangeRatesData)) {
    stopExchangeRatesWatch = watch(exchangeRatesData, (_exchangeRatesData) => {
      combineExchangeRatesData(unref(currencyPairs), _exchangeRatesData);
    });
  }

  onMounted(() => {
    combineExchangeRatesData(unref(currencyPairs), unref(exchangeRatesData));
  });

  onBeforeUnmount(() => {
    stopCurrencyPairWatch?.();
    stopExchangeRatesWatch?.();
  });

  return {
    ratesData,
  };
};

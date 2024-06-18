import { useQuery } from '@tanstack/vue-query';
import type { MaybeRef } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, unref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { IExchangeRatesViewBody } from '../../requests';
import { ExchangeRatesRequests } from '../../requests';
import { errorNotification } from '../../utils';

export const useViewExchangeRatesApi = (payload: MaybeRef<IExchangeRatesViewBody>, enabled?: Ref<boolean>) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.viewExchangeRates, payload],
    queryFn: () => {
      return ExchangeRatesRequests.getRate(unref(payload));
    },
    enabled,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });

  const exchangeRates = computed(() => query.data?.value ?? []);

  return {
    ...query,
    exchangeRates,
  };
};

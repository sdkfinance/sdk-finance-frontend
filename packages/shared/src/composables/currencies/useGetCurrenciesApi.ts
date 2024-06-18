import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { ICurrency } from '../../requests/currencies';
import { CurrencyRequests } from '../../requests/currencies';
import { errorNotification } from '../../utils';

export const useGetCurrenciesApi = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.getCurrencies],
    queryFn: CurrencyRequests.getCurrencies,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });

  const currencies = computed(() => query.data?.value ?? []);

  const currencyListWithDisplayName = computed<(ICurrency & { displayName: string })[]>(() =>
    (query.data.value ?? []).map((currency) => ({
      ...currency,
      displayName: `${currency.name}(${currency.code})`,
    })),
  );

  return {
    ...query,
    currencyListWithDisplayName,
    currencies,
  };
};

import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { refDefault } from '@vueuse/core';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { ICurrency } from '../../requests/currencies';
import { CurrencyRequests } from '../../requests/currencies';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TUserGetCurrenciesApi = TCommonUseApiOptions & { enabled?: MaybeRef<boolean> };

export const useGetCurrenciesApi = (options: TUserGetCurrenciesApi = {}) => {
  const { showErrorNotification, enabled } = options;

  const enabledOptionRef = isRef(enabled) ? enabled : ref(enabled);
  const enabledOptionRefWithDefault = refDefault(enabledOptionRef, true);

  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.getCurrencies];

  const query = useQuery({
    queryKey,
    enabled: enabledOptionRefWithDefault,
    queryFn: CurrencyRequests.getCurrencies,
    refetchOnWindowFocus: false,
    select: ({ error, response }) => {
      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });

  const currencies = computed(() => query.data?.value ?? []);
  const currencyListWithDisplayName = computed<(ICurrency & { displayName: string })[]>(() =>
    (query.data.value ?? []).map((currency) => ({
      ...currency,
      displayName: `${currency.name} (${currency.code})`,
    })),
  );

  const invalidateQuery = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    currencyListWithDisplayName,
    currencies,
    invalidateQuery,
  };
};

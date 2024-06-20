import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { WalletsRequests } from '../../requests/coins';
import type { ICommonUseQueryOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TUseGetWalletsApiQueryOptions = ICommonUseQueryOptions;

export const useGetWalletsApi = (options: TUseGetWalletsApiQueryOptions = {}) => {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.getWallets];
  const query = useQuery({
    queryKey,
    queryFn: WalletsRequests.getWallets,
    enabled: options.queryEnabled,
    refetchOnWindowFocus: false,
    select: ({ error, response }) => {
      const { showErrorNotification } = options;

      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }

      return response?.coins ?? [];
    },
  });

  const coinList = computed(() => query.data?.value ?? []);
  const mappedCoins = computed(() =>
    coinList.value.map((item) => {
      const { code: currency } = item.currency;

      item.image = `/images/currencies/${currency.toLowerCase()}.svg`;

      return item;
    }),
  );

  const invalidateWalletsQuery = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    coinList,
    mappedCoins,
    invalidateWalletsQuery,
  };
};

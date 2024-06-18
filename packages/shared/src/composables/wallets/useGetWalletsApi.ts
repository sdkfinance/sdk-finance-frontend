import { useQuery } from '@tanstack/vue-query';
import type { ICoin } from 'src/requests';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { WalletsRequests } from '../../requests/coins';
import { errorNotification } from '../../utils';

export const useGetWalletsApi = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.getWallets],
    queryFn: WalletsRequests.getWallets,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
        return [];
      }

      return response.coins ?? [];
    },
  });

  const coinList = computed<ICoin[]>(() => query.data?.value ?? []);

  const mappedCoins = computed(() =>
    coinList.value.map((item) => {
      const { code: currency } = item.currency;

      item.image = `/images/currencies/${currency.toLowerCase()}.svg`;

      return item;
    }),
  );

  return {
    ...query,
    coinList,
    mappedCoins,
  };
};

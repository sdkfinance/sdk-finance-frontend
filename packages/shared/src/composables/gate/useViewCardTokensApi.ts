import { useQuery } from '@tanstack/vue-query';
import type { MaybeRef } from '@vueuse/core';
import { computed, unref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { GateRequests, type TViewCardTokensRequestPayload } from '../../requests';
import { errorNotification } from '../../utils';

export const useViewCardTokensApi = (payload: MaybeRef<TViewCardTokensRequestPayload>) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.viewCardTokens, payload],
    queryFn: () => GateRequests.viewCardTokens(unref(payload)),
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response;
    },
    refetchOnWindowFocus: false,
  });

  const cardTokenRecords = computed(() => query.data?.value?.records ?? []);

  return {
    ...query,
    cardTokenRecords,
  };
};

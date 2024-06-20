import { useQuery, useQueryClient } from '@tanstack/vue-query';
import type { MaybeRef } from '@vueuse/core';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { GateRequests, type TViewCardTokensRequestPayload } from '../../requests';
import type { TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TViewCardTokenApiOptions = TCommonUseApiOptions;

export const useViewCardTokensApi = (payload?: MaybeRef<TViewCardTokensRequestPayload | undefined>, options: TViewCardTokenApiOptions = {}) => {
  const { showErrorNotification } = options;

  const queryClient = useQueryClient();

  const payloadRef = isRef(payload) ? payload : ref(payload);

  const queryKey = computed(() => [QUERY_KEYS.viewCardTokens, payloadRef.value]);
  const isQueryEnabled = computed(() => !!payloadRef.value);

  const query = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    queryFn: () => GateRequests.viewCardTokens(payloadRef.value as TViewCardTokensRequestPayload),
    select: ({ error, response }) => {
      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
    refetchOnWindowFocus: false,
  });

  const cardTokenRecords = computed(() => query.data?.value ?? []);

  const invalidateQuery = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    cardTokenRecords,
    invalidateQuery,
  };
};

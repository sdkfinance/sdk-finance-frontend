import { useQuery } from '@tanstack/vue-query';
import { refDefault } from '@vueuse/core';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { GateProviderRequests } from '../../requests';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TUseGetGateProvidersApiOptions = TCommonUseApiOptions & {
  enabled?: MaybeRef<boolean>;
};
export const useGetGateProvidersApi = (options: TUseGetGateProvidersApiOptions = {}) => {
  const { showErrorNotification, enabled } = options;

  const enabledRef = isRef(enabled) ? enabled : refDefault(ref(enabled), true);

  const isQueryEnabled = computed(() => enabledRef.value);
  const query = useQuery({
    queryKey: [QUERY_KEYS.get_gate_providers],
    queryFn: GateProviderRequests.getProviders,
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: ({ error, response }) => {
      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });

  const gateProviders = computed(() => query.data?.value ?? []);

  return {
    gateProviders,
    ...query,
  };
};

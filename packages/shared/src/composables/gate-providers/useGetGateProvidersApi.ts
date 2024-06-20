import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { GateProviderRequests } from '../../requests';
import type { TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';

export const useGetGateProvidersApi = (options: TCommonUseApiOptions = {}) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.get_gate_providers],
    queryFn: GateProviderRequests.getProviders,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: ({ error, response }) => {
      const { showErrorNotification } = options;

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

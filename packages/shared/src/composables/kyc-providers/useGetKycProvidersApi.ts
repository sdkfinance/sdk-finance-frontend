import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { KycProvidersRequests } from '../../requests';
import type { TValueLabelRecord } from '../../types';
import { errorNotification } from '../../utils';

export const useGetKycProvidersApi = (enabled?: Ref<boolean>) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.getKycProviders],
    queryFn: KycProvidersRequests.getKycProviders,
    enabled,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });

  const kycProvidersList = computed(() => query.data?.value ?? []);

  const kycProvidersRecords = computed<TValueLabelRecord[]>(() =>
    kycProvidersList.value.map((provider) => ({ value: provider, label: `entity.kyc_providers.${provider}` })),
  );

  return {
    ...query,
    kycProvidersRecords,
    kycProvidersList,
  };
};

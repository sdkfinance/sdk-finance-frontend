import { useQuery } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import { OrganizationsRequests } from '../../requests/organizations';
import { errorNotification } from '../../utils';

export const useGetOrganizationSystemCoinsApi = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.getOrganizationSystemCoins],
    queryFn: () => {
      return OrganizationsRequests.getOrganizationSystemCoins();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.coins ?? [];
    },
  });
};

import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { ProfileRequests } from '../../requests';
import { UserDataService } from '../../services';
import type { TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';
import { useUserProfileData } from './useUserProfileData';

export type TUserGetCurrentUserProfileApi = TCommonUseApiOptions & { skipQuery?: boolean };
export const useGetCurrentUserProfileApi = (options: TUserGetCurrentUserProfileApi = {}) => {
  const { showErrorNotification, skipQuery } = options;

  const queryClient = useQueryClient();
  const queryKey = computed(() => [QUERY_KEYS.getCurrentUserProfile, UserDataService.token]);
  const isQueryEnabled = computed(() => !!UserDataService.token && !skipQuery);
  const query = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    queryFn: () => ProfileRequests.getProfile(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: ({ error, response }) => {
      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }

      return response;
    },
  });

  const invalidateCurrentUserCache = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    ...useUserProfileData(query),
    invalidateCurrentUserCache,
  };
};

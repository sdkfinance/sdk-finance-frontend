import { useMutation } from '@tanstack/vue-query';

import { ProfileRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';
import { useGetCurrentUserProfileApi } from './useGetCurrentUserProfileApi';

export type TUpdateCurrentUserAddressApiOptions = TUseMutationsApiCommonOptions;

export const useUpdateCurrentUserAddressApi = (options: TUpdateCurrentUserAddressApiOptions = {}) => {
  const { invalidateCurrentUserCache } = useGetCurrentUserProfileApi();

  return useMutation({
    mutationFn: ProfileRequests.updateMyAddress,
    onSuccess: ({ error }) => {
      const { invalidateQueriesOnSuccess, showErrorNotification, showSuccessNotification } = options;

      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
        return;
      }

      if (showSuccessNotification !== false) {
        successNotification();
      }

      if (invalidateQueriesOnSuccess !== false) {
        invalidateCurrentUserCache();
      }
    },
  });
};

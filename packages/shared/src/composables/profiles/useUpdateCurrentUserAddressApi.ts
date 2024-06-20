import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import type { TUpdateUserAddressPayload } from '../../requests';
import { ProfileRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export type TUpdateCurrentUserAddressApiOptions = TUseMutationsApiCommonOptions;

export const useUpdateCurrentUserAddressApi = (options: TUpdateCurrentUserAddressApiOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TUpdateUserAddressPayload) => ProfileRequests.updateMyAddress(payload),
    onSuccess: ({ error }) => {
      const { invalidateQueriesOnSuccess, showErrorNotification, showSuccessNotification } = options;

      if (error !== null) {
        if (showErrorNotification !== false) {
          errorNotification(error);
        }

        return;
      }

      if (showSuccessNotification !== false) {
        successNotification();
      }

      if (invalidateQueriesOnSuccess !== false) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCurrentUserProfile] });
      }
    },
  });
};

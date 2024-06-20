import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import type { IUserSecurity } from '../../requests';
import { ProfileRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export type TUpdateCurrentUserSecurityApiOptions = TUseMutationsApiCommonOptions;

export const useUpdateCurrentUserSecurityApi = (options: TUpdateCurrentUserSecurityApiOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUserSecurity) => ProfileRequests.updateMySecurity(payload),
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

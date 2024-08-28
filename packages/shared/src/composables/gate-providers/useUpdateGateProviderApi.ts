import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import { GateProviderRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export type TUseUpdateGateProviderApiOptions = TUseMutationsApiCommonOptions;

export const useUpdateGateProviderApi = (options: Partial<TUseUpdateGateProviderApiOptions> = {}) => {
  const { showErrorNotification, invalidateQueriesOnSuccess, successMessage, showSuccessNotification } = options;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GateProviderRequests.updateGateProvider,
    onSuccess: ({ error, response }) => {
      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);

        return;
      }

      if (showSuccessNotification !== false) {
        successNotification(successMessage);
      }

      if (invalidateQueriesOnSuccess !== false) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_vendor_by_id, response?.id] });
      }
    },
  });
};

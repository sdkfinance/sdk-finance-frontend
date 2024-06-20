import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import { GateProviderRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export interface IUseUpdateGateProviderApiOptions extends TUseMutationsApiCommonOptions {
  successMessage: string;
}

export const useUpdateGateProviderApi = (options: Partial<IUseUpdateGateProviderApiOptions> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GateProviderRequests.updateGateProvider,
    onSuccess: ({ error, response }) => {
      const { showErrorNotification, showSuccessNotification, invalidateQueriesOnSuccess, successMessage } = options;

      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);

        return;
      }

      if (showSuccessNotification !== false) {
        successNotification(successMessage);
      }

      if (invalidateQueriesOnSuccess !== false) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_gate_providers] });
      }
    },
  });
};

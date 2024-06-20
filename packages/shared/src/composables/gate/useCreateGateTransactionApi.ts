import { useMutation } from '@tanstack/vue-query';

import { GateRequests } from '../../requests/gate';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TCreateGateTransactionApiOptions = TUseMutationsApiCommonOptions;

export const useCreateGateTransactionApi = (options: TCreateGateTransactionApiOptions = {}) => {
  return useMutation({
    mutationFn: GateRequests.createTransaction,
    onSuccess: ({ error, response }) => {
      const { showErrorNotification } = options;

      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }
    },
  });
};

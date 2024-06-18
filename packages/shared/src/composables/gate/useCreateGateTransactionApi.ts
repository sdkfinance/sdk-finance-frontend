import { useMutation } from '@tanstack/vue-query';

import { GateRequests } from '../../requests/gate';
import { errorNotification } from '../../utils';

export const useCreateGateTransactionApi = () => {
  return useMutation({
    mutationFn: GateRequests.createTransaction,
    onSuccess: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }
    },
  });
};

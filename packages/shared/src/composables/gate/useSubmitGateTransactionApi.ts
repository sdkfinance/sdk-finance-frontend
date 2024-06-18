import { useMutation } from '@tanstack/vue-query';

import type { IGateSubmitPayerBody } from '../../requests/gate';
import { GateRequests } from '../../requests/gate';
import { errorNotification } from '../../utils';

export const useSubmitGateTransactionApi = () => {
  return useMutation({
    mutationFn: (payload: IGateSubmitPayerBody & { txId: string }) => {
      const { txId, ...requestPayload } = payload;
      return GateRequests.submitPayer(txId, requestPayload);
    },
    onSuccess: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
        return;
      }

      if (response.transaction.errorCode) {
        errorNotification(response.transaction.errorCode);
      }
    },
  });
};

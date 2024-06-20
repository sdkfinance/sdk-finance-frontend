import { useMutation } from '@tanstack/vue-query';

import type { IGateSubmitPayerBody } from '../../requests/gate';
import { GateRequests } from '../../requests/gate';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TSubmitGateTransactionApiOptions = TUseMutationsApiCommonOptions;

export const useSubmitGateTransactionApi = (options: TSubmitGateTransactionApiOptions = {}) => {
  return useMutation({
    mutationFn: (payload: IGateSubmitPayerBody & { txId: string }) => {
      const { txId, ...requestPayload } = payload;
      return GateRequests.submitPayer(txId, requestPayload);
    },
    onSuccess: ({ error, response }) => {
      const { showErrorNotification } = options;

      if ((error !== null || !response.transaction || response.transaction.errorCode) && showErrorNotification !== false) {
        errorNotification(error || response.transaction?.errorCode || 'notification.error');
      }
    },
  });
};

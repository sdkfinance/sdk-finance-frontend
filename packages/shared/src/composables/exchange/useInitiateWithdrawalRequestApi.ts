import { useMutation } from '@tanstack/vue-query';

import { ExchangeRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useInitiateWithdrawalRequestApi = () => {
  return useMutation({
    mutationFn: ExchangeRequests.initiateWithdrawRequest,
    onSuccess: ({ error }) => {
      if (error !== null) {
        errorNotification(error);
        return;
      }

      successNotification('notification.withdrawal_request_initiated');
    },
  });
};

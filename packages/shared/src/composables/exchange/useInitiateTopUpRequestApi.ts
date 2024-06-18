import { useMutation } from '@tanstack/vue-query';

import { ExchangeRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useInitiateTopUpRequestApi = () => {
  return useMutation({
    mutationFn: ExchangeRequests.initiateTopUpRequest,
    onSuccess: ({ error }) => {
      if (error !== null) {
        errorNotification(error);
        return;
      }

      successNotification('notification.top_up_request_initiated');
    },
  });
};

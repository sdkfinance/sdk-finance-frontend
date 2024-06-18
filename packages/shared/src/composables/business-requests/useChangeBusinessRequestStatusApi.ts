import { useMutation } from '@tanstack/vue-query';

import { BusinessRequestsManagementRequests } from '../../requests/business-requests';
import { errorNotification, successNotification } from '../../utils';

export const useChangeBusinessRequestStatusApi = () => {
  return useMutation({
    mutationFn: BusinessRequestsManagementRequests.changeBusinessRequestStatus,
    onSettled: (data, _, payload) => {
      if (!data) {
        return;
      }

      const { error } = data;

      if (error !== null) {
        errorNotification(error);
        return;
      }

      successNotification(`notification.${payload.type === 'approve' ? 'transaction_approved' : 'transaction_declined'}`);
    },
  });
};

import { useMutation } from '@tanstack/vue-query';

import type { TChangeBusinessRequestStatusPayload } from '../../requests/business-requests';
import { BusinessRequestsManagementRequests } from '../../requests/business-requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export type TUseChangeBusinessRequestStatusApiOptions = Pick<
  TUseMutationsApiCommonOptions,
  'successMessage' | 'showSuccessNotification' | 'showErrorNotification'
>;

export const useChangeBusinessRequestStatusApi = (options: TUseChangeBusinessRequestStatusApiOptions = {}) => {
  const { showErrorNotification, showSuccessNotification, successMessage } = options;

  return useMutation({
    mutationFn: BusinessRequestsManagementRequests.changeBusinessRequestStatus,
    onSettled: (data, _, payload) => {
      if (!data) {
        return;
      }

      const { error } = data;

      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
        return;
      }

      if (showSuccessNotification !== false) {
        const notificationMessages: Record<TChangeBusinessRequestStatusPayload['type'], string> = {
          approve: 'notification.business_request_accepted',
          decline: 'notification.business_request_declined',
          reject: 'notification.business_request_rejected',
          repeat: 'notification.success',
        };
        successNotification(successMessage ?? notificationMessages[payload.type]);
      }
    },
  });
};

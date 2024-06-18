import { useMutation } from '@tanstack/vue-query';

import type { TChangeUserIdentificationStatusRequestPayload } from '../../requests';
import { ProfileRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useUpdateUserIdentificationStatusApi = () => {
  return useMutation({
    mutationFn: (payload: TChangeUserIdentificationStatusRequestPayload & { userId: string }) => {
      const { userId, ...requestPayload } = payload;
      return ProfileRequests.changeUserIdentificationStatus(userId, requestPayload);
    },
    onSuccess: ({ error }) => {
      if (error !== null) {
        errorNotification(error);
        return;
      }

      successNotification();
    },
  });
};

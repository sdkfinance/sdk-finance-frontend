import { useMutation } from '@tanstack/vue-query';

import type { IUserBusiness } from '../../requests';
import { UserInfoRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useUpdateUserBusinessApi = () => {
  return useMutation({
    mutationFn: (payload: IUserBusiness & { userId: string }) => {
      const { userId, ...requestPayload } = payload;
      return UserInfoRequests.updateUserBusiness(userId, requestPayload);
    },
    onSuccess: ({ error, response }, { userId }) => {
      if (error !== null) {
        errorNotification(error);
        return;
      }

      successNotification();
    },
  });
};

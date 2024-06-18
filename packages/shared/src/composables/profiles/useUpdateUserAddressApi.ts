import { useMutation } from '@tanstack/vue-query';

import type { IUserAddress } from '../../requests';
import { UserInfoRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useUpdateUserAddressApi = () => {
  return useMutation({
    mutationFn: (payload: IUserAddress & { userId: string }) => {
      const { userId, ...requestPayload } = payload;
      return UserInfoRequests.updateUserAddress(userId, requestPayload);
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

import { useMutation } from '@tanstack/vue-query';

import type { IUserInfo } from '../../requests';
import { UserInfoRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useUpdateUserProfileInfoApi = () => {
  return useMutation({
    mutationFn: (payload: IUserInfo & { userId: string }) => {
      const { userId, ...updatePayload } = payload;
      return UserInfoRequests.updateUserProfileInfo(userId, updatePayload);
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

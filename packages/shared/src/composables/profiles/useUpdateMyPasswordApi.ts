import { useMutation } from '@tanstack/vue-query';

import type { IUserPassword } from '../../requests';
import { ProfileRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useUpdateMyPasswordApi = () => {
  return useMutation({
    mutationFn: (payload: IUserPassword) => {
      return ProfileRequests.updateMyPassword(payload);
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

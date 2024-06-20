import { useMutation } from '@tanstack/vue-query';

import type { TUpdateProfileAdditionalPayload } from '../../requests';
import { ProfileRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export type TUseUpdateCurrentProfileAdditionalApiOptions = Pick<TUseMutationsApiCommonOptions, 'showErrorNotification' | 'showSuccessNotification'>;

export const useUpdateCurrentProfileAdditionalApi = (options: TUseUpdateCurrentProfileAdditionalApiOptions = {}) => {
  return useMutation({
    mutationFn: (payload: TUpdateProfileAdditionalPayload) => {
      return ProfileRequests.updateMyProfileAdditional(payload);
    },
    onSuccess: ({ error }) => {
      const { showErrorNotification, showSuccessNotification } = options;

      if (error !== null) {
        if (showErrorNotification !== false) {
          errorNotification(error);
        }

        return;
      }

      if (showSuccessNotification !== false) {
        successNotification();
      }
    },
  });
};

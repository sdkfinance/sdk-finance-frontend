import { useMutation } from '@tanstack/vue-query';

import { WalletsRequests } from '../../requests/coins';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification, successNotification } from '../../utils';

export type TUseCreateWalletApiOptions = TUseMutationsApiCommonOptions;

export const useCreateWalletApi = (options: TUseCreateWalletApiOptions = {}) => {
  return useMutation({
    mutationFn: WalletsRequests.createWallet,
    onSuccess: ({ error }) => {
      const { showErrorNotification } = options;

      if (error !== null) {
        if (showErrorNotification !== false) {
          errorNotification(error);
        }

        return;
      }

      successNotification();
    },
  });
};

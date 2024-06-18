import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import { WalletsRequests } from '../../requests/coins';
import { errorNotification, successNotification } from '../../utils';

export const useCreateWalletApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WalletsRequests.createWallet,
    onSuccess: ({ error }) => {
      if (error !== null) {
        errorNotification(error);
        return;
      }

      successNotification();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getWallets] });
    },
  });
};

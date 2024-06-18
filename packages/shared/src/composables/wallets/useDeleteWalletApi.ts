import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { QUERY_KEYS } from '../../constants';
import { WalletsRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useDeleteWalletApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: WalletsRequests.deleteWallet,
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

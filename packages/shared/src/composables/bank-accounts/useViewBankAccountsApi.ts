import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { IViewBankAccountsPayload } from '../../requests';
import { BankAccountsRequests } from '../../requests';
import { errorNotification } from '../../utils';

export const useViewBankAccountsApi = (payload: Ref<Partial<IViewBankAccountsPayload>>) => {
  return useQuery({
    queryFn: () => {
      return BankAccountsRequests.viewBankAccounts(payload.value);
    },
    queryKey: [QUERY_KEYS.viewBankAccounts, payload],
    select: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });
};

import { useMutation } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { readonly, ref } from 'vue';

import type { IPaymentProviderRecord } from '../../requests/gate';
import { GateRequests } from '../../requests/gate';
import { errorNotification } from '../../utils';

export const useViewGateMethodsApi = () => {
  const gateMethods = ref([] as IPaymentProviderRecord[]);

  const mutation = useMutation({
    mutationFn: GateRequests.getMethods,
    onSuccess: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      gateMethods.value = response?.records ?? [];
    },
  });

  return {
    ...mutation,
    gateMethods: readonly(gateMethods) as Readonly<Ref<IPaymentProviderRecord[]>>,
  };
};

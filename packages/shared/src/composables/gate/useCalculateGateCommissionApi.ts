import { useMutation } from '@tanstack/vue-query';
import { useDebounceFn } from '@vueuse/core';
import type { Ref } from 'vue';
import { readonly, ref } from 'vue';

import type { ICalculateCommissionRecord } from '../../requests/gate';
import { GateRequests } from '../../requests/gate';
import { errorNotification } from '../../utils';

export const useCalculateGateCommissionApi = (debounceDelay = 500) => {
  const calculatedCommission = ref(null as ICalculateCommissionRecord | null);

  const mutation = useMutation({
    mutationFn: GateRequests.calculateCommission,
    onSuccess: ({ error, response }) => {
      if (error !== null) {
        errorNotification(error);
      }

      calculatedCommission.value = response;
    },
  });

  const calculateCommissionDebounced = useDebounceFn(mutation.mutateAsync, debounceDelay);
  const clearCalculatedCommission = () => {
    calculatedCommission.value = null;
  };

  return {
    ...mutation,
    calculateCommissionDebounced,
    clearCalculatedCommission,
    calculatedCommission: readonly(calculatedCommission) as Readonly<Ref<ICalculateCommissionRecord | null>>,
  };
};

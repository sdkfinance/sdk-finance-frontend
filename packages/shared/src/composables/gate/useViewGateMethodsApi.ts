import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import type { IPaymentProviderBody } from '../../requests/gate';
import { GateRequests } from '../../requests/gate';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TUseViewGateMethodsApiOptions = TCommonUseApiOptions;

export const useViewGateMethodsApi = (payload?: MaybeRef<IPaymentProviderBody | undefined>, options: TUseViewGateMethodsApiOptions = {}) => {
  const queryClient = useQueryClient();

  const payloadRef = isRef(payload) ? payload : ref(payload);
  const isQueryEnabled = computed(() => !!payloadRef.value);
  const queryKey = computed(() => [QUERY_KEYS.view_gate_methods, payloadRef.value]);

  const query = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => GateRequests.getMethods(payloadRef.value as IPaymentProviderBody),
    select: ({ error, response }) => {
      const { showErrorNotification } = options;

      if (error !== null && showErrorNotification !== false) {
        errorNotification(error);
      }

      return response?.records ?? [];
    },
  });

  const gateMethods = computed(() => query.data?.value ?? []);
  const gateMethodsMapped = computed(() =>
    gateMethods.value.map((method) => {
      if (method.gateProvider.id === 'Corefy') {
        return {
          ...method,
          gateProvider: {
            ...method.gateProvider,
            name: 'Payment gateway',
          },
        };
      }

      return {
        ...method,
      };
    }),
  );
  const activeGateMethods = computed(() => gateMethodsMapped.value.filter((gateMethod) => gateMethod.gateProvider.active));

  const invalidateQuery = () => {
    return queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    gateMethods: gateMethodsMapped,
    activeGateMethods,
    invalidateQuery,
  };
};

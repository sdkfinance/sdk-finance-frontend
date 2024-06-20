import { useMutation } from '@tanstack/vue-query';

import type { TPaymentWay } from '../../requests';
import { GateRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification } from '../../utils';

export type TCreateCardTokenApiOptions = TUseMutationsApiCommonOptions;

export const useCreateCardTokenApi = (options: TCreateCardTokenApiOptions = {}) => {
  return useMutation({
    mutationFn: (payload: { walletSerial: string; currencyCode: string; gateProviderId: string; way: TPaymentWay; testMode?: boolean }) => {
      if (!payload.walletSerial || !payload.currencyCode || !payload.gateProviderId || !payload.way) {
        throw new Error('Not all parameters are provided');
      }

      const { currencyCode, walletSerial, gateProviderId, way, testMode = true } = payload;

      const paymentServiceNamesByCurrencyCode: Record<string, string> = {
        USD: 'payment_card_usd_hpp',
        EUR: 'payment_card_eur_hpp',
      };

      const paymentServiceName = paymentServiceNamesByCurrencyCode[currencyCode];

      if (!paymentServiceName) {
        throw new Error(`Payment service name for currency code ${currencyCode} not found`);
      }

      return GateRequests.initTokenization({
        coin: walletSerial,
        method: { gateProviderId, way },
        fields: {
          service: paymentServiceName,
          testMode,
        },
      });
    },
    onSuccess: ({ error, response }) => {
      const { showErrorNotification } = options;

      if ((error !== null || !response.transaction || response.transaction.errorCode) && showErrorNotification !== false) {
        errorNotification(error || response.transaction?.errorCode || 'notification.error');
      }
    },
  });
};

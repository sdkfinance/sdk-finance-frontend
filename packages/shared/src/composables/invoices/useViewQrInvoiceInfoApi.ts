import { skipToken, useQuery } from '@tanstack/vue-query';
import { isRef, ref } from 'vue';

import { QUERY_KEYS } from '../../constants';
import { InvoicesRequests } from '../../requests';
import type { MaybeRef, TCommonUseApiOptions } from '../../types';
import { errorNotification } from '../../utils';

export const useViewQrInvoiceInfoApi = (invoiceIdentifier: MaybeRef<string | undefined>, options: TCommonUseApiOptions = {}) => {
  const invoiceIdentifierRef = isRef(invoiceIdentifier) ? invoiceIdentifier : ref(invoiceIdentifier);
  return useQuery({
    queryKey: [QUERY_KEYS.view_qr_invoice_info, invoiceIdentifierRef.value],
    enabled: !!invoiceIdentifierRef.value,
    queryFn: invoiceIdentifierRef.value ? () => InvoicesRequests.getQrInvoiceInfo(invoiceIdentifierRef.value as string) : skipToken,
    select: ({ error, response }) => {
      const { showErrorNotification } = options;

      if (error !== null) {
        if (showErrorNotification !== false) {
          errorNotification(error);
        }
      }

      return response;
    },
  });
};

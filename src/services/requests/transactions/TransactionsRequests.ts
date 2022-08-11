import api from '@/services/api';

import {
  IGetTransactionApiResponse,
  IGetTransactionsApiResponse,
  ITransactionsOptions,
} from '@/services/requests/transactions/Transactions.types';

export const TransactionsRequests = {

  getRecords(options: ITransactionsOptions): Promise<IGetTransactionsApiResponse> {
    return api.post('/transactions/view', options);
  },

  getRecord(transactionId: string): Promise<IGetTransactionApiResponse> {
    return api.get(`/transactions/${transactionId}`);
  },

};

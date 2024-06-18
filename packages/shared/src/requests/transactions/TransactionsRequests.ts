import apiConfig from '../../api';
import type { IGetTransactionApiResponse, IGetTransactionsApiResponse, ITransactionsOptions } from './Transactions.types';

export const TransactionsRequests = {
  getRecords(options: ITransactionsOptions): Promise<IGetTransactionsApiResponse> {
    return apiConfig.api.post('/transactions/view', options);
  },

  getRecord(transactionId: string): Promise<IGetTransactionApiResponse> {
    return apiConfig.api.get(`/transactions/${transactionId}`);
  },
};

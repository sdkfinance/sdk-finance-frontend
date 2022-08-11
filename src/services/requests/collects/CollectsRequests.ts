import api from '@/services/api';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';

export interface ICollectBody {
  amount: number;
  serial: string;
  fullName: string;
}

export const CollectsRequests = {

  create(data: ICollectBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/collects', data);
  },

};

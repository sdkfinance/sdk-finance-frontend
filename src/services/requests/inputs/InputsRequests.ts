import api from '@/services/api';
import { IInputBody } from '@/services/requests/inputs/Inputs.types';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';

export const InputsRequests = {

  create(data: IInputBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/inputs', data);
  },

};

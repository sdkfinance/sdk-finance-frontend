import api from '@/services/api';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';
import { IInputBody } from '@/services/requests/inputs/Inputs.types';

export const InputsRequests = {

  create(data: IInputBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/inputs', data);
  },

};

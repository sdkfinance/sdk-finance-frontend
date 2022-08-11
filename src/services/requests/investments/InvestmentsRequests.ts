import api from '@/services/api';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';
import { IInvestmentsBody } from '@/services/requests/investments/Investments.types';

export const InvestmentsRequests = {

  create(data: IInvestmentsBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/investments', data);
  },

};

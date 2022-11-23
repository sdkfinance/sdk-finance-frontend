import api from '@/services/api';
import { IInvestmentsBody } from '@/services/requests/investments/Investments.types';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';

export const InvestmentsRequests = {

  create(data: IInvestmentsBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/investments', data);
  },

};

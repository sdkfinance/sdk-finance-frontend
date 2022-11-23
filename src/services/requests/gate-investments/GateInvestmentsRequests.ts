import api from '@/services/api';
import { IGateInvestmentsBody } from '@/services/requests/gate-investments/GateInvestments.types';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';

export const GateInvestmentsRequests = {

  create(data: IGateInvestmentsBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/gate-investments', data);
  },

};

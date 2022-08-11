import api from '@/services/api';
import { ITransactionsSingleApiResponse } from '@/services/requests/transactions/Transactions.types';
import { IGateInvestmentsBody } from '@/services/requests/gate-investments/GateInvestments.types';

export const GateInvestmentsRequests = {

  create(data: IGateInvestmentsBody): Promise<ITransactionsSingleApiResponse> {
    return api.post('/gate-investments', data);
  },

};

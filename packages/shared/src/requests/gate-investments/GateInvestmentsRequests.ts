import apiConfigInstance from '../../api';
import type { ITransactionsSingleApiResponse } from '../transactions';
import type { IGateInvestmentsBody } from './GateInvestments.types';

export const GateInvestmentsRequests = {
  create(data: IGateInvestmentsBody): Promise<ITransactionsSingleApiResponse> {
    return apiConfigInstance.api.post('/gate-investments', data);
  },
};

import apiConfigInstance from '../../api';
import type { ITransactionsSingleApiResponse } from '../transactions';
import type { IInvestmentsBody } from './Investments.types';

export const InvestmentsRequests = {
  create(data: IInvestmentsBody): Promise<ITransactionsSingleApiResponse> {
    return apiConfigInstance.api.post('/investments', data);
  },
};

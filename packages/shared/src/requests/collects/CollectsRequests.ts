import apiConfigInstance from '../../api';
import type { ITransactionsSingleApiResponse } from '../transactions';

export interface ICollectBody {
  amount: number;
  serial: string;
  fullName: string;
}

export const CollectsRequests = {
  create(data: ICollectBody): Promise<ITransactionsSingleApiResponse> {
    return apiConfigInstance.api.post('/collects', data);
  },
};

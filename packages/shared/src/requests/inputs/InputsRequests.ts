import apiConfigInstance from '../../api';
import type { ITransactionsSingleApiResponse } from '../transactions';
import type { IInputBody } from './Inputs.types';

export const InputsRequests = {
  create(data: IInputBody): Promise<ITransactionsSingleApiResponse> {
    return apiConfigInstance.api.post('/inputs', data);
  },
};

import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type { ITransferBody, ITransferCalculateResponse, ITransfersApiResponse } from './Transfers.types';

const { api } = apiConfigInstance;
export const TransfersRequests = {
  executeTransfer(data: ITransferBody): Promise<ITransfersApiResponse> {
    return api.post('/transfers', data);
  },

  calculateCommissionFee(data: ITransferBody): Promise<IApiResponse<ITransferCalculateResponse>> {
    return api.post('/transfers/calculate', data);
  },
};

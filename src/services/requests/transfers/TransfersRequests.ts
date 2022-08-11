import api from '@/services/api';

import {
  ITransferBody,
  ITransferCalculateResponse, ITransfersApiResponse,
} from '@/services/requests/transfers/Transfers.types';
import { IApiResponse } from '@/types/interfaces';

export const TransfersRequests = {

  executeTransfer(data: ITransferBody): Promise<ITransfersApiResponse> {
    return api.post('/transfers', data);
  },

  calculateCommissionFee(data: ITransferBody): Promise<IApiResponse<ITransferCalculateResponse>> {
    return api.post('/transfers/calculate', data);
  },
};

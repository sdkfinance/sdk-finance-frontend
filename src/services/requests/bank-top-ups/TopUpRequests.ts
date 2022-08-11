import api from '@/services/api';
import { ITopUpCalculatePayload, ITopUpFilters, ITopUpRecordsApiResponse } from '@/services/requests/bank-top-ups/TopUp.types';
import { IApiResponse } from '@/types/interfaces';

export const TopUpRequests = {

  getRecords(options: ITopUpFilters): Promise<ITopUpRecordsApiResponse> {
    return api.post('/bank-top-ups/view', options);
  },

  acceptTopUp(id: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-top-ups/${id}/accept`);
  },

  declineTopUp(id: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-top-ups/${id}/decline`);
  },

  calculateTopUp(data: ITopUpCalculatePayload): Promise<IApiResponse<any>> {
    return api.post('/bank-top-ups/with-bank', data);
  },

  calculateTopUpCommission(data: ITopUpCalculatePayload): Promise<IApiResponse<any>> {
    return api.post('bank-top-ups/calculate', data);
  },

};

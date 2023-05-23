import api from '@/services/api';
import {
  ITopUpCalculatePayload,
  ITopUpRecordsApiResponse,
  ITopUpRequest,
  ITopUpViaBankRequestPayload,
} from '@/services/requests/bank-top-ups/TopUp.types';
import { IApiResponse } from '@/types/interfaces';

export const TopUpRequests = {

  getRecords(options: ITopUpRequest): Promise<ITopUpRecordsApiResponse> {
    return api.post('/bank-top-ups/view', options);
  },

  acceptTopUp(id: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-top-ups/${id}/accept`);
  },

  declineTopUp(id: string): Promise<IApiResponse<any>> {
    return api.post(`/bank-top-ups/${id}/decline`);
  },

  performTopUp(data: ITopUpCalculatePayload): Promise<IApiResponse<any>> {
    return api.post('/bank-top-ups', data);
  },

  calculateTopUpCommission(data: ITopUpCalculatePayload): Promise<IApiResponse<any>> {
    return api.post('/bank-top-ups/calculate', data);
  },

  createTopUpRequestViaBank(data: ITopUpViaBankRequestPayload): Promise<IApiResponse<any>> {
    return api.post('/bank-top-ups/create-request', data);
  },

};

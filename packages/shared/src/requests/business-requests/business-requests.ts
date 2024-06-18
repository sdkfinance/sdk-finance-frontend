import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type {
  TChangeBusinessRequestStatusPayload,
  TChangeBusinessRequestStatusResponse,
  TViewBusinessRequestPayload,
  TViewBusinessRequestsResponse,
} from './business-requests.types';

export const BusinessRequestsManagementRequests = {
  viewBusinessRequests(payload: TViewBusinessRequestPayload): Promise<IApiResponse<TViewBusinessRequestsResponse>> {
    return api.post('/business-requests/view', payload);
  },
  changeBusinessRequestStatus(payload: TChangeBusinessRequestStatusPayload): Promise<IApiResponse<TChangeBusinessRequestStatusResponse>> {
    const { requestIdentifier, type } = payload;
    return api.post(`/business-requests/${requestIdentifier}/${type}`);
  },
};

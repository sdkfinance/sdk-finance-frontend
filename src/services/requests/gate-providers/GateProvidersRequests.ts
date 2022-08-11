import api from '@/services/api';
import { IApiResponse } from '@/types/interfaces';
import { IGateSettingResponse, IAccountSettingRequest } from '@/services/requests/gate-providers/GateProviders.types';

export const GateProviderRequests = {

  getProviders(): Promise<IApiResponse<IGateSettingResponse>> {
    return api.get('/gate-providers');
  },

  getProvidersSettings(providerAccountId: string): Promise<IApiResponse<IAccountSettingRequest>> {
    return api.get(`/gate-providers/${providerAccountId}/settings`);
  },

  updateProviderSettings(providerAccountId: string, options: IAccountSettingRequest): Promise<IApiResponse<any>> {
    return api.patch(`/gate-providers/${providerAccountId}/settings`, options);
  },
};

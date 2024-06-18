import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type { IAccountSettingRequest, ICustomProviderResponse, IGateSettingResponse, IViewGateResponse } from './GateProviders.types';

const { api } = apiConfigInstance;
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

  createCustomProvider(customProviderName: string): Promise<IApiResponse<ICustomProviderResponse>> {
    return api.post('/gate-providers', {
      vendorName: customProviderName,
      debtAllowed: true,
    });
  },

  updateCustomProvider(customGateProviderId: string, updatedCustomProviderName: string): Promise<IApiResponse<ICustomProviderResponse>> {
    return api.patch(`/gate-providers/${customGateProviderId}`, {
      vendorName: updatedCustomProviderName,
      debtAllowed: true,
    });
  },

  deleteCustomProvider(customGateProviderId: string) {
    return api.delete(`/gate-providers/custom/${customGateProviderId}`);
  },

  linkCustomProvider(gateProviderId: string, gateId: string): Promise<IApiResponse<ICustomProviderResponse>> {
    return api.patch(`/gate-providers/${gateProviderId}/link`, {
      gateId,
    });
  },

  viewGateProviders(): Promise<IApiResponse<IViewGateResponse>> {
    return api.get('/gate/view');
  },
};

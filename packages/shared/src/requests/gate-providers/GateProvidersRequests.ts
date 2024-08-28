import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IAccountSettingRequest,
  ICreateGateProviderPayload,
  ICustomProviderResponse,
  IGateProvidersOptions,
  IGateSettingResponse,
  IUpdateGateProviderPayload,
  IViewGateResponse,
  TViewVendorsApiResponse,
} from './GateProviders.types';

export const GateProviderRequests = {
  getProviders(): Promise<IApiResponse<IGateSettingResponse>> {
    return api.get('/gate-providers');
  },

  fetchGateProviders(options: IGateProvidersOptions): Promise<TViewVendorsApiResponse> {
    return api.post('/gate-providers/view', options);
  },

  getProvidersSettings(providerAccountId: string): Promise<IApiResponse<IAccountSettingRequest>> {
    return api.get(`/gate-providers/${providerAccountId}/settings`);
  },

  updateProviderSettings(providerAccountId: string, options: IAccountSettingRequest): Promise<IApiResponse<any>> {
    return api.patch(`/gate-providers/${providerAccountId}/settings`, options);
  },

  createCustomProvider(payload: ICreateGateProviderPayload): Promise<IApiResponse<ICustomProviderResponse>> {
    return api.post('/gate-providers', payload);
  },

  updateGateProvider(payload: IUpdateGateProviderPayload): Promise<IApiResponse<ICustomProviderResponse>> {
    const { gateProviderId, ...updatePayload } = payload;
    return api.patch(`/gate-providers/${gateProviderId}`, updatePayload);
  },

  deleteCustomProvider(customGateProviderId: string) {
    return api.delete(`/gate-providers/custom/${customGateProviderId}`);
  },

  linkCustomProvider(gateProviderId: string, gateId: string): Promise<IApiResponse<ICustomProviderResponse>> {
    return api.patch(`/gate-providers/${gateProviderId}/link`, {
      gateId,
    });
  },

  viewGates(): Promise<IApiResponse<IViewGateResponse>> {
    return api.get('/gate/view');
  },
};

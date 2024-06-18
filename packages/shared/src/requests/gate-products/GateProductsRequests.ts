import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type { TGetGateProviderCoinsResponse, TGetGateProviderProductsResponse } from './GateProducts.types';

const { api } = apiConfigInstance;
export const GateProductsRequests = {
  getGateProviderProducts(gateProviderId: string): Promise<IApiResponse<TGetGateProviderProductsResponse>> {
    return api.get(`/gate/products/gate-provider/${gateProviderId}/view`);
  },
  getAvailableProviderProducts(gateProviderId: string): Promise<IApiResponse<TGetGateProviderProductsResponse>> {
    return api.get(`/gate/products/gate-provider/${gateProviderId}/available`);
  },
  getGateProviderCoins(gateProviderId: string): Promise<IApiResponse<TGetGateProviderCoinsResponse>> {
    return api.get(`/gate-provider/${gateProviderId}/coins`);
  },
};

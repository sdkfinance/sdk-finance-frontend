import { api } from '../../api';
import type { IGetCoinApiResponse, TGetProviderCoinsApiResponse } from './Coin.types';
import type { IGetOrganizationsApiResponse, IGetOrganizationsOptions } from './Organizations.types';

export const OrganizationsRequests = {
  getOrganizations(data: IGetOrganizationsOptions): Promise<IGetOrganizationsApiResponse> {
    return api.post('/organizations', data);
  },

  getProviderCoins(id: string): Promise<TGetProviderCoinsApiResponse> {
    return api.get(`/organizations/${id}/provider-coins`);
  },

  getCoins(id: string): Promise<IGetCoinApiResponse> {
    return api.get(`/organizations/${id}/coins`);
  },
  getOrganizationSystemCoins(): Promise<IGetCoinApiResponse> {
    return api.get('/organizations/system/coins');
  },
  getOrganizationSystemCoinDetails(organizationId: string, coinSerial: string) {
    return api.get(`/organizations/${organizationId}/coins/${coinSerial}`);
  },
};

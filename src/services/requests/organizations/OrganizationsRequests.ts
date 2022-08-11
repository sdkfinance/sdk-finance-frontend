import { IGetCoinApiResponse } from '@/services/requests/organizations/Coin.types';

import api from '@/services/api';
import {
  IGetOrganizationsApiResponse,
  IGetOrganizationsOptions,
} from '@/services/requests/organizations/Organizations.types';

export const OrganizationsRequests = {

  getOrganizations(data: IGetOrganizationsOptions): Promise<IGetOrganizationsApiResponse> {
    return api.post('/organizations', data);
  },

  getWallets(id: string): Promise<IGetCoinApiResponse> {
    return api.get(`/organizations/${id}/coins`);
  },

  getProviderCoins(id: string): Promise<IGetCoinApiResponse> {
    return api.get(`/organizations/${id}/provider-coins`);
  },

};

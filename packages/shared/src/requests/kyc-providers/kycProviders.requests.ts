import { api } from '../../api';
import type { TGetKycProvidersResponse } from './kycProviders.types';

export const KycProvidersRequests = {
  getKycProviders(): Promise<TGetKycProvidersResponse> {
    return api.get('/kyc-providers');
  },
};

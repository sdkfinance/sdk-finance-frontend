import api from '@/services/api';
import { IIssuer, IIssuerResponse } from '@/services/requests/issuers/Issuers.types';
import { IApiResponse } from '@/types/interfaces';

export const IssuersRequests = {

  getIssuers(): Promise<IApiResponse<IIssuerResponse>> {
    return api.get('/issuers');
  },

  create(options: IIssuer): Promise<IApiResponse<any>> {
    return api.post('/issuers', options);
  },
};

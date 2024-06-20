import type { ICreateCommissionProfilePayload } from '@sdk5/back-office/src/modules/vendors/types/vendor.types';

import apiConfigInstance from '../../api';
import type { ICommissionProfilesApiResponse } from '../contracts';

const { api } = apiConfigInstance;

export const CommissionProfilesRequests = {
  createCommissionProfile: (payload: ICreateCommissionProfilePayload) => {
    return api.post('/commission-profile', payload);
  },

  viewCommissionProfiles(payload: any): Promise<ICommissionProfilesApiResponse> {
    return api.post('/commission-profile/view', payload);
  },
};

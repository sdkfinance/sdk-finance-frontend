import { unsecureApi } from '../../api';
import type { IApiResponse } from '../../types';
import type { TFetchApiListResponse } from './actuator.types';

export const ActuatorRequests = {
  fetchApiList(): Promise<IApiResponse<TFetchApiListResponse>> {
    return unsecureApi.get('/actuator/api-list');
  },
};

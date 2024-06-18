import apiConfigInstance from '../../api';
import { UserInfoRequests } from '../profiles';
import type { IGetClientsApiResponse, IGetClientsOptions } from './index';

const { api } = apiConfigInstance;

export const ClientsRequests = {
  getRecords(data: IGetClientsOptions): Promise<IGetClientsApiResponse> {
    return api.post('/users/view', data);
  },

  getClientDetails: UserInfoRequests.getUserProfile,
};

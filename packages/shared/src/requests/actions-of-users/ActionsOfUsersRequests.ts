import apiConfigInstance from '../../api';
import type { IActionsApiResponse, IActionsOfUsersOptions, IGetActionsOfUsersApiResponse } from './ActionsOfUsers.types';

const { api } = apiConfigInstance;
export const ActionsOfUsersRequests = {
  getRecords(options: IActionsOfUsersOptions): Promise<IGetActionsOfUsersApiResponse> {
    return api.post('/users/view/actions', options);
  },

  getRecord(actionId: string): Promise<IActionsApiResponse> {
    return api.get(`/users/view/${actionId}/action-reverse`);
  },
};

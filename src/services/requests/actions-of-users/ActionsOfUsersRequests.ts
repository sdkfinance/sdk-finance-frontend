import api from '@/services/api';
import {
  IActionsApiResponse,
  IActionsOfUsersOptions,
  IGetActionsOfUsersApiResponse,
} from '@/services/requests/actions-of-users/ActionsOfUsers.types';

export const ActionsOfUsersRequests = {

  getRecords(options: IActionsOfUsersOptions): Promise<IGetActionsOfUsersApiResponse> {
    return api.post('/users/view/actions', options);
  },

  getRecord(actionId: string): Promise<IActionsApiResponse> {
    return api.get(`/users/view/${actionId}/action-reverse`);
  },

};

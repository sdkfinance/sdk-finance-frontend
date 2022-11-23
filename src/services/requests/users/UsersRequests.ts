import api from '@/services/api';
import {
  IGetUsersApiResponse,
  IGetUsersOptions,
  IUserCreateBody,
  IUserValid,
} from '@/services/requests/users/Users.types';
import { IApiResponse, IPlainObject } from '@/types/interfaces';

export const UsersRequests = {

  getUsers(data: IGetUsersOptions): Promise<IGetUsersApiResponse> {
    return api.post('/users/view', data);
  },

  create(data: IUserCreateBody): Promise<IApiResponse<IPlainObject>> {
    return api.post('/users', data);
  },

  delete(userId: string): Promise<IApiResponse<IPlainObject>> {
    return api.delete(`/users/${userId}`);
  },

  unban(userId: string): Promise<IApiResponse<IPlainObject>> {
    return api.post(`/users/${userId}/unban`);
  },

  toggleActivate(userId: string, active: boolean): Promise<IApiResponse<IPlainObject>> {
    return api.patch(`/users/${userId}`, { active });
  },

  validateContact(contact: string): Promise<IApiResponse<IUserValid>> {
    return api.post('contacts/validate', { value: contact });
  },

};

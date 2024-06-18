import { api } from '../../api';
import type { IApiResponse, IPlainObject } from '../../types';
import type {
  ICreateUserNoteBody,
  ICreateUserNoteResponse,
  IGetUsersApiResponse,
  IGetUsersOptions,
  IUserCreateBody,
  IUserValid,
  TGetUserNoteApiResponse,
  TUpdateUserPayload,
  TUpdateUserResponse,
} from './Users.types';

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

  updateUserStatus(userId: string, payload: TUpdateUserPayload): Promise<TUpdateUserResponse> {
    return api.patch(`/users/${userId}`, payload);
  },

  validateContact(contact: string): Promise<IApiResponse<IUserValid>> {
    return api.post('contacts/validate', { value: contact });
  },

  getUserNotes(userId: string): Promise<TGetUserNoteApiResponse> {
    return api.get(`/users/note/${userId}`);
  },

  createUserNotes(payload: ICreateUserNoteBody): Promise<IApiResponse<ICreateUserNoteResponse>> {
    return api.post('/users/note', payload);
  },
};

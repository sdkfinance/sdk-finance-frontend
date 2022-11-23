import api from '@/services/api';
import {
  IGetUserBankAccountApiResponse,
  IMyUserBankAccountPayload, IUserBankAccountRecord, IUserInfo,
  IUserPassword,
  IUserSecurity,
} from '@/services/requests/profiles/UserProfile.types';
import { IApiResponse } from '@/types/interfaces';

export const ProfileRequests = {

  getProfile() {
    return api.get('/profiles/my');
  },

  createMyBankAccount(accountDetails: Partial<IUserBankAccountRecord>): Promise<IApiResponse<any>> {
    return api.post('/profiles/my/bank-accounts/with-bank', accountDetails);
  },

  updateMyBankAccount(id: string, accountDetails: IMyUserBankAccountPayload): Promise<IApiResponse<any>> {
    return api.patch(`/profiles/my/bank-accounts/${id}/with-bank`, accountDetails);
  },

  updateMyLogin(login: string): Promise<IApiResponse<any>> {
    return api.post('/profiles/my/contact', { login });
  },

  confirmUpdateMyLogin(options: { login: string; otp: string }): Promise<IApiResponse<any>> {
    return api.post('/profiles/my/contact/confirm', options);
  },

  updatePersonInformation(options: { person: IUserInfo }) {
    return api.patch('/profiles/my/person', options);
  },

  updateMySecurity(security: IUserSecurity): Promise<IApiResponse<any>> {
    return api.patch('/profiles/my/security-settings', { security });
  },

  updateMyPassword(newCredentials: IUserPassword): Promise<IApiResponse<any>> {
    return api.patch('profiles/my/password', newCredentials);
  },

  getUserBankAccounts(): Promise<IGetUserBankAccountApiResponse> {
    return api.get('/profiles/my/bank-accounts');
  },

  deleteMyProfileBankAccount(id: string): Promise<IApiResponse<any>> {
    return api.delete(`/profiles/my/bank-accounts/${id}`);
  },

  declineIdentification(id: string): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${id}/decline`);
  },

  approveIdentification(id: string): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${id}/approve`);
  },

  resetIdentification(id: string): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${id}/reset`, { fields: [''] });
  },
};

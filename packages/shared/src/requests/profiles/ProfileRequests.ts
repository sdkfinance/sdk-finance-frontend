import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IGetUserBankAccountApiResponse,
  IGetUserInfoApiResponse,
  IGetUserInfoResponse,
  IMyUserBankAccountPayload,
  IResetKycStatusPayload,
  IUserBankAccountRecord,
  IUserInfo,
  IUserPassword,
  IUserSecurity,
  TChangeUserIdentificationStatusRequestPayload,
  TChangeUserIdentificationStatusResponse,
  TUpdateProfileAdditionalPayload,
  TUpdateUserAddressPayload,
} from './UserProfile.types';
import type { IProfileContactUpdatePayload } from './UserProfile.types';
import type { ISentConfirmationResponse } from './UserProfile.types';

export const ProfileRequests = {
  getProfile(): Promise<IGetUserInfoApiResponse> {
    return api.get('/profiles/my');
  },

  createMyBankAccount(accountDetails: Partial<IUserBankAccountRecord>): Promise<IApiResponse<any>> {
    return api.post('/profiles/my/bank-accounts/with-bank', accountDetails);
  },

  updateMyBankAccount(id: string, accountDetails: IMyUserBankAccountPayload): Promise<IApiResponse<any>> {
    return api.patch(`/profiles/my/bank-accounts/${id}/with-bank`, accountDetails);
  },

  updateMyContactRequest(payload: IProfileContactUpdatePayload): Promise<IApiResponse<[ISentConfirmationResponse]>> {
    return api.post('/profiles/my/contact', payload);
  },

  confirmUpdateMyContactRequest(options: { login: string; otp: string }): Promise<IApiResponse<any>> {
    return api.post('/profiles/my/contact/confirm', options);
  },

  updatePersonInformation(options: { person: IUserInfo }) {
    return api.patch('/profiles/my/person', options);
  },

  updateMySecurity(security: IUserSecurity): Promise<IGetUserInfoApiResponse> {
    return api.patch('/profiles/my/security-settings', { security });
  },

  updateMyAddress(payload: TUpdateUserAddressPayload): Promise<IGetUserInfoApiResponse> {
    return api.patch('/profiles/my/address', payload);
  },

  updateMyProfileAdditional(payload: TUpdateProfileAdditionalPayload): Promise<IGetUserInfoApiResponse> {
    return api.patch('/profiles/my/additional', payload);
  },

  updateMyPassword(newCredentials: IUserPassword): Promise<IApiResponse<any>> {
    return api.patch('profiles/my/password', newCredentials);
  },

  getUserBankAccounts(): Promise<IGetUserBankAccountApiResponse> {
    return api.get('/profiles/my/bank-accounts');
  },

  deleteMyProfileBankAccount(id: string): Promise<IApiResponse<any>> {
    return api.delete(`profiles/my/bank-accounts/${id}`);
  },

  declineIdentification(id: string, comment?: string): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${id}/decline`, {
      comment,
    });
  },

  approveIdentification(id: string): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${id}/approve`);
  },

  resetIdentification(id: string, payload: IResetKycStatusPayload = { fields: [''] }): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${id}/reset`, payload);
  },

  updateProfileContact(userId: string, payload: IProfileContactUpdatePayload): Promise<IApiResponse<IGetUserInfoResponse>> {
    return api.patch(`/profiles/${userId}/contact`, payload);
  },

  sendUserProfileToKycService(userId: string): Promise<IApiResponse<any>> {
    return api.post(`/profiles/${userId}`);
  },

  sendUserProfileToKycViaProvider(userId: string, provider: string): Promise<IApiResponse<unknown>> {
    return api.post(`/profiles/${userId}?providerKey=${provider}`);
  },

  changeUserIdentificationStatus(
    userId: string,
    payload: TChangeUserIdentificationStatusRequestPayload,
  ): Promise<TChangeUserIdentificationStatusResponse> {
    const { notify, ...requestPayload } = payload;
    return api.patch(`/profiles/${userId}?notify=${!!notify}`, requestPayload);
  },

  resetUserPassword(userId: string): Promise<IApiResponse<never>> {
    return api.post(`/profiles/${userId}/reset-password`);
  },
};

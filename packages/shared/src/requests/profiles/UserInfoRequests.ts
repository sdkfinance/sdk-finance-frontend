import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type { IGetUserInfoApiResponse, IUserBusiness, IUserInfo, IUserSecurity, TUpdateUserAddressPayload } from './UserProfile.types';

export const UserInfoRequests = {
  getUserProfile(userId: string): Promise<IGetUserInfoApiResponse> {
    return api.get(`/profiles/${userId}`);
  },

  updateUserProfileInfo(userId: string, person: IUserInfo): Promise<IApiResponse<any>> {
    return api.patch(`/profiles/${userId}/person`, { person });
  },

  updateUserAddress(userId: string, address: TUpdateUserAddressPayload): Promise<IApiResponse<any>> {
    return api.patch(`/profiles/${userId}/address`, address);
  },

  updateUserBusiness(userId: string, data: IUserBusiness): Promise<IApiResponse<any>> {
    return api.patch(`/profiles/${userId}/business`, data);
  },

  updateUserSecurity(userId: string, security: IUserSecurity): Promise<IApiResponse<any>> {
    return api.patch(`/profiles/${userId}/security-settings`, { security });
  },
};

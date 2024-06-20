import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type { IConfirmUserByOtp, ILogin, ILoginConfirm, IPasswordRecoveryConfirmBody, IRegisterUser, TAuthorizationApiResponse } from './Auth.types';

export const AuthRequests = {
  authorization(data: ILogin): Promise<TAuthorizationApiResponse> {
    return api.post('/authorization', data);
  },

  logout(): Promise<IApiResponse<unknown>> {
    return api.delete('/authorization');
  },

  authorizationConfirm(data: ILoginConfirm): Promise<TAuthorizationApiResponse> {
    return api.post('/authorization/confirm', data);
  },

  authorizationResendOtpCode(login: string) {
    return api.post('/authorization/resend-otp', { login });
  },

  passwordRecovery(login: string) {
    return api.post('/password/recovery', { login });
  },

  passwordRecoveryConfirm(data: IPasswordRecoveryConfirmBody) {
    return api.post('/password/recovery/confirm', data);
  },

  registerUser(data: IRegisterUser): Promise<IApiResponse<any>> {
    return api.post('/registration', data);
  },

  resendOtpCode(login: string): Promise<IApiResponse<any>> {
    return api.post('/registration/resend-otp', { login });
  },

  registrationConfirm(data: IConfirmUserByOtp): Promise<IApiResponse<any>> {
    return api.post('/registration/confirm', data);
  },
};

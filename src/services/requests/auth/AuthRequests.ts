import api from '@/services/api';
import {
  IConfirmUserByOtp,
  ILogin,
  ILoginConfirm,
  IPasswordRecoveryConfirmBody,
  IRegisterUser,
} from '@/services/requests/auth/Auth.types';
import { IApiResponse } from '@/types/interfaces';

export const AuthRequests = {

  authorization(data: ILogin) {
    return api.post('/authorization', data);
  },

  authorizationConfirm(data: ILoginConfirm) {
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

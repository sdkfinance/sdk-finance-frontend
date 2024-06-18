import type { TRole } from '../../constants';
import type { IApiResponse } from '../../types';
import type { TOrganizationShort } from '../organizations';
import type { TUserRecordShort } from '../users';

export interface ILogin {
  login: string;
  password: string;
}

export interface ILoginConfirm {
  login: string;
  otp: string;
}

export interface IPasswordRecoveryConfirmBody {
  login: string;
  newUserPassword: string;
  otp: string;
}

export interface IRegisterUser {
  login: string;
  role?: 'merchant' | 'individual';
  legalType?: 'corporation' | 'individual';
}

export interface IConfirmUserByOtp {
  login: string;
  otp: string;
  password: string;
}

export interface IAuthorizationToken {
  expiresAt: string;
  token: string;
}
export interface IAuthorizedMember {
  organization: TOrganizationShort;
  permissions: string[];
  role: TRole;
  token: IAuthorizationToken;
  user: TUserRecordShort;
}
export type IAuthorizationResponse = { authorizationToken: IAuthorizationToken } & (
  | {
      action: 'OTP_SENT';
    }
  | {
      action: 'TOKEN_CREATED';
      members: IAuthorizedMember[];
    }
);

export type TAuthorizationApiResponse = IApiResponse<IAuthorizationResponse>;

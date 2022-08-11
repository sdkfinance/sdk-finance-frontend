import {
  IApiResponse,
} from '@/types/interfaces';

export type TUserInfo = {
  first: string;
  last: string;
  middle?: string;
}

export interface IUserInfo {
  namePlain: TUserInfo;
  nameIntl: TUserInfo | object;
  description?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
}

export interface IUserAddress {
  country?: string;
  zipCode?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
}

export interface IUserBusiness {
    companyName?: string;
    type?: string;
    vat?: string;
    administrator?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
}
export interface IUserLogin {
  phoneNumber: string;
  phoneVerified?: boolean;
  email: string;
  emailVerified?: boolean;
  countryCode?: string;
}

export interface IUserPassword {
  currentUserPassword: string;
  newUserPassword: string;
  confirmPassword?: string;
}

export interface IUserSecurity {
  twoFactorsAuthEnabled: boolean;
  transactionNotification: {
    phone: boolean;
    email: boolean;
  };
  authorizationNotification: {
    phone: boolean;
    email: boolean;
  };
}

export interface IMyUserBankAccountPayload {
  number: string;
  iban: string;
  bankId: string;
  fullName: string;
}

export interface IUserInfoResponse {
  person: IUserInfo;
  contact: IUserLogin;
  type: string;
  status: string;
  business: IUserBusiness;
  address: IUserAddress;
  security: IUserSecurity;
}

export interface IGetUserInfoResponse {
  profile: IUserInfoResponse;
}

export interface IUserBankAccountRecord {
  fullName: string;
  iban: string;
  bankAccountNumber: string;
  swift: string;
  name: string;
  bic: string;
  address: string;
  number?: string;
  bankId?: string;
  id?: string;
}

export interface IUserBankAccount {
  details: IUserBankAccountRecord;
  id?: string;
}

export type IUserBankAccountRecords = { records: IUserBankAccount[] };

export type IGetUserInfoApiResponse = IApiResponse<IGetUserInfoResponse>;

export type IGetUserBankAccountApiResponse = IApiResponse<IUserBankAccountRecords>;

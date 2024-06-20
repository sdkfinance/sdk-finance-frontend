import type { TOrganizationStatus, TRole } from '../../constants';
import type { IApiResponse } from '../../types';
import type { TPersonTypes } from '../contracts';

export type TUserInfo = {
  first: string;
  last: string;
  middle?: string;
};

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

export interface IUserRoleItem {
  bundleKey: string;
  code: string;
  permissions: string[];
}
export type TUserSex = 'MALE' | 'FEMALE';
export type TUserProfileAdditional = {
  referenceToProfilePhoto?: string;
  paidInvoicesAmount?: number;
  sex?: TUserSex;
  type: string;
  birthday?: string;
};
export interface IUserInfoResponse {
  person: IUserInfo;
  contact: IUserLogin;
  type: TPersonTypes;
  status: TOrganizationStatus;
  business: IUserBusiness;
  address: IUserAddress;
  security: IUserSecurity;
  additional: TUserProfileAdditional;
  role: IUserRoleItem[];
}

export type TProfileMembership = {
  organizationId: string;
  roleName: TRole;
};
export interface IGetUserInfoResponse {
  profile: IUserInfoResponse;
  memberShips: TProfileMembership[];
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

export interface IResetKycStatusPayload {
  fields?: string[];
}

export type IUserBankAccountRecords = { records: IUserBankAccount[] };

export type IGetUserInfoApiResponse = IApiResponse<IGetUserInfoResponse>;

export type IGetUserBankAccountApiResponse = IApiResponse<IUserBankAccountRecords>;

export type TChangeUserIdentificationStatusRequestPayload = {
  notify?: boolean;
  status: TOrganizationStatus;
  requiredDocuments?: string;
};

export type TChangeUserIdentificationStatusResponse = IApiResponse<IGetUserInfoResponse>;

export type TUpdateUserAddressPayload = Pick<IUserInfoResponse, 'address'>;
export type TUpdateProfileAdditionalPayload = Pick<IUserInfoResponse, 'additional'>;

import type { TOrganizationStatus, TUpdateUserParamType, TUpdateUserReason } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';

export interface IUsersFilter {
  ids?: string[];
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  text?: string;
  banned?: boolean;
  active?: boolean;
  roles?: string[];
  identificationStatus?: string;
  organizationIds?: string[];
  iban?: string;
  tid?: string;
  virtualAccountNumber?: string;
  personalId?: string;
}

export interface IUsersSort {
  createdAt?: string;
  active?: string;
}

interface IUserContract {
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  countryCode: string;
}

interface IUserOrganization {
  id: string;
  type: string;
  name: string;
  identificationStatus: string;
  organizationStatus: TOrganizationStatus;
}

export interface IUserContractInfo {
  id: string;
  personType: string;
  name: string;
}

interface IUserMemberRecord {
  id: string;
  role: string;
  organization: IUserOrganization;
  contract_info: IUserContractInfo;
}

export interface IUserRecord {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  activeReason?: TUpdateUserReason;
  activeDescription?: string;
  frozen: boolean;
  frozenReason?: TUpdateUserReason;
  frozenDescription?: string;
  banned: boolean;
  defaultUser?: boolean;
  banExpiryDate?: string;
  contact: IUserContract;
  members: IUserMemberRecord[];
}

export type TUserRecordShort = Pick<IUserRecord, 'id' | 'name'> & {
  profileOrganizationId: string;
};

export interface IUserCreateBody {
  login: string;
  role: string;
  organizationId?: string | null;
  legalType?: string | null;
}

export interface IUserValid {
  user: {
    id: string;
    name: string;
    profileOrganizationId: string;
  };
}

export interface IUserNote {
  id: string;
  note: string;
  createdAt: string;
}

export interface IInvestigationNote extends IUserNote {
  name: string;
  role: string;
}

export interface ICreateUserNoteBody {
  userId: string;
  note: string;
}

export interface ICreateUserNoteResponse {
  noteDto: IUserNote;
}

export type TUpdateUserPayload = {
  paramType: TUpdateUserParamType;
  paramValue: boolean;
  reason?: TUpdateUserReason;
  description?: string;
};

export type IGetUsersOptions = IPaginationRequestOptions<IUsersFilter, IUsersSort>;
export type IGetUsersResponse = IPaginationResponse<IUserRecord>;
export type IGetUsersApiResponse = IApiResponse<IGetUsersResponse>;
export type TGetUserNoteApiResponse = IApiResponse<{ notes: IUserNote[] }>;
export type TUpdateUserResponse = IApiResponse<{ user: IUserRecord }>;

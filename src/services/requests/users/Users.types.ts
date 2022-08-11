import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

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
  status: string;
  message: string;
  id: string;
  type: string;
  name: string;
  identificationStatus: string;
}

interface IUserContractInfo {
  id: string;
  personType: string;
  name: string;
}

interface IUserMemberRecord {
  id: string;
  role: string;
  organization: IUserOrganization;
  'contract_info': IUserContractInfo;
}

export interface IUserRecord {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  banned: boolean;
  banExpiryDate: string;
  contact: IUserContract;
  members: IUserMemberRecord[];
}

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

export type IGetUsersOptions = IPaginationRequestOptions<IUsersFilter, IUsersSort>;
export type IGetUsersResponse = IPaginationResponse<IUserRecord>;
export type IGetUsersApiResponse = IApiResponse<IGetUsersResponse>;

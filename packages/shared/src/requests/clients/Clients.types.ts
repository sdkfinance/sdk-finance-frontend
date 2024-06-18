import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse, IPlainObject } from '../../types';

// Real filter list in current API
export interface IClientsFilter {
  ids: string[];
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  text: string;
  banned: boolean;
  active: boolean;
  roles: string[];
  organizationIds: string[];
  identificationStatus: string;
}

// Existing response
export interface IClientsRecord {
  id: string;
  name: string;
  createdAt: string;
  active: boolean;
  banned: boolean;
  defaultUser: boolean;
  banExpiryDate: string;
  contact: IClientContract;
  members: IClientMember[];
}

// Hardcoded response
export interface IHardcodedClientsRecord {
  clientId: string | number;
  organizationId: string | number;
  clientRole: string;
  email: string;
  phone: string;
  cohort: '1W' | '10W' | '100W';
  contract: string;
  investigations: string | null;
  profileStatus: 'active' | 'inactive';
  kycStatus: string;
  lastLogin: string;
  lastTransaction: string;
}

export interface IClientContract {
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  countryCode: string;
}

export interface IClientMember {
  id: string;
  role: string;
  organization: IClientOrganization;
}

export interface IClientOrganization {
  id: string;
  type: string;
  name: string;
  organizationStatus: string;
  contract_info: IClientContractInfo;
}

export interface IClientContractInfo {
  id: string;
  personType: string;
  name: string;
}

export type IGetClientsOptions = IPaginationRequestOptions<IClientsFilter, IClientsRecord>;
export type IGetClientsResponse = IPaginationResponse<IPlainObject>;
export type IGetClientsApiResponse = IApiResponse<IGetClientsResponse>;

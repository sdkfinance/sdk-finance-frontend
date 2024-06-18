// @ts-nocheck
import type { TOrganizationStatus, TOrganizationType } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { TContractRecordShort } from '../contracts/Contracts.types';

export interface IOrganizationTypes {
  additionalIssuableCoinTypes?: string[];
  autoDeletable?: boolean;
  registrable?: boolean;
  coinType?: string;
  issuableCoinTypes?: string[];
  bundleKey?: string;
  business?: string;
  code?: string;
}

export interface IOrganizationsFilter {
  types?: string[];
  emitentId?: string;
  organizationTypes?: IOrganizationTypes[];
}

export interface IOrganizationsSort {
  createdAt?: string;
}

export interface IOrganizationRecord {
  contract_info: TContractRecordShort;
  id: string;
  identificationStatus: string;
  name: string;
  type: TOrganizationType;
}

export type TOrganizationShort = Pick<IOrganizationRecord, 'id' | 'name' | 'type' | 'contract_info'> & {
  organizationStatus: TOrganizationStatus;
};

export type IGetOrganizationsOptions = IPaginationRequestOptions<IOrganizationsFilter, IOrganizationsSort>;
export type IGetOrganizationsResponse = IPaginationResponse<IOrganizationRecord>;
export type IGetOrganizationsApiResponse = IApiResponse<IGetOrganizationsResponse>;

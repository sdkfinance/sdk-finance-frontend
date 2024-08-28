import type { TTransactionTypeAll, TTxType } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { IOrganizationRecord } from '../organizations';

export interface IAccountSetting {
  label?: string;
  name: string;
  value: object;
}
export interface IAccountSettingRequest {
  fields: IAccountSetting[];
}

export interface ISupportTransaction {
  paymentWay: string;
  transactionType: TTxType;
}

export interface IGate {
  name: string;
}

export interface IGateSetting {
  id: string;
  name: string;
  organization: IOrganizationRecord;
  gate: IGate;
  debtAllowed: boolean;
  supportedOperations: ISupportTransaction[];
  active: boolean;
}

export interface IVendorRecord extends Pick<IGateSetting, 'id' | 'debtAllowed' | 'active' | 'name'> {
  createdAt: string;
  system: boolean;
  supportedOperations: TTransactionTypeAll[];
}

export interface IGateRecord {
  name: string;
  id: string;
  custom: boolean;
  linkedVendors: string[];
}

export interface IGateProvidersFilter {
  vendorName?: string;
  active?: boolean;
  vendorId?: string;
  system?: boolean;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface IGateProvidersSort {
  createdAt?: string;
}

export type IGateProvidersOptions = IPaginationRequestOptions<IGateProvidersFilter, IGateProvidersSort>;

export type ICustomProviderResponse = Pick<IGateSetting, 'id' | 'name' | 'gate'>;

export interface IViewGateResponse {
  gates: IGateRecord[];
}

export interface IGateSettingResponse {
  records: IGateSetting[];
}

export interface IVendorsResponse {
  records: IVendorRecord[];
}

export type IGateSettingApiResponse = IApiResponse<IPaginationResponse<IGateSettingResponse>>;

export interface ICreateGateProviderPayload {
  vendorName: string;
  debtAllowed: boolean;
  active?: boolean;
}

export interface IUpdateGateProviderPayload extends ICreateGateProviderPayload {
  gateProviderId: string;
}

export type TViewVendorsResponse = IPaginationResponse<IVendorRecord>;
export type TViewVendorsApiResponse = IApiResponse<TViewVendorsResponse>;

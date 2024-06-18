import type { PERSON_TYPES } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';
import type { ICommissionRecord, ILimitBody } from './Commissions.types';

export type TPersonTypes = keyof typeof PERSON_TYPES;

export interface IContractsFilter {
  id?: string;
  types?: string[];
  global?: boolean;
  personTypes?: TPersonTypes[];
  dateFrom?: string;
  dateTo?: string;
  description?: string;
}

export interface IContractRecord {
  id: string;
  organizationType: string;
  personType: TPersonTypes;
  name: string;
  description: string;
  active: boolean;
  global: boolean;
}

export type TContractRecordShort = Pick<IContractRecord, 'id' | 'personType' | 'name'>;

export interface ICustomContractBody {
  name: string;
  copyLimits: boolean;
}

export type TUpdateContractPayload = {
  name: string;
  active?: boolean;
};

export type IGetContractsOptions = IPaginationRequestOptions<IContractsFilter, IContractRecord>;
export type IGetContractsResponse = IPaginationResponse<IContractRecord>;
export type IGetContractsApiResponse = IApiResponse<IGetContractsResponse>;
export type ILimitBodyUpdate = Pick<ILimitBody, 'active' | 'value'>;
export type ISystemCommissionBodyUpdate = Pick<ICommissionRecord, 'active' | 'value' | 'direction'>;
export type ISystemLimitBody = Omit<ILimitBody, 'txType' | 'productId'>;

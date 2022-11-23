import { PERSON_TYPES } from '@/constants';
import { ILimitBody, ISystemCommissionBody } from '@/services/requests/contracts/Commissions.types';
import { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '@/types/interfaces';

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

export interface IContractsSort {
  id: string;
  organizationType: string;
  personType: TPersonTypes;
  name: string;
  description: string;
  active: boolean;
  global: boolean;
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

export interface ICustomContractBody {
   name: string;
   copyLimits: boolean;
}

export type IGetContractsOptions = IPaginationRequestOptions<IContractsFilter, IContractsSort>;
export type IGetContractsResponse = IPaginationResponse<IContractRecord>;
export type IGetContractsApiResponse = IApiResponse<IGetContractsResponse>;
export type ILimitBodyUpdate = Pick<ILimitBody, 'active' | 'value'>;
export type ISystemCommissionBodyUpdate = Pick<ISystemCommissionBody, 'active' | 'value' | 'direction'>;
export type ISystemLimitBody = Omit<ILimitBody, 'txType' | 'productId'>;

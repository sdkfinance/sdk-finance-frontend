import type { TCommissionDirection, TCommissionType, TQualifierType, TTimeUnit, TTxType } from '../../constants';
import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse, TSortType } from '../../types';
import type { IOperationFlowRecord } from '../catalogs/Catalogs.types';
import type { ICurrency, ICurrencyShort } from '../currencies';
import type { TGateProduct } from '../gate-products/GateProducts.types';
import type { IContractRecord } from './Contracts.types';

export type TCommissionCollector = 'BANK' | 'PROVIDER' | 'SDK_FINANCE' | 'TOTAL';
export type TSpecification = 'no' | 'personType';

export interface IProviderCreateBody extends Pick<IGateCommissionProfile, 'gateProductName' | 'gateProviderId'> {
  currencyId?: string;
  active?: boolean;
}

export interface IUpdateGateCommissionProfilePayload extends Pick<IGateCommissionProfile, 'active'> {
  gateProfileId: string;
}

export interface IGateCommissionProfile {
  createdAt: string;
  id: string;
  gateProviderId: string;
  gateProductName?: string;
  gateProviderName?: string;
  providerCurrency: ICurrency;
  updatedAt: string;
  active: boolean;
}

export interface TCommissionValue {
  type: TCommissionType | null;
  valuePercent?: number | null;
  valueFixed?: number | null;
}

export interface IProviderTableRecord {
  id: string;
  provider: string;
  currency: string;
  active: boolean;
  rawProfile: IGateCommissionProfile;
}

export interface ILimitsRecord {
  active: boolean;
  gateProfileId: string;
  id: string;
  qualifier: TQualifierType;
  timeUnit: TTimeUnit;
  txType: string;
  value: number;
  product?: TGateProduct;
}

export interface ILimitBody {
  id?: string;
  txType?: TTxType | null;
  productId?: string | null;
  qualifier: TQualifierType | null;
  timeUnit: TTimeUnit | null;
  value?: number | null;
  active: true;
}

export interface IContractBody {
  organizationId: string;
  contractId: string;
}

export interface ICommissionRecord {
  active: boolean;
  createdAt: string;
  updatedAt: string;
  destParticipantSpecification: {
    type: TSpecification;
  };
  direction?: TCommissionDirection;
  flow: IOperationFlowRecord;
  id: string;
  currency: ICurrencyShort;
  srcParticipantSpecification: {
    type: TSpecification;
    value: string;
  };
  value: TCommissionValue;
  contract: IContractRecord;
  destinationCurrency?: ICurrencyShort;
  commissionRules: ICommissionRule[];
}

export interface ICreateSystemCommission {
  currencyId: string;
  operationFlowId: string;
}

export interface ICreateMultiCurrencySystemCommission extends Pick<ICreateSystemCommission, 'operationFlowId'> {
  destinationCurrencyId: string;
  sourceCurrencyId: string;
}

export interface ICommissionRuleType {
  type: TCommissionType;
  valueFixed?: string | number | null;
  valuePercent?: string | number | null;
}

export interface ICommissionRuleCondition<T = ICommissionRuleType> {
  id: string | null;
  beginAmount: number | string;
  endAmount: number | string;
  value: T;
}

export interface ICommissionRule<T = ICommissionRuleCondition[]> {
  id: string;
  beginDate: string;
  endDate: string;
  feeDirection: TCommissionDirection;
  active: boolean;
  conditions: T;
  txType: TTxType;
}

export type TGateCommissionRuleConditions = Record<TCommissionCollector, ICommissionRuleCondition[]>;

export type TProviderCommissionRule<T = TGateCommissionRuleConditions> = ICommissionRule<T> & {
  txType: TTxType;
};

export type IProductCommissionRule<T = TGateCommissionRuleConditions> = ICommissionRule<T> & {
  payToolType: boolean;
  payToolPresent: boolean;
  product: TGateProduct;
};

export interface ICommissionRuleConditionPayload {
  beginAmount: number;
  endAmount: number;
  commission: ICommissionRuleType;
}

export type TGateCommissionRuleConditionPayload = ICommissionRuleConditionPayload & {
  collector: TCommissionCollector;
};

export type TProductCommissionRuleConditionPayload = TGateCommissionRuleConditionPayload & {
  productId: string;
};

export interface ICommissionRulePayload {
  beginDate: string;
  endDate: string;
  direction: string;
  active: boolean;
}

export type TCommissionRulePayloadWithTxType = ICommissionRulePayload & {
  txType?: TTxType;
};

export type TProviderCommissionRulePayload = TCommissionRulePayloadWithTxType & {
  payToolType?: string;
  payToolPresent?: boolean;
};

export type TProductCommissionRulePayload = Required<TCommissionRulePayloadWithTxType> & {
  payToolType?: string;
  payToolPresent?: boolean;
  productId?: string;
};

export interface ICommissionRuleReq {
  date?: string | Date;
  filterCriteria?: 'FOR_DATE' | 'BEFORE_DATE' | 'FROM_DATE';
}

export type TCommissionProviderRuleReq = ICommissionRuleReq & {
  txType: TTxType;
};

export type TViewGateProfilesPayload = {
  types: TTxType[];
};

export type TViewGateCommissionProfilesRequestFilters = {
  txTypes?: TTxType[];
  currencyIds?: string[];
  providerIds?: string[];
  providerName?: string;
};

export type TViewGateCommissionProfilesRequestSort = {
  createdAt?: TSortType;
};

export type TViewCommissionProfilesRequestPayload = IPaginationRequestOptions<
  TViewGateCommissionProfilesRequestFilters,
  TViewGateCommissionProfilesRequestSort
>;

export type IGateCommissionProfilesResponse = { records: IGateCommissionProfile[] };
export type IGetGateCommissionProfilesApiResponse = IApiResponse<IGateCommissionProfilesResponse>;
export type TViewGateCommissionProfilesPaginationResponse = IApiResponse<IPaginationResponse<IGateCommissionProfile>>;

export type ICommissionGateProfileResponse = { profile: IGateCommissionProfile };
export type ICommissionGateProfileApiResponse = IApiResponse<ICommissionGateProfileResponse>;

export type ICommissionProfilesResponse = { records: ICommissionRecord[] };
export type ICommissionProfilesApiResponse = IApiResponse<ICommissionProfilesResponse>;

export type ICommissionRuleListResponse = { records: ICommissionRule[] };
export type ICommissionRuleApiResponse = IApiResponse<ICommissionRuleListResponse>;

export type TProviderCommissionRuleListResponse = { records: TProviderCommissionRule[] };
export type TProviderCommissionRuleApiResponse = IApiResponse<TProviderCommissionRuleListResponse>;

export type ICommissionProfileResponse = { profile: ICommissionRecord };
export type ICommissionProfileApiResponse = IApiResponse<ICommissionProfileResponse>;

export type ILimitsResponse = { records: ILimitsRecord[] };
export type ILimitsApiResponse = IApiResponse<ILimitsResponse>;

export type TProductCommissionRuleResponse = { records: IProductCommissionRule[] };
export type TProductCommissionRuleApiResponse = IApiResponse<TProductCommissionRuleResponse>;

export type TUpdateProviderCommissionConditionResponse = IApiResponse<TProviderCommissionRuleListResponse>;

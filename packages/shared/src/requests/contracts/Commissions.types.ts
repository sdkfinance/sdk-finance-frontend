import type {
  TVendorOperationCommissionRecord,
  TVendorOperationCommissionRecordRule,
} from '@sdk5/back-office/src/modules/vendors/types/vendor.types';

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

export type TCommissionProfileType = 'SYSTEM' | 'VENDOR';

export interface ICommissionProfileRecord {
  id: string;
  type: TCommissionProfileType;
  vendorId: string;
  firstCurrencyId: string;
  secondCurrencyId: string;
  contractId: string;
  flowId: string;
  productId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  rules: IProviderCommissionRule[];
  limitRules: IProviderCommissionLimitRule[];
}
export type TCommissionLimitQualifier = 'quantity' | 'amount';

export interface ICommissionLimitRecord {
  active: boolean;
  timeUnit: TTimeUnit;
  value: number;
  name: string;
  id: string;
  qualifier: TCommissionLimitQualifier;
}
interface IProviderCommissionLimitRule extends Pick<ICommissionLimitRecord, 'id' | 'active' | 'value' | 'name' | 'qualifier' | 'timeUnit'> {
  profileId: string;
}

interface IProviderCommissionRule {
  id: string;
  profileId: string;
  active: boolean;
  beginDate: string;
  endDate: string;
  direction: string;
  conditions: ICommissionRuleCondition[];
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

export interface ICommissionProfilesSortOptions {
  createdAt?: TSortType;
}

export type TViewCommissionProfilesRequestPayload = IPaginationRequestOptions<
  TViewGateCommissionProfilesRequestFilters,
  TViewGateCommissionProfilesRequestSort
>;

export interface ICommissionProfileFilter {
  active?: boolean;
  type: TCommissionProfileType;
  firstCurrency?: string;
  secondCurrency?: string;
  currencies?: string[];
  operationType?: string;
  productId?: string;
  vendorId: string;
  contractId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  profileId?: string;
}

export interface ICommissionProfileRulesViewFilter {
  active: boolean;
  beginAtFrom: string;
  beginAtTo: string;
  endAtFrom: string;
  endAtTo: string;
}

export type ICommissionProfileRulesViewPayload = IPaginationRequestOptions<Partial<ICommissionProfileRulesViewFilter>, any>;

export interface ICommissionProfileRule {
  id: string;
  profileId: string;
  active: boolean;
  beginDate: string;
  endDate: string;
  direction: TCommissionDirection;
  conditions: ICommissionProfileRuleCondition[];
}

export interface ICommissionProfileRuleCondition {
  id: string;
  beginAmount: number;
  endAmount: number;
  value: ICommissionProfileRuleConditionValue;
}

export interface ICommissionProfileRuleConditionValue {
  type: string;
  valuePercent: number;
  valueFixed: number;
  maxAmount: number;
  minAmount: number;
  collector: string;
}

export interface ICommissionProfileTogglePayload {
  active: boolean;
}

export interface ICommissionProfileRuleViewResponse {
  records: ICommissionProfileRule[];
}

export interface IViewRuleCondition {
  conditionType?: string;
  amountFrom?: number;
  amountTo?: number;
  valueFixed?: number;
  valuePercent?: number;
  maxAmount?: number;
  minAmount?: number;
  createdAt?: string;
  beginDate?: string;
  endDate?: string;
  ruleActive?: boolean;
  ruleId?: string;
  conditionId?: string;
  direction?: TCommissionDirection;
}

export interface IViewLimitRule extends Pick<ICommissionLimitRecord, 'value' | 'qualifier' | 'timeUnit' | 'name' | 'active'> {
  limitId: string;
}

export type IGateCommissionProfilesResponse = { records: IGateCommissionProfile[] };
export type IGetGateCommissionProfilesApiResponse = IApiResponse<IGateCommissionProfilesResponse>;
export type TViewGateCommissionProfilesPaginationResponse = IApiResponse<IPaginationResponse<IGateCommissionProfile>>;

export type ICommissionGateProfileResponse = { profile: IGateCommissionProfile };
export type ICommissionGateProfileApiResponse = IApiResponse<ICommissionGateProfileResponse>;

export type ICommissionProfileRuleViewApiPaginationResponse = IPaginationResponse<ICommissionProfileRule>;
export type ICommissionProfileRuleViewApiResponse = IApiResponse<ICommissionProfileRuleViewApiPaginationResponse>;

export type ICommissionProfilesOptions = IPaginationRequestOptions<Partial<ICommissionProfileFilter>, Partial<ICommissionProfilesSortOptions>>;
export type ICommissionProfilesResponse = { records: ICommissionRecord[] };
export type IVendorCommissionProfilesResponse = IPaginationResponse<ICommissionProfileRecord>;
export type ICommissionProfilesApiResponse = IApiResponse<ICommissionProfilesResponse>;
export type IVendorCommissionProfilesApiResponse = IApiResponse<IVendorCommissionProfilesResponse>;

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

export type IGetLimitRuleDataResponse = { records: ICommissionLimitRecord[] };
export type IGetLimitRuleDataApiResponse = IApiResponse<IGetLimitRuleDataResponse>;

export type IGetCommissionRulesDetailsResponse = { rule: TVendorOperationCommissionRecord };
export type IGetCommissionRuleDetailsApiResponse = IApiResponse<IGetCommissionRulesDetailsResponse>;

export type IGetCommissionRuleResponse = { rule: TVendorOperationCommissionRecord };
export type IGetCommissionRuleApiResponse = IApiResponse<IGetCommissionRuleResponse>;

export type ICommissionLimitResponse = { rule: ICommissionLimitRecord };
export type ICommissionLimitApiResponse = IApiResponse<ICommissionLimitResponse>;

export type ICommissionConditionCreateResponse = { condition: TVendorOperationCommissionRecordRule };
export type ICommissionConditionCreateApiResponse = IApiResponse<ICommissionConditionCreateResponse>;

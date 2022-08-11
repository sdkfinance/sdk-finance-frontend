import { IApiResponse } from '@/types/interfaces';
import {
  COMMISSION_TYPES,
  TIME_UNITS,
  TRANSACTION_TYPES,
  COIN_TYPES,
  QUALIFIER,
  COMMISSION_DIRECTION,
} from '@/constants';

export type TTxType = 'TOPUP' | 'REDEEM';
export type TCommissionType = keyof typeof COMMISSION_TYPES;
export type TCommissionDirection = keyof typeof COMMISSION_DIRECTION;
export type TTransactionType = keyof typeof TRANSACTION_TYPES;
export type TCoinType = keyof typeof COIN_TYPES;
export type TSpecification = 'no' | 'personType';
export type TTimeUnit = keyof typeof TIME_UNITS;
export type TQualifierType = keyof typeof QUALIFIER;

export interface IProviderCreateBody {
  gateProviderId: string;
  currencyCode: string;
}

export interface IProviderRecord {
  createdAt: string;
  id: string;
  gateProviderId: string;
  providerCurrency: {
    code: string;
    digitalCode: string;
    symbol: string;
    name: string;
  };
  updatedAt: string;
}

export interface TCommissionValue {
  type: TCommissionType | null;
  valuePercent?: number | null;
  valueFixed?: number | null;
}

export interface ICommissionSettingRecord {
  active: boolean;
  collector: 'PROVIDER' | 'TOTAL';
  direction: string;
  id: string;
  txType: TTxType;
  commissionDirection?: TCommissionDirection;
  value: TCommissionValue;
}

export interface IProviderTableRecord {
  id: string;
  provider: string;
  currency: string;
}

export interface ILimitsRecord {
  active: boolean;
  gateProfileId: string;
  id: string;
  qualifier: string;
  timeUnit: TTimeUnit;
  txType: string;
  value: number;
}

export interface ILimitBody {
  id?: string;
  txType?: TTxType | null;
  productId?: string | null;
  qualifier: TQualifierType | null;
  timeUnit: TTimeUnit | null;
  value: number | null;
  active: true;
}
export interface ICommissionBody {
  txType: TTxType | null;
  providerCommission?: TCommissionValue;
  totalCommission?: TCommissionValue;
  active: boolean;
}

export interface ICommissionProfile {
  createdAt: string;
  id: string;
  gateProviderId: string;
  providerCurrency: {
    code: string;
    digitalCode: string;
    name: string;
    symbol: string;
  };
  updatedAt: string;
}

export interface ICommissionRecord {
  active: boolean;
  createdAt: string;
  updatedAt: string;
  destParticipantSpecification: {
    type: TSpecification;
  };
  direction?: TCommissionDirection;
  flow: {
    id: string;
    code: string;
    transactionType: TTransactionType;
    processType: string;
    srcCoinType: TCoinType;
    destCoinType: TCoinType;
  };
  id: string;
  issuer: {
    id: string;
    sn: string;
    currency: string;
  };
  srcParticipantSpecification: {
    type: TSpecification;
    value: string;
  };
  value: TCommissionValue;
}

export interface ICreateSystemCommission {
  issuerId: string;
  operationFlowId: string;
  srcParticipantSpecification: {
    type: TSpecification;
    value?: string | null;
  };
  destParticipantSpecification: {
    type: TSpecification;
    value?: string | null;
  };
}

export interface ISystemCommissionBody {
  issuerId: string;
  operationFlowId: string;
  srcParticipantSpecification: {
    type: TSpecification;
    value?: string | null;
  };
  destParticipantSpecification: {
    type: TSpecification;
    value?: string | null;
  };
  direction?: TCommissionDirection;
  active?: boolean;
  value: TCommissionValue;
}

export interface ICommissionRuleType {
  type: string;
  valueFixed?: string | null;
  valuePercent?: string | null;
}

export interface ICommissionRuleCondition {
  id: string | null;
  beginAmount: number | string;
  endAmount: number | string;
  value: ICommissionRuleType;
}

export interface ICommissionRule {
  id: string;
  beginDate: string;
  endDate: string;
  feeDirection: string;
  active: boolean;
  conditions: ICommissionRuleCondition[];
}

export interface ICommissionRuleConditionPayload {
  beginAmount: number;
  endAmount: number;
  commission: ICommissionRuleType;
}

export interface ICommissionRulePayload {
  beginDate: string;
  endDate: string;
  direction: string;
  active: boolean;
}

export interface ICommissionRuleReq {
  date?: string | Date;
  filterCriteria?: 'FOR_DATE' | 'BEFORE_DATE' | 'FROM_DATE';
}

export type IProvidersResponse = { records: IProviderRecord[] };
export type IProvidersApiResponse = IApiResponse<IProvidersResponse>;

export type ICommissionSettingsResponse = { records: ICommissionSettingRecord[] };
export type ICommissionSettingsApiResponse = IApiResponse<ICommissionSettingsResponse>;

export type ICommissionGateProfileResponse = { profile: ICommissionProfile };
export type ICommissionGateProfileApiResponse = IApiResponse<ICommissionGateProfileResponse>;

export type ICommissionProfilesResponse = { records: ICommissionRecord[] };
export type ICommissionProfilesApiResponse = IApiResponse<ICommissionProfilesResponse>;

export type ICommissionRuleListResponse = { records: ICommissionRule[] };
export type ICommissionRuleApiResponse = IApiResponse<ICommissionRuleListResponse>;

export type ICommissionProfileResponse = { profile: ICommissionRecord };
export type ICommissionProfileApiResponse = IApiResponse<ICommissionProfileResponse>;

export type ILimitsResponse = { records: ILimitsRecord[] };
export type ILimitsApiResponse = IApiResponse<ILimitsResponse>;

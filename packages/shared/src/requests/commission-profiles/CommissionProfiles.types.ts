import type { TTransactionTypeAll } from '../../constants';
import type { IApiResponse } from '../../types';
import type { ICommissionProfileRecord, IViewLimitRule, IViewRuleCondition, TCommissionProfileType } from '../contracts';

export interface IAggregatedCommissionProfile
  extends Pick<ICommissionProfileRecord, 'productId' | 'contractId' | 'flowId' | 'firstCurrencyId' | 'secondCurrencyId'> {
  profileId: string;
  profileType: TCommissionProfileType;
  productName: string;
  flowCode: TTransactionTypeAll;
  firstCurrencyCode: string;
  secondCurrencyCode: string;
  ruleConditions: IViewRuleCondition[];
  limitRules: IViewLimitRule[];
}
export interface IAggregatedCommissionProfilesByVendor {
  vendorId: string;
  vendorName: string;
  profiles: IAggregatedCommissionProfile[];
}

export type TViewAggregatedCommissionProfilesByVendorApiResponse = IApiResponse<{ records: IAggregatedCommissionProfilesByVendor[] }>;

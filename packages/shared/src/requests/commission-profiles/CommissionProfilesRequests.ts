import type {
  TCommissionLimitCreatePayload,
  TCommissionLimitUpdatePayload,
} from '@sdk5/back-office/src/modules/vendors/types/commission-limit.types';
import type {
  ICreateCommissionProfilePayload,
  TVendorCreateCommissionRulePayload,
  TVendorRuleConditionCreatePayload,
} from '@sdk5/back-office/src/modules/vendors/types/vendor.types';

import { api } from '../../api';
import type { IPlainObject } from '../../types';
import type {
  ICommissionConditionCreateApiResponse,
  ICommissionLimitApiResponse,
  ICommissionProfileRulesViewPayload,
  ICommissionProfileRuleViewApiResponse,
  ICommissionProfilesOptions,
  ICommissionProfileTogglePayload,
  IGetCommissionRuleApiResponse,
  IGetCommissionRuleDetailsApiResponse,
  IGetLimitRuleDataApiResponse,
  IVendorCommissionProfilesApiResponse,
} from '../contracts';
import type { TCommissionProfileType } from '../contracts';
import type { TViewAggregatedCommissionProfilesByVendorApiResponse } from './CommissionProfiles.types';

export const CommissionProfilesRequests = {
  createCommissionProfile: (payload: ICreateCommissionProfilePayload) => {
    return api.post('/commission-profile', payload);
  },

  viewCommissionProfiles(payload: ICommissionProfilesOptions): Promise<IVendorCommissionProfilesApiResponse> {
    return api.post('/commission-profile/view', payload);
  },

  toggleCommissionProfile(profileId: string, payload: ICommissionProfileTogglePayload): Promise<IVendorCommissionProfilesApiResponse> {
    return api.patch(`/commission-profile/${profileId}`, payload);
  },

  viewCommissionRules(profileId: string, payload: ICommissionProfileRulesViewPayload): Promise<ICommissionProfileRuleViewApiResponse> {
    return api.post(`/commission-profile/${profileId}/rule/view`, payload);
  },

  getCommissionRulesDetails(profileId: string, ruleId: string): Promise<IGetCommissionRuleDetailsApiResponse> {
    return api.get(`/commission-profile/${profileId}/rule/${ruleId}`);
  },

  getLimitRuleData(profileId: string): Promise<IGetLimitRuleDataApiResponse> {
    return api.get(`/commission-profile/${profileId}/limit-rule`);
  },

  createLimitRule(profileId: string, payload: TCommissionLimitCreatePayload): Promise<ICommissionLimitApiResponse> {
    return api.post(`/commission-profile/${profileId}/limit-rule`, payload);
  },

  updateLimitRule(profileId: string, limitRuleId: string, payload: TCommissionLimitUpdatePayload): Promise<ICommissionLimitApiResponse> {
    return api.patch(`/commission-profile/${profileId}/limit-rule/${limitRuleId}`, payload);
  },

  createNewCommissionRule(profileId: string, payload: TVendorCreateCommissionRulePayload): Promise<IGetCommissionRuleApiResponse> {
    return api.post(`/commission-profile/${profileId}/rule`, payload);
  },

  updateCommissionRule(profileId: string, ruleId: string, payload: TVendorCreateCommissionRulePayload): Promise<IGetCommissionRuleApiResponse> {
    return api.patch(`/commission-profile/${profileId}/rule/${ruleId}`, payload);
  },

  createRuleCondition(profileId: string, ruleId: string, payload: TVendorRuleConditionCreatePayload): Promise<ICommissionConditionCreateApiResponse> {
    return api.post(`/commission-profile/${profileId}/rule/${ruleId}/condition`, payload);
  },

  updateRuleCondition(
    profileId: string,
    ruleId: string,
    conditionId: string,
    payload: TVendorRuleConditionCreatePayload,
  ): Promise<ICommissionConditionCreateApiResponse> {
    return api.put(`/commission-profile/${profileId}/rule/${ruleId}/condition/${conditionId}`, payload);
  },

  deleteRuleCondition(profileId: string, ruleId: string, conditionId: string): Promise<IPlainObject> {
    return api.delete(`/commission-profile/${profileId}/rule/${ruleId}/condition/${conditionId}`);
  },

  getAggregatedCommissionProfiles(
    commissionProfileType: TCommissionProfileType = 'VENDOR',
    contractId?: string,
  ): Promise<TViewAggregatedCommissionProfilesByVendorApiResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('profileType', commissionProfileType);

    if (contractId) {
      searchParams.append('contractId', contractId);
    }

    return api.get(`/commission-profile/view?${searchParams.toString()}`);
  },
};
